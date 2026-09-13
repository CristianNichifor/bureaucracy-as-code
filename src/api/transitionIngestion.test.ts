import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserIdentityProvider } from "../identity/BrowserIdentityProvider";
import type { DemoIdentity } from "../identity/types";
import { calculateLaw544Deadline } from "../law544/deadlines";
import { LocalLedgerProvider } from "../ledger/LocalLedgerProvider";
import { hashJson, sha256Hex } from "../shared/crypto";
import { memoryStorage } from "../shared/memoryStorage";
import { InMemoryRequestRepository } from "./InMemoryRequestRepository";
import { createCanonicalSigningEnvelope, TransitionIngestionService, transitionPurpose } from "./transitionIngestion";
import type { ApiTransitionPayload, CreateRequestInput, IngestTransitionCommand } from "./types";

describe("TransitionIngestionService", () => {
  let identity: BrowserIdentityProvider;
  let ledger: LocalLedgerProvider;
  let requests: InMemoryRequestRepository;
  let service: TransitionIngestionService;
  let citizen: DemoIdentity;
  let registryBot: DemoIdentity;
  let director: DemoIdentity;
  let publicServant: DemoIdentity;
  let createRequest: CreateRequestInput;

  beforeEach(async () => {
    vi.stubGlobal("localStorage", memoryStorage());
    identity = new BrowserIdentityProvider();
    ledger = new LocalLedgerProvider();
    requests = new InMemoryRequestRepository();
    service = new TransitionIngestionService({ identity, ledger, requests });

    citizen = await identity.createIdentity({ displayName: "Citizen Demo", role: "Citizen" });
    registryBot = await identity.createIdentity({
      displayName: "Registry Bot",
      role: "RegistryBot",
      institution: "Ministry of Finance",
    });
    director = await identity.createIdentity({
      displayName: "Director Demo",
      role: "Director",
      institution: "Ministry of Finance",
    });
    publicServant = await identity.createIdentity({
      displayName: "Public Servant Demo",
      role: "PublicServant",
      institution: "Ministry of Finance",
    });

    const createdAt = "2026-09-14T09:00:00.000Z";
    createRequest = {
      id: "REQ-2026-api",
      institution: "Ministry of Finance",
      subject: "Budget execution data",
      citizenDidHash: await sha256Hex(citizen.did),
      createdAt,
      deadlineAt: calculateLaw544Deadline(createdAt),
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("verifies and records a complete append-only Law 544 workflow", async () => {
    await ingest("Request_Created", "Draft", "Created", citizen, { createRequest });
    await ingest("Registry_Assigned", "Created", "Registered", registryBot, {
      metadata: { registryNumber: "MF-544-2026-0001" },
    });
    await ingest("Task_Routed", "Registered", "Routed", director, {
      metadata: { assignedToDidHash: await sha256Hex(publicServant.did) },
    });
    await ingest("Processing_Started", "Routed", "InProgress", publicServant);
    await ingest("Request_Resolved", "InProgress", "Resolved", publicServant, {
      documentHash: await hashJson({ document: "response" }),
    });

    const saved = await requests.get(createRequest.id);
    const events = await ledger.listEvents();

    expect(saved).toMatchObject({
      id: createRequest.id,
      status: "Resolved",
      registryNumber: "MF-544-2026-0001",
    });
    expect(events.map((event) => event.action)).toEqual([
      "Request_Created",
      "Registry_Assigned",
      "Task_Routed",
      "Processing_Started",
      "Request_Resolved",
    ]);
    expect(await ledger.verifyChain()).toMatchObject({ valid: true, checkedEvents: 5 });
  });

  it("rejects a transition when the submitted fromStatus is stale", async () => {
    await ingest("Request_Created", "Draft", "Created", citizen, { createRequest });

    await expect(ingest("Task_Routed", "Registered", "Routed", director)).rejects.toMatchObject({
      code: "STATE_MISMATCH",
    });
    expect(await ledger.listEvents()).toHaveLength(1);
  });

  it("rejects an actor whose presented role cannot perform the transition", async () => {
    await ingest("Request_Created", "Draft", "Created", citizen, { createRequest });

    await expect(ingest("Registry_Assigned", "Created", "Registered", citizen)).rejects.toMatchObject({
      code: "TRANSITION_REJECTED",
    });
    expect(await ledger.listEvents()).toHaveLength(1);
  });

  it("rejects resolution without a document hash", async () => {
    await moveToInProgress();

    await expect(ingest("Request_Resolved", "InProgress", "Resolved", publicServant)).rejects.toMatchObject({
      code: "TRANSITION_REJECTED",
    });
  });

  it("rejects a tampered signed payload before appending", async () => {
    await ingest("Request_Created", "Draft", "Created", citizen, { createRequest });
    const command = await commandFor("Registry_Assigned", "Created", "Registered", registryBot);
    command.payload.metadata = { registryNumber: "MF-544-2026-tampered" };

    await expect(service.ingest(command)).rejects.toMatchObject({ code: "SIGNATURE_REJECTED" });
    expect(await ledger.listEvents()).toHaveLength(1);
  });

  it("rejects replaying the same signed envelope nonce", async () => {
    const command = await commandFor("Request_Created", "Draft", "Created", citizen, { createRequest });

    await service.ingest(command);

    await expect(service.ingest(command)).rejects.toMatchObject({ code: "REPLAY_REJECTED" });
    expect(await ledger.listEvents()).toHaveLength(1);
  });

  it("rejects a proof that signs a different envelope than the command envelope", async () => {
    const command = await commandFor("Request_Created", "Draft", "Created", citizen, { createRequest });
    command.envelope.nonce = "00000000-0000-4000-8000-000000000001";

    await expect(service.ingest(command)).rejects.toMatchObject({ code: "SIGNATURE_REJECTED" });
    expect(await ledger.listEvents()).toHaveLength(0);
  });

  async function moveToInProgress() {
    await ingest("Request_Created", "Draft", "Created", citizen, { createRequest });
    await ingest("Registry_Assigned", "Created", "Registered", registryBot);
    await ingest("Task_Routed", "Registered", "Routed", director);
    await ingest("Processing_Started", "Routed", "InProgress", publicServant);
  }

  async function ingest(
    action: ApiTransitionPayload["action"],
    fromStatus: ApiTransitionPayload["fromStatus"],
    toStatus: ApiTransitionPayload["toStatus"],
    actor: DemoIdentity,
    options: {
      createRequest?: CreateRequestInput;
      documentHash?: string;
      metadata?: Record<string, string>;
    } = {},
  ) {
    return service.ingest(await commandFor(action, fromStatus, toStatus, actor, options));
  }

  async function commandFor(
    action: ApiTransitionPayload["action"],
    fromStatus: ApiTransitionPayload["fromStatus"],
    toStatus: ApiTransitionPayload["toStatus"],
    actor: DemoIdentity,
    options: {
      createRequest?: CreateRequestInput;
      documentHash?: string;
      metadata?: Record<string, string>;
    } = {},
  ): Promise<IngestTransitionCommand> {
    const payload: ApiTransitionPayload = {
      requestId: createRequest.id,
      action,
      fromStatus,
      toStatus,
      documentHash: options.documentHash,
      metadata: options.metadata,
    };

    const envelope = await createCanonicalSigningEnvelope(payload);

    return {
      payload,
      envelope,
      proof: await identity.signPayload(actor, envelope),
      presentation: await identity.presentCredential({
        identity: actor,
        purpose: transitionPurpose(payload),
      }),
      createRequest: options.createRequest,
    };
  }
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserIdentityProvider } from "../identity/BrowserIdentityProvider";
import { LocalLedgerProvider } from "../ledger/LocalLedgerProvider";
import { memoryStorage } from "../shared/memoryStorage";
import { applyDemoActionViaIngestion, createInitialDemoContext } from "./scenarioLaw544";

describe("browser demo ingestion path", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("records guided demo transitions through signed API ingestion", async () => {
    const provider = new BrowserIdentityProvider();
    const ledger = new LocalLedgerProvider();
    const context = await createInitialDemoContext();

    const created = await applyDemoActionViaIngestion({
      provider,
      ledger,
      request: context.request,
      actor: context.identities.citizen,
      action: "Request_Created",
    });
    const registered = await applyDemoActionViaIngestion({
      provider,
      ledger,
      request: created,
      actor: context.identities.registryBot,
      action: "Registry_Assigned",
      metadata: { registryNumber: "MF-544-2026-0001" },
    });

    expect(registered.status).toBe("Registered");
    await expect(ledger.listEvents()).resolves.toHaveLength(2);
    await expect(ledger.verifyChain()).resolves.toMatchObject({ valid: true, checkedEvents: 2 });
  });

  it("rejects a protected transition before appending when the actor role is wrong", async () => {
    const provider = new BrowserIdentityProvider();
    const ledger = new LocalLedgerProvider();
    const context = await createInitialDemoContext();

    const created = await applyDemoActionViaIngestion({
      provider,
      ledger,
      request: context.request,
      actor: context.identities.citizen,
      action: "Request_Created",
    });

    await expect(
      applyDemoActionViaIngestion({
        provider,
        ledger,
        request: created,
        actor: context.identities.citizen,
        action: "Registry_Assigned",
        metadata: { registryNumber: "MF-544-2026-0001" },
      }),
    ).rejects.toMatchObject({ code: "TRANSITION_REJECTED" });
    await expect(ledger.listEvents()).resolves.toHaveLength(1);
  });
});

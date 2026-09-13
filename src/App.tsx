import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileUp,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { dictionaries, type Language } from "./i18n";
import { RequestFeed } from "./dashboard/RequestFeed";
import { RequestTrail } from "./dashboard/RequestTrail";
import { HashVerifier } from "./dashboard/HashVerifier";
import { GuidedProgress } from "./dashboard/GuidedProgress";
import { LedgerIntegrityPanel } from "./dashboard/LedgerIntegrityPanel";
import { RequestDetail } from "./dashboard/RequestDetail";
import {
  DEFAULT_EXPLORER_FILTERS,
  filterRequestExplorerItems,
  getSelectedExplorerItem,
  type RequestExplorerFilters,
  type RequestExplorerItem,
} from "./dashboard/requestExplorer";
import { MachineryGraph } from "./graph/MachineryGraph";
import { BrowserIdentityProvider } from "./identity/BrowserIdentityProvider";
import type { DemoContext } from "./demo/scenarioLaw544";
import { applyDemoAction, createDemoDocumentHash, createInitialDemoContext } from "./demo/scenarioLaw544";
import { seededRequestScenarios } from "./demo/seededRequests";
import { LocalLedgerProvider } from "./ledger/LocalLedgerProvider";
import type { ChainVerificationResult, LedgerEvent } from "./ledger/types";

const initialVerification: ChainVerificationResult = {
  valid: true,
  checkedEvents: 0,
};

export function App() {
  const ledger = useMemo(() => new LocalLedgerProvider(), []);
  const provider = useMemo(() => new BrowserIdentityProvider(), []);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [chainVerification, setChainVerification] = useState<ChainVerificationResult>(initialVerification);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestExplorerFilters>(DEFAULT_EXPLORER_FILTERS);
  const [language, setLanguage] = useState<Language>("en");
  const [message, setMessage] = useState("Start the scenario to create a signed Law 544 request.");
  const fileInput = useRef<HTMLInputElement>(null);
  const t = dictionaries[language];

  const refresh = useCallback(async () => {
    const nextEvents = await ledger.listEvents();
    setEvents(nextEvents);
    setChainVerification(await ledger.verifyChain());
  }, [ledger]);

  const resetDemo = useCallback(async () => {
    await ledger.reset();
    const nextContext = await createInitialDemoContext();
    setContext(nextContext);
    setSelectedRequestId(nextContext.request.id);
    setEvents([]);
    setChainVerification(initialVerification);
    setMessage("Demo reset. Submit the request to begin the chain.");
  }, [ledger]);

  useEffect(() => {
    void resetDemo();
  }, [resetDemo]);

  async function exportState() {
    if (!context) return;

    // Loaded on demand: the schema this uses is the heaviest thing in the app, and a reader
    // who never exports should not pay for it.
    const { exportDemoState, serializeDemoState } = await import("./demo/stateTransfer");
    const state = await exportDemoState({ ledger, request: context.request });
    const url = URL.createObjectURL(new Blob([serializeDemoState(state)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${context.request.id}-demo-state.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${state.events.length} events. Signing keys stay in this browser.`);
  }

  function exportAuditReceipt() {
    if (!context) return;

    const activeItem: RequestExplorerItem = {
      request: context.request,
      events: events.filter((event) => event.requestId === context.request.id),
      source: "active",
    };
    const selectableItems: RequestExplorerItem[] = [
      activeItem,
      ...seededRequestScenarios.map((scenario) => ({ ...scenario, source: "seed" as const })),
    ];
    const selectedItem = getSelectedExplorerItem(selectableItems, selectedRequestId) ?? activeItem;

    if (!selectedItem) return;

    const receipt = {
      schema: "law544-audit-receipt/v1",
      exportedAt: new Date().toISOString(),
      language,
      request: {
        id: selectedItem.request.id,
        institution: selectedItem.request.institution,
        subject: selectedItem.request.subject,
        status: selectedItem.request.status,
        createdAt: selectedItem.request.createdAt,
        deadlineAt: selectedItem.request.deadlineAt,
        registryNumber: selectedItem.request.registryNumber,
        citizenDidHash: selectedItem.request.citizenDidHash,
        assignedToDidHash: selectedItem.request.assignedToDidHash,
        responseDocumentHash: selectedItem.request.responseDocumentHash,
      },
      evidence: {
        source: selectedItem.source,
        events: selectedItem.events.map((event) => ({
          index: event.index,
          action: event.action,
          fromStatus: event.fromStatus,
          toStatus: event.toStatus,
          timestamp: event.timestamp,
          signerRole: event.signerRole,
          signerDidHash: event.signerDidHash,
          credentialHash: event.credentialHash,
          payloadHash: event.payloadHash,
          documentHash: event.documentHash,
          previousStateHash: event.previousStateHash,
          stateHash: event.stateHash,
          metadata: event.metadata,
        })),
        chainHead: selectedItem.events.at(-1)?.stateHash,
      },
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedItem.request.id}-audit-receipt.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported audit receipt for ${selectedItem.request.id}.`);
  }

  async function importState(file: File) {
    try {
      const { importDemoState } = await import("./demo/stateTransfer");
      const state = await importDemoState({ ledger, json: await file.text() });
      setContext(context ? { ...context, request: state.request } : context);
      setSelectedRequestId(state.request.id);
      await refresh();
      setMessage(
        `Imported ${state.events.length} events and the chain verifies. Keys are not part of an ` +
          `export, so anything signed from here on uses this browser's demo identities.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not read that file.");
    }
  }

  async function runTamperDemo() {
    if (!context) return;

    try {
      const { exportDemoState, importDemoState, serializeDemoState } = await import("./demo/stateTransfer");
      const state = await exportDemoState({ ledger, request: context.request });
      const lastIndex = state.events.length - 1;

      if (lastIndex < 0) {
        setMessage("Create at least one event before testing a tampered export.");
        return;
      }

      const forgedState = {
        ...state,
        events: state.events.map((event, index) =>
          index === lastIndex ? { ...event, signerRole: "Director" as const } : event,
        ),
      };

      await importDemoState({ ledger, json: serializeDemoState(forgedState) });
      setMessage("Unexpected result: the edited export imported successfully.");
    } catch (error) {
      await refresh();
      setMessage(
        error instanceof Error
          ? `Tamper demo worked: ${error.message}`
          : "Tamper demo worked: the edited export was rejected.",
      );
    }
  }

  async function runAction(kind: "create" | "register" | "route" | "start" | "attach" | "resolve") {
    if (!context) return;

    try {
      const { identities, request } = context;
      const assignedToDidHash = identities.publicServant.did.slice(0, 18);
      const responseHash = kind === "resolve" ? await createDemoDocumentHash("final-response.pdf") : undefined;
      const attachmentHash = kind === "attach" ? await createDemoDocumentHash("internal-note.pdf") : undefined;

      const nextRequest = await applyDemoAction({
        provider,
        ledger,
        request,
        actor:
          kind === "create"
            ? identities.citizen
            : kind === "register"
              ? identities.registryBot
              : kind === "route"
                ? identities.director
                : identities.publicServant,
        action:
          kind === "create"
            ? "Request_Created"
            : kind === "register"
              ? "Registry_Assigned"
              : kind === "route"
                ? "Task_Routed"
                : kind === "start"
                  ? "Processing_Started"
                  : kind === "attach"
                    ? "Document_Attached"
                    : "Request_Resolved",
        documentHash: responseHash ?? attachmentHash,
        metadata:
          kind === "register"
            ? { registryNumber: "MF-544-2026-0001" }
            : kind === "route"
              ? { assignedToDidHash }
              : undefined,
      });

      setContext({ ...context, request: nextRequest });
      setSelectedRequestId(nextRequest.id);
      setMessage(`Recorded ${nextRequest.status} transition.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not apply transition.");
    }
  }

  if (!context) {
    return <main className="appShell">Loading demo...</main>;
  }

  const request = context.request;
  const activeEvents = events.filter((event) => event.requestId === request.id);
  const explorerItems: RequestExplorerItem[] = [
    { request, events: activeEvents, source: "active" },
    ...seededRequestScenarios.map((scenario) => ({ ...scenario, source: "seed" as const })),
  ];
  const filteredItems = filterRequestExplorerItems(explorerItems, filters);
  const selectedItem = getSelectedExplorerItem(filteredItems, selectedRequestId) ?? getSelectedExplorerItem(explorerItems, selectedRequestId);
  const selectedRequest = selectedItem?.request ?? request;
  const selectedEvents = selectedItem?.events ?? activeEvents;
  const selectedSource = selectedItem?.source ?? "active";

  return (
    <main className="appShell">
      <header className="hero">
        <div>
          <p className="eyebrow">{t.app.eyebrow}</p>
          <h1>{t.app.title}</h1>
          <p>{t.app.intro}</p>
        </div>
        <div className="heroActions">
          <div className="languageToggle" aria-label={t.app.languageLabel}>
            <button aria-pressed={language === "en"} onClick={() => setLanguage("en")} type="button">
              {t.app.english}
            </button>
            <button aria-pressed={language === "ro"} onClick={() => setLanguage("ro")} type="button">
              {t.app.romanian}
            </button>
          </div>
          <div className="integrity">
            <ShieldCheck size={20} />
            <span>{chainVerification.valid ? t.app.ledgerOk : t.app.ledgerFailed}</span>
          </div>
        </div>
      </header>

      <section className="toolbar" aria-label={t.app.actionsLabel}>
        <button className="secondary" onClick={() => void exportState()}><Download size={18} />{t.app.exportState}</button>
        <button className="secondary" onClick={() => exportAuditReceipt()}><Download size={18} />{t.app.exportReceipt}</button>
        <button className="secondary" onClick={() => fileInput.current?.click()}><FileUp size={18} />{t.app.importState}</button>
        <button className="secondary" onClick={() => void resetDemo()}><RefreshCw size={18} />{t.app.reset}</button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void importState(file);
          }}
        />
      </section>

      <p className="message">{message}</p>

      <div className="grid">
        <GuidedProgress status={request.status} eventsCount={events.length} onRunStep={(stepId) => void runAction(stepId)} labels={t.guided} />
        <LedgerIntegrityPanel verification={chainVerification} events={events} onTamperDemo={() => void runTamperDemo()} labels={t.integrity} />
        <RequestFeed
          filters={filters}
          items={explorerItems}
          labels={t.feed}
          onFiltersChange={setFilters}
          onSelectRequest={setSelectedRequestId}
          selectedRequestId={selectedRequest.id}
        />
        <RequestDetail request={selectedRequest} events={selectedEvents} source={selectedSource} labels={t.detail} />
        <MachineryGraph request={selectedRequest} labels={t.graph} />
        <RequestTrail events={selectedEvents} requestId={selectedRequest.id} labels={t.trail} />
        <HashVerifier expectedHash={selectedRequest.responseDocumentHash} labels={t.hash} />
      </div>
    </main>
  );
}

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
import { AuditReceiptVerifier } from "./dashboard/AuditReceiptVerifier";
import { GuidedProgress } from "./dashboard/GuidedProgress";
import { LedgerIntegrityPanel } from "./dashboard/LedgerIntegrityPanel";
import { RequestDetail } from "./dashboard/RequestDetail";
import { buildPublicAuditReceipt } from "./dashboard/auditReceipt";
import {
  DEFAULT_EXPLORER_FILTERS,
  filterRequestExplorerItems,
  getSelectedExplorerItem,
  type RequestExplorerFilters,
  type RequestExplorerItem,
} from "./dashboard/requestExplorer";
import { MachineryGraph } from "./graph/MachineryGraph";
import type { DemoContext } from "./demo/scenarioLaw544";
import { createBrowserDemoRuntime } from "./demo/DemoRuntime";
import type { GuidedScenarioId } from "./demo/guidedScenarios";
import { seededRequestScenarios } from "./demo/seededRequests";
import type { ChainVerificationResult, LedgerEvent } from "./ledger/types";

const initialVerification: ChainVerificationResult = {
  valid: true,
  checkedEvents: 0,
};

export function App() {
  const runtime = useMemo(() => createBrowserDemoRuntime(), []);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [chainVerification, setChainVerification] = useState<ChainVerificationResult>(initialVerification);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestExplorerFilters>(DEFAULT_EXPLORER_FILTERS);
  const [language, setLanguage] = useState<Language>("en");
  const [message, setMessage] = useState("Start the scenario to create a signed Law 544 request.");
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const t = dictionaries[language];

  const refresh = useCallback(async () => {
    const nextEvents = await runtime.listEvents();
    setEvents(nextEvents);
    setChainVerification(await runtime.verifyChain());
  }, [runtime]);

  const resetDemo = useCallback(async () => {
    const nextContext = await runtime.reset();
    setContext(nextContext);
    setSelectedRequestId(nextContext.request.id);
    setEvents([]);
    setChainVerification(initialVerification);
    setMessage("Demo reset. Submit the request to begin the chain.");
  }, [runtime]);

  useEffect(() => {
    void resetDemo();
  }, [resetDemo]);

  async function exportState() {
    if (!context) return;

    // Loaded on demand: the schema this uses is the heaviest thing in the app, and a reader
    // who never exports should not pay for it.
    const { exportDemoState, serializeDemoState } = await import("./demo/stateTransfer");
    const state = await exportDemoState({ ledger: runtime.ledger, request: context.request });
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

    const receipt = buildPublicAuditReceipt({
      exportedAt: new Date().toISOString(),
      item: selectedItem,
      language,
    });
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
      const state = await importDemoState({ ledger: runtime.ledger, json: await file.text() });
      await runtime.saveRequest(state.request);
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
      const state = await exportDemoState({ ledger: runtime.ledger, request: context.request });
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

      await importDemoState({ ledger: runtime.ledger, json: serializeDemoState(forgedState) });
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

  async function runGuidedScenario(scenarioId: GuidedScenarioId) {
    try {
      setIsRunningScenario(true);
      const result = await runtime.replayGuidedScenario(scenarioId);
      setContext(result.context);
      setEvents(result.events);
      setSelectedRequestId(result.context.request.id);
      setChainVerification(await runtime.verifyChain());
      setMessage(`Replayed ${result.scenario.label}: ${result.events.length} signed state changes.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not replay that scenario.");
    } finally {
      setIsRunningScenario(false);
    }
  }

  async function runAction(kind: "create" | "register" | "route" | "start" | "attach" | "resolve") {
    if (!context) return;

    try {
      const { identities, request } = context;
      const assignedToDidHash = identities.publicServant.did.slice(0, 18);

      const result = await runtime.applyTransition({
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
        document:
          kind === "resolve"
            ? { name: "final-response.pdf", type: "application/pdf" }
            : kind === "attach"
              ? { name: "internal-note.pdf", type: "application/pdf" }
              : undefined,
        metadata:
          kind === "register"
            ? { registryNumber: "MF-544-2026-0001" }
            : kind === "route"
              ? { assignedToDidHash }
              : undefined,
      });
      const nextRequest = result.request;

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
        <GuidedProgress
          status={request.status}
          eventsCount={events.length}
          isRunningScenario={isRunningScenario}
          onRunScenario={(scenarioId) => void runGuidedScenario(scenarioId)}
          onRunStep={(stepId) => void runAction(stepId)}
          labels={t.guided}
        />
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
        <AuditReceiptVerifier item={selectedItem ?? explorerItems[0]} language={language} labels={t.receipt} />
      </div>
    </main>
  );
}

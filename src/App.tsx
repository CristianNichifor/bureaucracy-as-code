import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Moon,
  Download,
  FileUp,
  RefreshCw,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { dictionaries, type Language } from "./i18n";
import { RequestFeed } from "./dashboard/RequestFeed";
import { RequestTrail } from "./dashboard/RequestTrail";
import { HashVerifier } from "./dashboard/HashVerifier";
import { AuditReceiptVerifier } from "./dashboard/AuditReceiptVerifier";
import { ProofPreviewPanel } from "./dashboard/ProofPreviewPanel";
import { OperationsPanel } from "./dashboard/OperationsPanel";
import { ScenarioComparisonPanel } from "./dashboard/ScenarioComparisonPanel";
import { TransferSafetyPanel, type TransferStatus } from "./dashboard/TransferSafetyPanel";
import { GuidedProgress } from "./dashboard/GuidedProgress";
import { LedgerIntegrityPanel } from "./dashboard/LedgerIntegrityPanel";
import { RequestDetail } from "./dashboard/RequestDetail";
import { EvidenceBrief } from "./dashboard/EvidenceBrief";
import { BuildMetadata } from "./dashboard/BuildMetadata";
import { ReleaseReadiness } from "./dashboard/ReleaseReadiness";
import { PresenterChecklist } from "./dashboard/PresenterChecklist";
import { DemoCompletenessPanel } from "./dashboard/DemoCompletenessPanel";
import { buildPublicAuditReceipt, buildPublicProofReport } from "./dashboard/auditReceipt";
import { demoSteps, getCurrentStepIndex, type DemoStep } from "./dashboard/demoProgress";
import { fallbackBuildInfo, loadBuildInfo, type BuildInfo } from "./buildInfo";
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

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("bac-theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function App() {
  const runtime = useMemo(() => createBrowserDemoRuntime(), []);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [chainVerification, setChainVerification] = useState<ChainVerificationResult>(initialVerification);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestExplorerFilters>(DEFAULT_EXPLORER_FILTERS);
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [message, setMessage] = useState(dictionaries.en.app.startMessage);
  const [transferStatus, setTransferStatus] = useState<TransferStatus>("idle");
  const [transferDetail, setTransferDetail] = useState(dictionaries.en.transferSafety.idleDetail);
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [lastRecordedEvent, setLastRecordedEvent] = useState<LedgerEvent | undefined>();
  const [buildInfo, setBuildInfo] = useState<BuildInfo>(fallbackBuildInfo);
  const fileInput = useRef<HTMLInputElement>(null);
  const t = dictionaries[language];

  const refresh = useCallback(async () => {
    const nextEvents = await runtime.listEvents();
    setEvents(nextEvents);
    setChainVerification(await runtime.verifyChain());
  }, [runtime]);

  const resetDemo = useCallback(async (nextMessage: string, nextTransferStatus: TransferStatus = "reset") => {
    const nextContext = await runtime.reset();
    setContext(nextContext);
    setSelectedRequestId(nextContext.request.id);
    setEvents([]);
    setChainVerification(initialVerification);
    setIsAutoRunning(false);
    setLastRecordedEvent(undefined);
    setTransferStatus(nextTransferStatus);
    setTransferDetail(nextTransferStatus === "idle" ? dictionaries.en.transferSafety.idleDetail : nextMessage);
    setMessage(nextMessage);
  }, [runtime]);

  useEffect(() => {
    void resetDemo(dictionaries.en.app.startMessage, "idle");
  }, [resetDemo]);

  useEffect(() => {
    void loadBuildInfo().then(setBuildInfo);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("bac-theme", theme);
  }, [theme]);

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
    const nextMessage = formatMessage(t.app.exportStateMessage, { count: state.events.length });
    setTransferStatus("exported");
    setTransferDetail(nextMessage);
    setMessage(nextMessage);
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
    setMessage(formatMessage(t.app.exportReceiptMessage, { requestId: selectedItem.request.id }));
  }

  function exportProofReport(items: RequestExplorerItem[]) {
    const report = buildPublicProofReport({
      exportedAt: new Date().toISOString(),
      items,
      language,
    });
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `law544-public-proof-report-${report.summary.requestCount}-requests.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(formatMessage(t.app.exportProofReportMessage, { count: report.summary.requestCount }));
  }

  async function importState(file: File) {
    try {
      const { importDemoState } = await import("./demo/stateTransfer");
      const state = await importDemoState({ ledger: runtime.ledger, json: await file.text() });
      await runtime.saveRequest(state.request);
      setContext(context ? { ...context, request: state.request } : context);
      setSelectedRequestId(state.request.id);
      await refresh();
      const nextMessage = formatMessage(t.app.importSuccessMessage, { count: state.events.length });
      setTransferStatus("imported");
      setTransferDetail(nextMessage);
      setMessage(nextMessage);
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : t.app.importFailureMessage;
      setTransferStatus("rejected");
      setTransferDetail(nextMessage);
      setMessage(nextMessage);
    }
  }

  async function runTamperDemo() {
    if (!context) return;

    try {
      const { exportDemoState, importDemoState, serializeDemoState } = await import("./demo/stateTransfer");
      const state = await exportDemoState({ ledger: runtime.ledger, request: context.request });
      const lastIndex = state.events.length - 1;

      if (lastIndex < 0) {
        setTransferStatus("idle");
        setTransferDetail(t.app.tamperNeedsEventMessage);
        setMessage(t.app.tamperNeedsEventMessage);
        return;
      }

      const forgedState = {
        ...state,
        events: state.events.map((event, index) =>
          index === lastIndex ? { ...event, signerRole: "Director" as const } : event,
        ),
      };

      await importDemoState({ ledger: runtime.ledger, json: serializeDemoState(forgedState) });
      setTransferStatus("rejected");
      setTransferDetail(t.app.tamperUnexpectedMessage);
      setMessage(t.app.tamperUnexpectedMessage);
    } catch (error) {
      await refresh();
      const nextMessage =
        error instanceof Error
          ? formatMessage(t.app.tamperWorkedMessage, { reason: error.message })
          : t.app.tamperWorkedFallbackMessage;
      setTransferStatus("rejected");
      setTransferDetail(nextMessage);
      setMessage(nextMessage);
    }
  }

  async function runGuidedScenario(scenarioId: GuidedScenarioId) {
    try {
      setIsRunningScenario(true);
      const result = await runtime.replayGuidedScenario(scenarioId);
      setContext(result.context);
      setEvents(result.events);
      setSelectedRequestId(result.context.request.id);
      setLastRecordedEvent(result.events.at(-1));
      setChainVerification(await runtime.verifyChain());
      setMessage(
        formatMessage(t.app.scenarioReplayedMessage, {
          scenario: result.scenario.label,
          count: result.events.length,
        }),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.app.transitionFailureMessage);
    } finally {
      setIsRunningScenario(false);
    }
  }

  const runAction = useCallback(async (kind: DemoStep["id"]) => {
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
      const nextEvents = await runtime.listEvents();
      const nextVerification = await runtime.verifyChain();

      setContext({ ...context, request: nextRequest });
      setEvents(nextEvents);
      setChainVerification(nextVerification);
      setSelectedRequestId(nextRequest.id);
      setLastRecordedEvent(result.event);
      setMessage(
        [
          formatMessage(t.app.transitionRecordedMessage, {
            actor: t.guided.steps[kind].actor,
            action: result.event.action,
            fromStatus: result.event.fromStatus,
            toStatus: result.event.toStatus,
          }),
          formatMessage(t.app.transitionProofMessage, {
            hash: result.event.stateHash.slice(0, 18),
            count: nextVerification.checkedEvents,
          }),
        ].join(" "),
      );
    } catch (error) {
      setIsAutoRunning(false);
      setMessage(error instanceof Error ? error.message : t.app.transitionFailureMessage);
    }
  }, [context, runtime, t.app.transitionFailureMessage, t.app.transitionProofMessage, t.app.transitionRecordedMessage, t.guided.steps]);

  const runNextStep = useCallback(() => {
    if (!context) return;

    const nextStep = demoSteps[getCurrentStepIndex(context.request.status, events.length)];
    if (!nextStep) {
      setIsAutoRunning(false);
      return;
    }

    void runAction(nextStep.id);
  }, [context, events.length, runAction]);

  useEffect(() => {
    if (!isAutoRunning || !context) return;

    const nextStep = demoSteps[getCurrentStepIndex(context.request.status, events.length)];
    if (!nextStep) {
      setIsAutoRunning(false);
      return;
    }

    const timer = window.setTimeout(() => runNextStep(), 700);
    return () => window.clearTimeout(timer);
  }, [context, events.length, isAutoRunning, runNextStep]);

  if (!context) {
    return (
      <main className="appShell loadingShell">
        <section className="panel">
          <p className="eyebrow">{t.app.eyebrow}</p>
          <h1>{t.app.loadingTitle}</h1>
          <p>{t.app.loadingCopy}</p>
        </section>
      </main>
    );
  }

  const request = context.request;
  const activeEvents = events.filter((event) => event.requestId === request.id);
  const explorerItems: RequestExplorerItem[] = [
    { request, events: activeEvents, source: "active" },
    ...seededRequestScenarios.map((scenario) => ({ ...scenario, source: "seed" as const })),
  ];
  const filteredItems = filterRequestExplorerItems(explorerItems, filters);
  const proofReportContext = getProofReportContext(filteredItems);
  const selectedItem = getSelectedExplorerItem(filteredItems, selectedRequestId) ?? getSelectedExplorerItem(explorerItems, selectedRequestId);
  const selectedRequest = selectedItem?.request ?? request;
  const selectedEvents = selectedItem?.events ?? activeEvents;
  const selectedSource = selectedItem?.source ?? "active";

  return (
    <main className="appShell" id="main-content">
      <a className="skipLink" href="#request-explorer">
        Skip to public request explorer
      </a>
      <header className="hero">
        <div>
          <p className="eyebrow">{t.app.eyebrow}</p>
          <h1>{t.app.title}</h1>
          <p>{t.app.intro}</p>
        </div>
        <div className="heroActions">
          <div className="segmentedControls">
            <div className="segmentedToggle" aria-label={t.app.languageLabel}>
              <button aria-pressed={language === "en"} onClick={() => setLanguage("en")} type="button">
                {t.app.english}
              </button>
              <button aria-pressed={language === "ro"} onClick={() => setLanguage("ro")} type="button">
                {t.app.romanian}
              </button>
            </div>
            <div className="segmentedToggle themeToggle" aria-label={t.app.themeLabel}>
              <button aria-pressed={theme === "light"} onClick={() => setTheme("light")} title={t.app.lightTheme} type="button">
                <Sun size={16} />
                <span>{t.app.lightTheme}</span>
              </button>
              <button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} title={t.app.darkTheme} type="button">
                <Moon size={16} />
                <span>{t.app.darkTheme}</span>
              </button>
            </div>
          </div>
          <div className="integrity">
            <ShieldCheck size={20} />
            <span>{chainVerification.valid ? t.app.ledgerOk : t.app.ledgerFailed}</span>
          </div>
        </div>
      </header>

      <section className="toolbar" aria-label={t.app.actionsLabel}>
        <div className="toolbarActions">
          <button className="civicButton civicButtonSecondary" onClick={() => void exportState()} type="button"><Download size={18} />{t.app.exportState}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => exportAuditReceipt()} type="button"><Download size={18} />{t.app.exportReceipt}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => exportProofReport(filteredItems)} type="button"><Download size={18} />{t.app.exportProofReport}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => fileInput.current?.click()} type="button"><FileUp size={18} />{t.app.importState}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => void resetDemo(t.app.resetMessage)} type="button"><RefreshCw size={18} />{t.app.reset}</button>
        </div>
        <div className="proofReportContext" aria-label={t.app.exportProofReport}>
          <span>{formatMessage(t.app.proofReportScope, { count: proofReportContext.requestCount })}</span>
          <span>{formatMessage(t.app.proofReportEvents, { count: proofReportContext.eventCount })}</span>
          <span>{formatMessage(t.app.proofReportResponses, { count: proofReportContext.responseHashCount })}</span>
        </div>
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
      <TransferSafetyPanel
        labels={t.transferSafety}
        eventCount={events.length}
        requestId={context.request.id}
        status={transferStatus}
        detail={transferDetail}
      />

      <div className="dashboardSections">
        <DashboardSection id="run-request" title={t.sections.run.title} copy={t.sections.run.copy}>
          <div className="grid sectionGrid sectionGridRun">
            <GuidedProgress
              status={request.status}
              eventsCount={events.length}
              lastEvent={lastRecordedEvent}
              isAutoRunning={isAutoRunning}
              isRunningScenario={isRunningScenario}
              onRunScenario={(scenarioId) => void runGuidedScenario(scenarioId)}
              onRunStep={(stepId) => void runAction(stepId)}
              onRunNext={runNextStep}
              onAutoRun={() => setIsAutoRunning(true)}
              onPause={() => setIsAutoRunning(false)}
              labels={t.guided}
            />
            <LedgerIntegrityPanel verification={chainVerification} events={events} onTamperDemo={() => void runTamperDemo()} labels={t.integrity} />
          </div>
        </DashboardSection>

        <DashboardSection id="request-explorer-section" title={t.sections.explorer.title} copy={t.sections.explorer.copy}>
          <div className="grid sectionGrid sectionGridExplorer">
            <OperationsPanel
              items={explorerItems}
              labels={t.operations}
              onApplyFilters={(nextFilters) => setFilters((currentFilters) => ({ ...currentFilters, ...nextFilters }))}
              onSelectRequest={setSelectedRequestId}
            />
            <ScenarioComparisonPanel
              items={explorerItems}
              labels={t.scenarioComparison}
              onSelectRequest={setSelectedRequestId}
              selectedRequestId={selectedRequest.id}
            />
            <RequestFeed
              id="request-explorer"
              filters={filters}
              items={explorerItems}
              labels={t.feed}
              onFiltersChange={setFilters}
              onSelectRequest={setSelectedRequestId}
              selectedRequestId={selectedRequest.id}
            />
          </div>
        </DashboardSection>

        <DashboardSection id="request-accountability" title={t.sections.accountability.title} copy={t.sections.accountability.copy}>
          <div className="grid sectionGrid selectedCaseWorkspace">
            <EvidenceBrief request={selectedRequest} events={selectedEvents} labels={t.evidenceBrief} />
            <RequestDetail request={selectedRequest} events={selectedEvents} source={selectedSource} labels={t.detail} />
            <MachineryGraph request={selectedRequest} events={selectedEvents} labels={t.graph} />
            <RequestTrail events={selectedEvents} requestId={selectedRequest.id} labels={t.trail} />
          </div>
        </DashboardSection>

        <DashboardSection id="proof-verification" title={t.sections.proof.title} copy={t.sections.proof.copy}>
          <div className="grid sectionGrid sectionGridProof">
            <ProofPreviewPanel
              items={filteredItems}
              language={language}
              selectedItem={selectedItem ?? explorerItems[0]}
              labels={t.proofPreview}
            />
            <HashVerifier expectedHash={selectedRequest.responseDocumentHash} labels={t.hash} />
            <AuditReceiptVerifier item={selectedItem ?? explorerItems[0]} language={language} labels={t.receipt} />
          </div>
        </DashboardSection>

        <DashboardSection id="release-operations" title={t.sections.release.title} copy={t.sections.release.copy}>
          <div className="grid sectionGrid sectionGridRelease">
            <DemoCompletenessPanel labels={t.demoCompleteness} />
            <PresenterChecklist
              labels={t.presenter}
              status={request.status}
              eventsCount={events.length}
              selectedRequestId={selectedRequest.id}
            />
            <ReleaseReadiness buildInfo={buildInfo} labels={t.readiness} />
          </div>
        </DashboardSection>
      </div>
      <BuildMetadata buildInfo={buildInfo} labels={t.build} />
    </main>
  );
}

function DashboardSection({
  id,
  title,
  copy,
  children,
}: {
  id: string;
  title: string;
  copy: string;
  children: ReactNode;
}) {
  const titleId = `${id}-title`;

  return (
    <section className="dashboardSection" aria-labelledby={titleId} id={id}>
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Dashboard section</p>
          <h2 id={titleId}>{title}</h2>
        </div>
        <p>{copy}</p>
      </div>
      {children}
    </section>
  );
}

function getProofReportContext(items: RequestExplorerItem[]) {
  return {
    requestCount: items.length,
    eventCount: items.reduce((count, item) => count + item.events.length, 0),
    responseHashCount: items.filter((item) => Boolean(item.request.responseDocumentHash)).length,
  };
}

function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

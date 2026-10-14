import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Moon,
  Download,
  PlayCircle,
  Wrench,
  FileUp,
  RefreshCw,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { dictionaries, type Dictionary, type Language } from "./i18n";
import { LanguageContext, describeEvent, formatLaw544Status } from "./locale";
import { browserStorage, resolveInitialLanguage, saveLanguage } from "./language";
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
import { FamilyLinks } from "./dashboard/FamilyLinks";
import { PrivacyNotice } from "./dashboard/PrivacyNotice";
import { ReleaseReadiness } from "./dashboard/ReleaseReadiness";
import { PresenterChecklist } from "./dashboard/PresenterChecklist";
import { DemoCompletenessPanel } from "./dashboard/DemoCompletenessPanel";
import { DataFlowPanel } from "./dashboard/DataFlowPanel";
import { buildPublicAuditReceipt, buildPublicProofReport } from "./dashboard/auditReceipt";
import { ISSUES_URL } from "./dashboard/PrivacyNotice";
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

const HUB_URL = "https://projects.cristian-nichifor.com/";
const REPO_URL = "https://github.com/CristianNichifor/bureaucracy-as-code";
const METHOD_URL = `${REPO_URL}/blob/dev/docs/architecture.md`;
const LAW_CAVEAT_URL = `${REPO_URL}/blob/dev/docs/law-544-legal-caveat.md`;

const initialVerification: ChainVerificationResult = {
  valid: true,
  checkedEvents: 0,
};

type Theme = "light" | "dark";
type View = "demo" | "explorer";

// Anchors inside the explorer view open it too, so old links keep working.
const explorerHashes = new Set(["#explorer", "#request-explorer", "#request-explorer-section"]);

function viewFromHash(): View {
  if (typeof window === "undefined") return "demo";
  return explorerHashes.has(window.location.hash) ? "explorer" : "demo";
}

type LocalizedText = (t: Dictionary, language: Language) => string;

const literal = (value: string): LocalizedText => () => value;
const startMessage: LocalizedText = (t) => t.app.startMessage;
const idleTransferDetail: LocalizedText = (t) => t.transferSafety.idleDetail;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  let saved: string | null | undefined;
  try {
    saved = browserStorage()?.getItem("bac-theme");
  } catch {
    saved = undefined;
  }
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function App() {
  const runtime = useMemo(() => createBrowserDemoRuntime(), []);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [chainVerification, setChainVerification] = useState<ChainVerificationResult>(initialVerification);
  // The last tamper test, tied to the event count it ran against: any new event or reset hides it.
  const [tamperResult, setTamperResult] = useState<{ reason?: string; eventCount: number } | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestExplorerFilters>(DEFAULT_EXPLORER_FILTERS);
  const [language, setLanguage] = useState<Language>(() =>
    resolveInitialLanguage(browserStorage(), typeof navigator === "undefined" ? undefined : navigator.language),
  );
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  // Messages are kept as functions of the dictionary so a language switch re-renders them.
  const [message, setMessage] = useState<LocalizedText>(() => startMessage);
  const [transferStatus, setTransferStatus] = useState<TransferStatus>("idle");
  const [transferDetail, setTransferDetail] = useState<LocalizedText>(() => idleTransferDetail);
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [lastRecordedEvent, setLastRecordedEvent] = useState<LedgerEvent | undefined>();
  const [buildInfo, setBuildInfo] = useState<BuildInfo>(fallbackBuildInfo);
  const fileInput = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<View>(viewFromHash);
  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const [loadStage, setLoadStage] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [presenterMode] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("presenter") === "1",
  );
  const t = dictionaries[language];

  const refresh = useCallback(async () => {
    const nextEvents = await runtime.listEvents();
    setEvents(nextEvents);
    setChainVerification(await runtime.verifyChain());
  }, [runtime]);

  const say = useCallback((text: LocalizedText) => setMessage(() => text), []);
  const sayTransfer = useCallback((status: TransferStatus, text: LocalizedText) => {
    setTransferStatus(status);
    setTransferDetail(() => text);
    setMessage(() => text);
  }, []);

  const applyReset = useCallback((nextContext: DemoContext, nextMessage: LocalizedText, nextTransferStatus: TransferStatus) => {
    setContext(nextContext);
    setSelectedRequestId(nextContext.request.id);
    setEvents([]);
    setChainVerification(initialVerification);
    setIsAutoRunning(false);
    setLastRecordedEvent(undefined);
    setTransferStatus(nextTransferStatus);
    setTransferDetail(() => (nextTransferStatus === "idle" ? idleTransferDetail : nextMessage));
    setMessage(() => nextMessage);
  }, []);

  const resetDemo = useCallback(async (nextMessage: LocalizedText, nextTransferStatus: TransferStatus = "reset") => {
    applyReset(await runtime.reset(), nextMessage, nextTransferStatus);
  }, [runtime, applyReset]);

  // State is only set from the promise callbacks, never synchronously inside the effect.
  const prepare = useCallback(
    () =>
      runtime.reset((stage) => setLoadStage(stage)).then(
        (nextContext) => applyReset(nextContext, startMessage, "idle"),
        () => setLoadError(true),
      ),
    [runtime, applyReset],
  );

  useEffect(() => {
    void prepare();
  }, [prepare]);

  const retry = useCallback(() => {
    setLoadError(false);
    void prepare();
  }, [prepare]);

  useEffect(() => {
    void loadBuildInfo().then(setBuildInfo);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = dictionaries[language].app.title;
    saveLanguage(browserStorage(), language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      browserStorage()?.setItem("bac-theme", theme);
    } catch {
      // Remembering the theme is a convenience only.
    }
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
    const count = state.events.length;
    sayTransfer("exported", (t) => formatMessage(t.app.exportStateMessage, { count }));
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
    const requestId = selectedItem.request.id;
    say((t) => formatMessage(t.app.exportReceiptMessage, { requestId }));
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
    const count = report.summary.requestCount;
    say((t) => formatMessage(t.app.exportProofReportMessage, { count }));
  }

  async function importState(file: File) {
    try {
      const { importDemoState } = await import("./demo/stateTransfer");
      const state = await importDemoState({ ledger: runtime.ledger, json: await file.text() });
      await runtime.saveRequest(state.request);
      setContext(context ? { ...context, request: state.request } : context);
      setSelectedRequestId(state.request.id);
      await refresh();
      const count = state.events.length;
      sayTransfer("imported", (t) => formatMessage(t.app.importSuccessMessage, { count }));
    } catch (error) {
      sayTransfer("rejected", error instanceof Error ? literal(error.message) : (t) => t.app.importFailureMessage);
    }
  }

  async function runTamperDemo() {
    if (!context) return;

    try {
      const { exportDemoState, importDemoState, serializeDemoState } = await import("./demo/stateTransfer");
      const state = await exportDemoState({ ledger: runtime.ledger, request: context.request });
      const lastIndex = state.events.length - 1;

      if (lastIndex < 0) {
        sayTransfer("idle", (t) => t.app.tamperNeedsEventMessage);
        return;
      }

      const forgedState = {
        ...state,
        events: state.events.map((event, index) =>
          index === lastIndex ? { ...event, signerRole: "Director" as const } : event,
        ),
      };

      await importDemoState({ ledger: runtime.ledger, json: serializeDemoState(forgedState) });
      sayTransfer("rejected", (t) => t.app.tamperUnexpectedMessage);
    } catch (error) {
      await refresh();
      const reason = error instanceof Error ? error.message : undefined;
      setTamperResult({ reason, eventCount: events.length });
      sayTransfer("rejected", (t) =>
        reason ? formatMessage(t.app.tamperWorkedMessage, { reason }) : t.app.tamperWorkedFallbackMessage,
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
      setLastRecordedEvent(result.events.at(-1));
      setChainVerification(await runtime.verifyChain());
      const count = result.events.length;
      say((t) => formatMessage(t.app.scenarioReplayedMessage, { scenario: t.guided.scenarios[scenarioId], count }));
    } catch (error) {
      say(error instanceof Error ? literal(error.message) : (t) => t.app.transitionFailureMessage);
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
      const recorded = result.event;
      const checkedEvents = nextVerification.checkedEvents;
      say((t, language) =>
        [
          formatMessage(t.app.transitionRecordedMessage, {
            event: describeEvent(recorded, language),
            fromStatus: formatLaw544Status(recorded.fromStatus, language),
            toStatus: formatLaw544Status(recorded.toStatus, language),
          }),
          formatMessage(t.app.transitionProofMessage, {
            hash: recorded.stateHash.slice(0, 18),
            count: checkedEvents,
          }),
        ].join(" "),
      );
    } catch (error) {
      setIsAutoRunning(false);
      say(error instanceof Error ? literal(error.message) : (t) => t.app.transitionFailureMessage);
    }
  }, [context, runtime, say]);

  async function startRequest() {
    if (context?.request.status === "Draft") await runAction("create");
    document.getElementById("run-request")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const runNextStep = useCallback(() => {
    if (!context) return;

    const nextStep = demoSteps[getCurrentStepIndex(context.request.status, events.length)];
    if (!nextStep) {
      setIsAutoRunning(false);
      return;
    }

    void runAction(nextStep.id);
  }, [context, events.length, runAction]);

  // Auto-run ends by itself once the guided steps run out.
  const autoRunActive = isAutoRunning && context !== null
    && demoSteps[getCurrentStepIndex(context.request.status, events.length)] !== undefined;

  useEffect(() => {
    if (!autoRunActive) return;

    const timer = window.setTimeout(() => runNextStep(), 700);
    return () => window.clearTimeout(timer);
  }, [autoRunActive, runNextStep]);

  const familyBar = (
    <header className="familyBar">
      <div className="familyBarInner">
        <a className="familyBarHome" href={HUB_URL}>← {t.app.hubLabel}</a>
        <span className="familyBarTool">{t.app.title}</span>
        <span className="demoBadge">{t.app.demoBadge}</span>
        {presenterMode && <span className="demoBadge presenterBadge">{t.presenter.modeTitle}</span>}
        <div className="segmentedControls familyBarControls">
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
      </div>
    </header>
  );

  if (!context) {
    const total = t.app.loadingStages.length;
    return (
      <LanguageContext.Provider value={language}>
        {familyBar}
        <main className="appShell loadingShell" id="main-content">
          <section className="panel" role="status" aria-live="polite">
            <p className="eyebrow">{t.app.eyebrow}</p>
            <h1>{t.app.loadingTitle}</h1>
            <ol className="loadingStages">
              {t.app.loadingStages.map((stage, index) => (
                <li
                  key={stage}
                  aria-current={index === loadStage ? "step" : undefined}
                  className={index < loadStage ? "done" : index === loadStage ? "current" : undefined}
                >
                  {stage}
                  {index < loadStage ? ` — ${t.app.stageDone}` : index === loadStage && !loadError ? ` — ${t.app.stageActive}` : ""}
                </li>
              ))}
            </ol>
            <div className="progressBar" aria-hidden="true">
              <span style={{ width: `${((loadStage + 1) / total) * 100}%` }} />
            </div>
            <p>
              {formatMessage(t.app.loadingStep, { current: loadStage + 1, total })}. {t.app.loadingCopy}
            </p>
            {loadError && (
              <div className="loadError" role="alert">
                <p>
                  <strong>{t.app.loadErrorTitle}</strong> {t.app.loadErrorCopy}
                </p>
                <button className="civicButton civicButtonPrimary" onClick={retry} type="button">
                  <RefreshCw size={18} />
                  {t.app.retry}
                </button>
              </div>
            )}
          </section>
        </main>
      </LanguageContext.Provider>
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
    <LanguageContext.Provider value={language}>
    {familyBar}
    <main className="appShell" id="main-content">
      <a className="skipLink" href={view === "demo" ? "#run-request" : "#request-explorer"}>
        {view === "demo" ? t.views.skipToDemo : t.app.skipLink}
      </a>
      <header className="hero">
        <div>
          <p className="eyebrow">{t.app.eyebrow}</p>
          <h1>{t.app.title}</h1>
          <p className="purpose">{t.app.purpose}</p>
          <p className="provenance">
            <strong>{t.app.provenanceLabel}</strong> {t.app.provenance} · {t.app.nothingLeaves} ·{" "}
            <a href={METHOD_URL} rel="noreferrer" target="_blank">{t.app.method}</a>
          </p>
          <p className="lawExplainer">{t.app.lawExplainer}</p>
          <button className="civicButton civicButtonPrimary heroStart" onClick={() => void startRequest()} type="button">
            <PlayCircle size={18} />
            {request.status === "Draft" ? t.app.startRequest : t.app.continueRequest}
          </button>
        </div>
        <div className="heroActions">
          <div className="integrity">
            <ShieldCheck size={20} />
            <span>{chainVerification.valid ? t.app.ledgerOk : t.app.ledgerFailed}</span>
          </div>
        </div>
      </header>

      {/* Presenter panels come before the acts: the presenter needs them before the run (BAC-19). */}
      {presenterMode && (
        <div className="dashboardSections presenterPanels">
          <p className="presenterBanner" role="status">
            {t.presenter.modeNotice}{" "}
            <a href={`${window.location.pathname}${window.location.hash}`}>{t.presenter.exitMode}</a>
          </p>
          <DashboardSection id="release-operations" title={t.sections.release.title} copy={t.sections.release.copy}>
            <div className="grid sectionGrid sectionGridRelease">
              <PresenterChecklist
                labels={t.presenter}
                status={request.status}
                eventsCount={events.length}
                selectedRequestId={selectedRequest.id}
              />
              <ReleaseReadiness buildInfo={buildInfo} labels={t.readiness} />
              <DemoCompletenessPanel labels={t.demoCompleteness} />
            </div>
          </DashboardSection>
        </div>
      )}

      <p className="message" role="status">{message(t, language)}</p>

      <details className="toolsMenu">
        <summary>
          <Wrench size={16} />
          {t.app.tools}
        </summary>
      <section className="toolbar" aria-label={t.app.actionsLabel}>
        <div className="toolbarActions">
          <button className="civicButton civicButtonSecondary" onClick={() => void exportState()} type="button"><Download size={18} />{t.app.exportState}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => exportAuditReceipt()} type="button"><Download size={18} />{t.app.exportReceipt}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => exportProofReport(filteredItems)} type="button"><Download size={18} />{t.app.exportProofReport}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => fileInput.current?.click()} type="button"><FileUp size={18} />{t.app.importState}</button>
          <button className="civicButton civicButtonSecondary" onClick={() => void resetDemo((t) => t.app.resetMessage)} type="button"><RefreshCw size={18} />{t.app.reset}</button>
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

      <TransferSafetyPanel
        labels={t.transferSafety}
        eventCount={events.length}
        requestId={context.request.id}
        status={transferStatus}
        detail={transferDetail(t, language)}
      />
      </details>

      <nav className="viewNav" aria-label={t.views.label}>
        <a aria-current={view === "demo" ? "page" : undefined} href="#">{t.views.demo}</a>
        <a aria-current={view === "explorer" ? "page" : undefined} href="#explorer">{t.views.explorer}</a>
      </nav>

      {view === "demo" ? (
        <>
          <nav className="actProgress" aria-label={t.progress.label}>
            <strong>
              {formatMessage(t.progress.step, {
                current: getCurrentStepIndex(request.status, events.length),
                total: demoSteps.length,
              })}
            </strong>
            <a href="#run-request">{t.sections.run.title}</a>
            <a href="#request-accountability">{t.sections.accountability.title}</a>
            <a href="#proof-verification">{t.sections.proof.title}</a>
          </nav>

          <div className="dashboardSections">
            <DashboardSection id="run-request" title={t.sections.run.title} copy={t.sections.run.copy}>
              <div className="grid sectionGrid sectionGridRun">
                <GuidedProgress
                  status={request.status}
                  eventsCount={events.length}
                  lastEvent={lastRecordedEvent}
                  isAutoRunning={autoRunActive}
                  isRunningScenario={isRunningScenario}
                  onRunScenario={(scenarioId) => void runGuidedScenario(scenarioId)}
                  onRunStep={(stepId) => void runAction(stepId)}
                  onRunNext={runNextStep}
                  onAutoRun={() => setIsAutoRunning(true)}
                  onPause={() => setIsAutoRunning(false)}
                  labels={t.guided}
                />
                <DataFlowPanel labels={t.dataFlow} />
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
                <LedgerIntegrityPanel
                  verification={chainVerification}
                  events={events}
                  onTamperDemo={() => void runTamperDemo()}
                  tamperResult={tamperResult?.eventCount === events.length ? tamperResult : null}
                  onDismissTamper={() => setTamperResult(null)}
                  labels={t.integrity}
                />
              </div>
            </DashboardSection>
          </div>
        </>
      ) : (
        <div className="dashboardSections">
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
              <RequestDetail request={selectedRequest} events={selectedEvents} source={selectedSource} labels={t.detail} />
            </div>
          </DashboardSection>
        </div>
      )}

    </main>
    <footer className="appShell siteFooter">
      <nav className="siteFooterNav" aria-label={t.app.footerLabel}>
        <a href={METHOD_URL} rel="noreferrer" target="_blank">{t.app.method}</a>
        <a href={LAW_CAVEAT_URL} rel="noreferrer" target="_blank">{t.app.lawCaveat}</a>
        <PrivacyNotice labels={t.privacy} />
        <a href={REPO_URL} rel="noreferrer" target="_blank">{t.app.source}</a>
        <a href={ISSUES_URL} rel="noreferrer" target="_blank">{t.app.contact}</a>
      </nav>
      <BuildMetadata buildInfo={buildInfo} labels={t.build} />
      <FamilyLinks labels={t.familyLinks} language={language} />
    </footer>
    </LanguageContext.Provider>
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

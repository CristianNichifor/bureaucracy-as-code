export type Language = "en" | "ro";

export type Dictionary = {
  app: {
    eyebrow: string;
    skipLink: string;
    lawExplainer: string;
    startRequest: string;
    continueRequest: string;
    tools: string;
    title: string;
    intro: string;
    ledgerOk: string;
    ledgerFailed: string;
    actionsLabel: string;
    exportState: string;
    importState: string;
    exportReceipt: string;
    exportProofReport: string;
    proofReportScope: string;
    proofReportEvents: string;
    proofReportResponses: string;
    reset: string;
    languageLabel: string;
    themeLabel: string;
    lightTheme: string;
    darkTheme: string;
    english: string;
    romanian: string;
    loadingTitle: string;
    loadingCopy: string;
    startMessage: string;
    resetMessage: string;
    exportStateMessage: string;
    exportReceiptMessage: string;
    exportProofReportMessage: string;
    importSuccessMessage: string;
    importFailureMessage: string;
    tamperNeedsEventMessage: string;
    tamperUnexpectedMessage: string;
    tamperWorkedMessage: string;
    tamperWorkedFallbackMessage: string;
    scenarioReplayedMessage: string;
    transitionRecordedMessage: string;
    transitionProofMessage: string;
    transitionFailureMessage: string;
    hubLabel: string;
    demoBadge: string;
    purpose: string;
    provenanceLabel: string;
    provenance: string;
    nothingLeaves: string;
    method: string;
    lawCaveat: string;
    source: string;
    contact: string;
    footerLabel: string;
    loadingStages: string[];
    loadingStep: string;
    stageDone: string;
    stageActive: string;
    loadErrorTitle: string;
    loadErrorCopy: string;
    retry: string;
  };
  views: { label: string; demo: string; explorer: string; skipToDemo: string };
  progress: { label: string; step: string };
  sections: {
    run: { title: string; copy: string };
    explorer: { title: string; copy: string };
    accountability: { title: string; copy: string };
    proof: { title: string; copy: string };
    release: { title: string; copy: string };
  };
  guided: {
    title: string;
    complete: string;
    nextStep: string;
    signs: string;
    scenariosLabel: string;
    controlsLabel: string;
    stepNext: string;
    autoRun: string;
    pause: string;
    recordedLabel: string;
    noRecordedEvent: string;
    scenarios: Record<string, string>;
    scenarioOutcome: string;
    scenarioEvents: string;
    scenarioSummaries: Record<string, string>;
    scenarioProofs: Record<string, string>;
    steps: Record<string, { label: string; actor: string }>;
  };
  dataFlow: {
    title: string;
    label: string;
    copy: string;
    publicData: string;
    privateData: string;
    steps: Array<{
      title: string;
      actor: string;
      data: string;
      proof: string;
    }>;
  };
  integrity: {
    title: string;
    explainLabel: string;
    valid: string;
    failed: string;
    validTitle: string;
    failedTitle: string;
    validCopy: string;
    failedCopy: string;
    eventsChecked: string;
    currentHead: string;
    firstInvalidEvent: string;
    noEvents: string;
    none: string;
    tamperButton: string;
    tamperFailedTitle: string;
    tamperFallbackReason: string;
    tamperChainUnchanged: string;
    backToVerified: string;
  };
  transferSafety: {
    title: string;
    label: string;
    copy: string;
    idle: string;
    exported: string;
    imported: string;
    rejected: string;
    reset: string;
    idleDetail: string;
    exportScope: string;
    importGate: string;
    keyBoundary: string;
    lastResult: string;
    eventCount: string;
    request: string;
    chainMustVerify: string;
    refusesTampering: string;
    noPrivateKeys: string;
    localKeys: string;
  };
  feed: {
    title: string;
    visible: string;
    filters: string;
    request: string;
    status: string;
    statusSummary: string;
    institution: string;
    signerRole: string;
    search: string;
    searchPlaceholder: string;
    sort: string;
    sortDeadline: string;
    sortNewest: string;
    sortEvents: string;
    sortStatus: string;
    all: string;
    resetFilters: string;
    latestRole: string;
    trail: string;
    deadline: string;
    source: string;
    noSigner: string;
    events: string;
    live: string;
    seed: string;
    emptyTitle: string;
    empty: string;
    emptyFilters: string;
    visibleOf: string;
    daysRemaining: string;
    daysOverdue: string;
    closed: string;
    deadlineUnset: string;
  };
  operations: {
    title: string;
    copy: string;
    browserOnly: string;
    summary: string;
    institutions: string;
    open: string;
    overdue: string;
    finalized: string;
    nextFile: string;
    nextDeadline: string;
    ownerQueue: string;
    citizenQueue: string;
    registryQueue: string;
    directorQueue: string;
    officerQueue: string;
    escalationQueue: string;
    urgentOverdue: string;
    urgentDueSoon: string;
    urgentEarliest: string;
    noOpenFiles: string;
    closedQueue: string;
    none: string;
  };
  scenarioComparison: {
    title: string;
    copy: string;
    browserOnly: string;
    events: string;
    deadline: string;
    owner: string;
    inspect: string;
    officer: string;
    escalation: string;
    closed: string;
    refusal: string;
    scenarios: Record<
      "Resolved" | "ExtensionRequested" | "Overdue" | "Rejected" | "InProgress",
      string
    >;
  };
  detail: {
    title: string;
    live: string;
    seed: string;
    institution: string;
    deadline: string;
    latestSignerRole: string;
    currentStatus: string;
    latestAction: string;
    responsibility: string;
    evidence: string;
    deadlineStatus: string;
    deadlineClosed: string;
    deadlineUnset: string;
    deadlineOverdue: string;
    deadlineDueSoon: string;
    deadlineOnTrack: string;
    daysRemaining: string;
    daysOverdue: string;
    handoffTitle: string;
    registryStep: string;
    directorStep: string;
    officerStep: string;
    responseStep: string;
    signedBy: string;
    waitingForSignature: string;
    registryQueue: string;
    directorQueue: string;
    finalResponse: string;
    noSigner: string;
    events: string;
    citizenDidHash: string;
    registryNumber: string;
    assignedDidHash: string;
    responseHash: string;
    latestStateHash: string;
    latestSignature: string;
    notAssigned: string;
    noResponse: string;
    noProof: string;
  };
  evidenceBrief: {
    title: string;
    label: string;
    responsibleDesk: string;
    latestSignedAction: string;
    stateEvidence: string;
    citizenCanVerify: string;
    signedBy: string;
    waiting: string;
    hashChain: string;
    documentHashAvailable: string;
    noDocumentHash: string;
    awaitingResponse: string;
    noProof: string;
    registryQueue: string;
    directorQueue: string;
    escalationDesk: string;
    responsePublished: string;
    refusalPublished: string;
    nextSubmit: string;
    nextRegistry: string;
    nextDirector: string;
    nextProcessing: string;
    nextResolve: string;
    nextExtension: string;
    nextEscalate: string;
    nextVerify: string;
    copyDraft: string;
    copyCreated: string;
    copyRegistered: string;
    copyRouted: string;
    copyInProgress: string;
    copyExtension: string;
    copyOverdue: string;
    copyResolved: string;
    copyRejected: string;
  };
  graph: {
    title: string;
    explainLabel: string;
    copy: string;
    currentPath: string;
    citizenDid: string;
    institution: string;
    registryAssigned: string;
    registryQueue: string;
    directorRouted: string;
    directorQueue: string;
    publicServant: string;
    unassigned: string;
    complete: string;
    current: string;
    waiting: string;
    hashEvidence: string;
    currentOwner: string;
    finalResponse: string;
    refusalResponse: string;
    escalationQueue: string;
    exceptionLane: string;
    standardFlow: string;
    noExceptions: string;
    extensionSignal: string;
    partialDisclosureSignal: string;
    redirectSignal: string;
    overdueSignal: string;
    rejectionSignal: string;
    signedMetadata: string;
  };
  trail: {
    title: string;
    explainLabel: string;
    explainerCopy: string;
    proofTitle: string;
    event: string;
    eventCode: string;
    state: string;
    signerRole: string;
    signerDidHash: string;
    credentialHash: string;
    payloadHash: string;
    previousStateHash: string;
    stateHash: string;
    signature: string;
    documentHash: string;
    metadata: string;
    copy: string;
    copied: string;
    none: string;
    empty: string;
  };
  hash: {
    title: string;
    explainLabel: string;
    verified: string;
    local: string;
    copy: string;
    onLedgerHash: string;
    selectedFileHash: string;
    noFinalResponse: string;
    chooseFile: string;
    chooseFileToVerify: string;
    mismatch: string;
    match: string;
    waiting: string;
  };
  proofPreview: {
    title: string;
    copy: string;
    localOnly: string;
    receipt: string;
    report: string;
    privacy: string;
    receiptScope: string;
    reportScope: string;
    reportEvents: string;
    privacyCopy: string;
    schema: string;
    chainHead: string;
    responseHashes: string;
    invalidChains: string;
    none: string;
  };
  receipt: {
    title: string;
    verified: string;
    failed: string;
    local: string;
    copy: string;
    chooseFile: string;
    chooseReceipt: string;
    loadedReceipt: string;
    receiptId: string;
    verdict: string;
    reason: string;
    eventsChecked: string;
    chainHead: string;
    responseHash: string;
    tamperButton: string;
    noReceipt: string;
  };
  build: {
    title: string;
    environment: string;
    builtAt: string;
    local: string;
  };
  familyLinks: {
    hub: string;
  };
  privacy: {
    link: string;
    title: string;
    intro: string;
    points: string[];
    operator: string;
    contact: string;
    contactLink: string;
    close: string;
  };
  demoCompleteness: {
    title: string;
    label: string;
    status: string;
    copy: string;
    criteria: Array<{ category: string; title: string; copy: string }>;
  };
  readiness: {
    title: string;
    status: string;
    statusReady: string;
    buildProof: string;
    commit: string;
    branch: string;
    environment: string;
    builtAt: string;
    deployTargets: string;
    hub: string;
    privacyBoundary: string;
    noRoeid: string;
    noDurableCloudflare: string;
    noPiiLedger: string;
    localSigningKeys: string;
    verification: string;
    verify: string;
    demoVerify: string;
    e2e: string;
    codeql: string;
    gitleaks: string;
    dependencyReview: string;
  };
  presenter: {
    title: string;
    label: string;
    copy: string;
    modeTitle: string;
    modeNotice: string;
    exitMode: string;
    cues: Record<
      "explorer" | "scenario" | "machinery" | "proofs" | "localization",
      { label: string; title: string; copy: string; href: string }
    >;
    steps: string[];
    commandsTitle: string;
    releaseCommand: string;
    captureCommand: string;
  };
};

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    app: {
      eyebrow: "Digital Public Administration Lab",
      skipLink: "Skip to public request explorer",
      lawExplainer:
        "Under Law 544/2001 a public institution must answer a request for public information within 10 days, or within 30 days if it extends the term and tells you so within the first 10.",
      startRequest: "Start the request",
      continueRequest: "Continue the request",
      tools: "Tools",
      title: "Bureaucracy as Code",
      intro:
        "Public Law 544/2001 explorer for signed administrative actions, anonymized request trails, and browser-local response hash verification.",
      ledgerOk: "Ledger verifies",
      ledgerFailed: "Ledger verification failed",
      actionsLabel: "Demo actions",
      exportState: "Export state",
      importState: "Import",
      exportReceipt: "Export receipt",
      exportProofReport: "Export proof report",
      proofReportScope: "{count} visible requests",
      proofReportEvents: "{count} signed events",
      proofReportResponses: "{count} response hashes",
      reset: "Reset",
      languageLabel: "Language",
      themeLabel: "Theme",
      lightTheme: "Light",
      darkTheme: "Dark",
      english: "EN",
      romanian: "RO",
      loadingTitle: "Preparing browser ledger",
      loadingCopy: "Creating local demo identities, credentials, and an empty hash-chain ledger.",
      startMessage: "Ready for a live run. Submit the request to record the first signed transition.",
      resetMessage: "Demo reset. The live request is empty and ready for the first citizen signature.",
      exportStateMessage: "Exported {count} events. Signing keys stay in this browser.",
      exportReceiptMessage: "Exported audit receipt for {requestId}.",
      exportProofReportMessage: "Exported proof report for {count} visible requests.",
      importSuccessMessage:
        "Imported {count} events and verified the hash chain. Private signing keys were not imported.",
      importFailureMessage: "Could not read that file.",
      tamperNeedsEventMessage: "Create at least one event before testing a tampered export.",
      tamperUnexpectedMessage: "Unexpected result: the edited export imported successfully.",
      tamperWorkedMessage: "Tamper demo worked: {reason}",
      tamperWorkedFallbackMessage: "Tamper demo worked: the edited export was rejected.",
      scenarioReplayedMessage: "Replayed {scenario}: {count} signed state changes now verify.",
      transitionRecordedMessage:
        "{event}. Status moved from {fromStatus} to {toStatus}.",
      transitionProofMessage: "Proof hash {hash}; verified ledger events: {count}.",
      transitionFailureMessage: "Could not apply transition.",
      hubLabel: "Civic projects",
      demoBadge: "Demo data",
      purpose: "See what happens to a request under Law 544/2001, step by step, and when the institution must answer.",
      provenanceLabel: "Data:",
      provenance: "synthetic demo, generated in the browser",
      nothingLeaves: "Nothing leaves the browser",
      method: "Method",
      lawCaveat: "About Law 544/2001",
      source: "Source",
      contact: "Contact",
      footerLabel: "About this tool",
      loadingStages: ["Empty verifiable journal", "Demo identities and credentials"],
      loadingStep: "Step {current} of {total}",
      stageDone: "done",
      stageActive: "in progress",
      loadErrorTitle: "The local registry could not be prepared.",
      loadErrorCopy: "The browser refused local storage, for example in private mode.",
      retry: "Retry",
    },
    views: { label: "Views", demo: "Demo", explorer: "Explorer", skipToDemo: "Skip to the request" },
    progress: { label: "Request progress", step: "Step {current}/{total}" },
    sections: {
      run: {
        title: "Request",
        copy: "Drive the live Law 544 flow and watch each signed transition change the dashboard.",
      },
      explorer: {
        title: "Public explorer",
        copy: "Browse anonymized seeded and live requests as a citizen-facing national feed.",
      },
      accountability: {
        title: "Machinery",
        copy: "Inspect responsibility, current location, and the signed trail for the selected file.",
      },
      proof: {
        title: "Proof",
        copy: "Export receipts and compare local files against recorded hashes without uploading documents.",
      },
      release: {
        title: "Release operations",
        copy: "Presenter notes, deploy targets, verification gates, and build metadata for the demo.",
      },
    },
    guided: {
      title: "Guided Law 544 run",
      complete: "complete",
      nextStep: "next step",
      signs: "signs",
      scenariosLabel: "One-click scenario replay",
      controlsLabel: "Timeline controls",
      stepNext: "Step next",
      autoRun: "Auto-run",
      pause: "Pause",
      recordedLabel: "Just recorded",
      noRecordedEvent: "No chain event recorded yet",
      scenarios: {
        "happy-path": "Run full scenario",
        extension: "Extension",
        "deadline-warning": "Deadline warning",
        "partial-disclosure": "Partial disclosure",
        redirected: "Redirected",
        overdue: "Overdue",
        rejected: "Rejected",
      },
      scenarioOutcome: "Outcome",
      scenarioEvents: "signed events",
      scenarioSummaries: {
        "happy-path": "Normal request lifecycle with evidence and a final response hash.",
        extension: "Allowed extension followed by resolution from the extended state.",
        "deadline-warning": "Open extension state with a visible deadline and escalation marker.",
        "partial-disclosure": "Redaction note plus partial-response hash for constrained disclosure.",
        redirected: "Competent-authority redirect recorded as a signed resolution.",
        overdue: "Registry marks the file overdue after the legal response window.",
        rejected: "Signed refusal document closes a request outside the demo scope.",
      },
      scenarioProofs: {
        "happy-path": "Proves the public happy path from submission to response verification.",
        extension: "Proves the state machine allows only the coded extension route.",
        "deadline-warning": "Proves deadline pressure is visible before final closure.",
        "partial-disclosure": "Proves redaction rationale remains auditable without publishing documents.",
        redirected: "Proves redirect outcomes can be verified from public metadata.",
        overdue: "Proves missed deadlines remain visible instead of being overwritten.",
        rejected: "Proves refusal decisions still require a signed response hash.",
      },
      steps: {
        create: { label: "Submit request", actor: "Citizen" },
        register: { label: "Assign registry number", actor: "Registry bot" },
        route: { label: "Route to servant", actor: "Director" },
        start: { label: "Start processing", actor: "Public servant" },
        attach: { label: "Attach evidence", actor: "Public servant" },
        resolve: { label: "Resolve request", actor: "Public servant" },
      },
    },
    dataFlow: {
      title: "Signed data flow",
      label: "What moves through the system",
      copy:
        "The demo separates private request content from public verification evidence. Every step records enough proof to audit the machine without publishing raw documents.",
      publicData: "Public ledger evidence",
      privateData: "Private browser/document data",
      steps: [
        {
          title: "Citizen submits",
          actor: "Citizen credential",
          data: "Request text stays local or off-chain; payload hash and DID hash become public evidence.",
          proof: "“Request submitted” with a signed payload hash",
        },
        {
          title: "Registry assigns",
          actor: "Registry bot",
          data: "Internal number joins the public trail without exposing the full file.",
          proof: "“Registry number assigned” links to the previous state hash",
        },
        {
          title: "Director routes",
          actor: "Director credential",
          data: "Responsibility moves to a public-servant DID hash.",
          proof: "“Routed to a public servant” records the signer role and assignee hash",
        },
        {
          title: "Officer resolves",
          actor: "Public servant",
          data: "Evidence and final response remain off-chain; only document hashes are visible.",
          proof: "“Evidence attached” and “Answer sent” close the chain",
        },
      ],
    },
    integrity: {
      title: "Ledger integrity",
      explainLabel: "What this shows",
      valid: "valid",
      failed: "failed",
      validTitle: "Hash chain verifies",
      failedTitle: "Hash chain break detected",
      validCopy:
        "Every visible event links to the previous state hash. A production ledger would publish the head externally.",
      failedCopy: "An imported or stored event no longer matches its recorded hash.",
      eventsChecked: "Events checked",
      currentHead: "Current head",
      firstInvalidEvent: "First invalid event",
      noEvents: "No events yet",
      none: "None",
      tamperButton: "Test edited export",
      tamperFailedTitle: "Verification failed",
      tamperFallbackReason: "The edited export no longer matches its signed hashes.",
      tamperChainUnchanged: "The edited copy was rejected; the stored chain is unchanged.",
      backToVerified: "Back to the verified chain",
    },
    transferSafety: {
      title: "Transfer safety",
      label: "Export and import",
      copy:
        "Demo state can move between browsers only as public ledger evidence. Imports are refused unless the hash chain still verifies.",
      idle: "ready",
      exported: "exported",
      imported: "imported",
      rejected: "rejected",
      reset: "reset",
      idleDetail: "No transfer action yet. Export state after recording at least one signed event.",
      exportScope: "Export scope",
      importGate: "Import gate",
      keyBoundary: "Key boundary",
      lastResult: "Last result",
      eventCount: "{count} live events",
      request: "Active request {requestId}",
      chainMustVerify: "Hash chain must verify",
      refusesTampering: "Edited exports are rejected before they replace local state.",
      noPrivateKeys: "No private keys exported",
      localKeys: "Imported demos can be read and re-verified, but original signers cannot be impersonated.",
    },
    feed: {
      title: "Public request explorer",
      visible: "visible",
      filters: "Request filters",
      request: "Request",
      status: "Status",
      statusSummary: "Status summary",
      institution: "Institution",
      signerRole: "Signer role",
      search: "Search",
      searchPlaceholder: "Search request, subject, institution, registry",
      sort: "Sort",
      sortDeadline: "Deadline first",
      sortNewest: "Newest",
      sortEvents: "Most events",
      sortStatus: "Status",
      all: "All",
      resetFilters: "Reset filters",
      latestRole: "Latest role",
      trail: "Trail",
      deadline: "Deadline",
      source: "Source",
      noSigner: "No signer",
      events: "events",
      live: "live",
      seed: "seed",
      emptyTitle: "No matching requests",
      empty: "The browser ledger has requests, but none match the current filters.",
      emptyFilters: "Active filters: {filters}.",
      visibleOf: "{count} of {total} requests shown",
      daysRemaining: "{days} remaining",
      daysOverdue: "{days} overdue",
      closed: "closed",
      deadlineUnset: "set on submission",
    },
    operations: {
      title: "Institution workload",
      copy:
        "Operational view of open queues, overdue files, and next deadlines across the visible browser ledger.",
      browserOnly: "browser simulation",
      summary: "Institution workload summary",
      institutions: "Institutions",
      open: "Open",
      overdue: "Overdue",
      finalized: "Finalized",
      nextFile: "Next file",
      nextDeadline: "Next deadline",
      ownerQueue: "Owner queue",
      citizenQueue: "Citizen draft",
      registryQueue: "Registry queue",
      directorQueue: "Director queue",
      officerQueue: "Officer desk",
      escalationQueue: "Escalation queue",
      urgentOverdue: "Urgent because it is {days} days overdue.",
      urgentDueSoon: "Urgent because the deadline is in {days} days.",
      urgentEarliest: "First in this institution by deadline: {days} days remaining.",
      noOpenFiles: "No open files",
      closedQueue: "Queue closed",
      none: "None",
    },
    scenarioComparison: {
      title: "Scenario comparison",
      copy:
        "Jump between the main Law 544 outcomes the demo can simulate: normal answer, extension, overdue escalation, refusal, and active processing.",
      browserOnly: "seeded simulations",
      events: "Events",
      deadline: "Deadline",
      owner: "Owner",
      inspect: "Inspect this path",
      officer: "Officer desk",
      escalation: "Escalation",
      closed: "Closed",
      refusal: "Refusal file",
      scenarios: {
        Resolved: "Normal response",
        ExtensionRequested: "Legal extension",
        Overdue: "Deadline breach",
        Rejected: "Refusal response",
        InProgress: "Active processing",
      },
    },
    detail: {
      title: "Request detail",
      live: "live browser chain",
      seed: "seeded public example",
      institution: "Institution",
      deadline: "Deadline",
      latestSignerRole: "Latest signer role",
      currentStatus: "Current status",
      latestAction: "Latest action",
      responsibility: "Responsibility",
      evidence: "Evidence",
      deadlineStatus: "Deadline status",
      deadlineClosed: "Closed",
      deadlineUnset: "Set on submission",
      deadlineOverdue: "Overdue",
      deadlineDueSoon: "Due soon",
      deadlineOnTrack: "On track",
      daysRemaining: "{days} remaining",
      daysOverdue: "{days} overdue",
      handoffTitle: "Accountability handoff",
      registryStep: "Registry",
      directorStep: "Director routing",
      officerStep: "Officer desk",
      responseStep: "Final response",
      signedBy: "Signed by {role}",
      waitingForSignature: "Waiting for signature",
      registryQueue: "Registry queue",
      directorQueue: "Director queue",
      finalResponse: "Final response",
      noSigner: "No signer yet",
      events: "Events",
      citizenDidHash: "Citizen DID hash",
      registryNumber: "Registry number",
      assignedDidHash: "Assigned DID hash",
      responseHash: "Response hash",
      latestStateHash: "Latest state hash",
      latestSignature: "Latest signature",
      notAssigned: "Not assigned",
      noResponse: "No response yet",
      noProof: "No proof yet",
    },
    evidenceBrief: {
      title: "Public evidence brief",
      label: "Citizen view",
      responsibleDesk: "Responsible desk",
      latestSignedAction: "Latest signed action",
      stateEvidence: "State evidence",
      citizenCanVerify: "Citizen can verify",
      signedBy: "Signed by {role}",
      waiting: "Waiting for the first signed event",
      hashChain: "Linked into the public hash chain",
      documentHashAvailable: "Response hash available",
      noDocumentHash: "No response hash yet",
      awaitingResponse: "Awaiting final response",
      noProof: "No proof yet",
      registryQueue: "Registry queue",
      directorQueue: "Director queue",
      escalationDesk: "Escalation desk",
      responsePublished: "Response published",
      refusalPublished: "Refusal published",
      nextSubmit: "Citizen must submit the request.",
      nextRegistry: "Registry must assign the official number.",
      nextDirector: "Director must route the file.",
      nextProcessing: "Assigned public servant must begin processing.",
      nextResolve: "Officer must attach evidence or final response.",
      nextExtension: "Officer must answer before the extended deadline.",
      nextEscalate: "Institution must resolve the overdue file and explain the breach.",
      nextVerify: "Citizen can verify the receipt and response hash.",
      copyDraft: "This request is still a draft, so no public administrative act has been signed yet.",
      copyCreated: "The citizen submission is recorded and waiting for registry assignment.",
      copyRegistered: "The institution has assigned a registry number and must route responsibility.",
      copyRouted: "The director has routed the file to a responsible desk.",
      copyInProgress: "The assigned desk is processing the request and adding evidence.",
      copyExtension: "The institution requested an extension; the signed reason remains visible.",
      copyOverdue: "The legal deadline was missed, so the file is visible as an escalation case.",
      copyResolved: "The request has a final response hash that can be checked locally.",
      copyRejected: "The refusal path is signed and its response hash can be checked locally.",
    },
    graph: {
      title: "Bureaucratic machinery",
      explainLabel: "What this shows",
      copy:
        "The graph maps the current owner of the file: citizen, institution, registry, director, assigned servant, or final response.",
      currentPath: "current path",
      citizenDid: "Citizen DID",
      institution: "Institution",
      registryAssigned: "Registry assigned",
      registryQueue: "Registry queue",
      directorRouted: "Director routed",
      directorQueue: "Director queue",
      publicServant: "Public servant",
      unassigned: "Unassigned",
      complete: "complete",
      current: "current",
      waiting: "waiting",
      hashEvidence: "hash evidence",
      currentOwner: "Current owner",
      finalResponse: "Final response",
      refusalResponse: "Refusal response",
      escalationQueue: "Escalation queue",
      exceptionLane: "Internal exception lane",
      standardFlow: "Standard flow",
      noExceptions: "No exceptional internal route recorded.",
      extensionSignal: "Extension",
      partialDisclosureSignal: "Partial disclosure",
      redirectSignal: "Redirect",
      overdueSignal: "Overdue escalation",
      rejectionSignal: "Refusal",
      signedMetadata: "Signed metadata",
    },
    trail: {
      title: "Signed audit trail",
      explainLabel: "What this shows",
      explainerCopy:
        "Each row is a signed administrative state transition with hashes that link it to the previous state.",
      proofTitle: "Event proof",
      event: "Event",
      eventCode: "Event code",
      state: "State",
      signerRole: "Signer role",
      signerDidHash: "Signer DID hash",
      credentialHash: "Credential hash",
      payloadHash: "Payload hash",
      previousStateHash: "Previous state hash",
      stateHash: "State hash",
      signature: "Signature",
      documentHash: "Document hash",
      metadata: "Metadata",
      copy: "Copy",
      copied: "Copied",
      none: "None",
      empty: "No signed events have been recorded for this request yet.",
    },
    hash: {
      title: "Response hash verifier",
      explainLabel: "What this shows",
      verified: "verified",
      local: "local",
      copy:
        "Choose a response file you received. The browser hashes it locally and compares it with the hash recorded for the selected request.",
      onLedgerHash: "On-ledger hash",
      selectedFileHash: "Selected file hash",
      noFinalResponse: "No final response yet",
      chooseFile: "Choose file",
      chooseFileToVerify: "Choose a file to verify",
      mismatch: "The selected file does not match the recorded hash.",
      match: "The selected file matches the recorded response hash.",
      waiting: "Waiting for a file",
    },
    proofPreview: {
      title: "Proof export preview",
      copy:
        "Inspect the public evidence package before exporting. The preview is generated locally from the selected request and visible explorer scope.",
      localOnly: "local preview",
      receipt: "Selected receipt",
      report: "Visible report",
      privacy: "Privacy boundary",
      receiptScope: "{count} receipt events",
      reportScope: "{count} requests",
      reportEvents: "{count} signed events",
      privacyCopy: "No raw documents, private keys, or personal data are included.",
      schema: "Receipt schema",
      chainHead: "Selected chain head",
      responseHashes: "Response hashes",
      invalidChains: "Invalid chains",
      none: "None",
    },
    receipt: {
      title: "Receipt verifier",
      verified: "receipt verifies",
      failed: "receipt failed",
      local: "local",
      copy:
        "Choose an exported audit receipt. The browser checks the receipt schema, event sequence, hash-chain links, signed payload references, and response hash summary.",
      chooseFile: "Choose receipt",
      chooseReceipt: "Choose a receipt JSON file",
      loadedReceipt: "Loaded receipt",
      receiptId: "Receipt request",
      verdict: "Verification verdict",
      reason: "Failure reason",
      eventsChecked: "Receipt entries",
      chainHead: "Chain head",
      responseHash: "Response hash",
      tamperButton: "Test tampered receipt",
      noReceipt: "No receipt loaded yet",
    },
    build: {
      title: "Deployed build",
      environment: "Environment",
      builtAt: "Built",
      local: "Local build",
    },
    familyLinks: {
      hub: "All civic projects",
    },
    privacy: {
      link: "Privacy",
      title: "Privacy notice",
      intro:
        "This demo runs entirely in your browser. What you create here is never sent to a server.",
      points: [
        "Demo state stays in this browser: the ledger, demo identities and your language and theme choices in localStorage, demo documents in IndexedDB, and an offline copy of the app in the service-worker cache. Clearing this site's data in your browser removes all of it.",
        "No cookies, analytics or trackers, and no third-party scripts or fonts.",
        "Every identity in the demo is fictional. Do not enter real personal data.",
        "The site is hosted on Cloudflare Pages. Like any web host, Cloudflare receives the technical request data (such as your IP address) needed to serve the pages.",
      ],
      operator: "Operated by Cristian Nichifor.",
      contact: "Questions and concerns go to the project's",
      contactLink: "GitHub issues",
      close: "Close",
    },
    demoCompleteness: {
      title: "Demo completeness",
      label: "Browser-only milestone",
      status: "100% demo scope",
      copy:
        "The app meets the agreed browser-only demo scope without ROeID, real identity services, durable Cloudflare resources, or legal sign-off dependencies.",
      criteria: [
        {
          category: "Public explorer",
          title: "Seeded anonymized Law 544 feed",
          copy: "The dashboard opens with seeded and live requests, status filters, workload summaries, and scenario comparison.",
        },
        {
          category: "Signed workflow",
          title: "Complete request lifecycle",
          copy: "A presenter can run submission, registry, routing, processing, evidence attachment, and resolution.",
        },
        {
          category: "Alternate paths",
          title: "Exceptions remain visible",
          copy: "Extension, overdue, rejected, redirected, and partial-disclosure paths are represented as signed scenarios.",
        },
        {
          category: "Public proofs",
          title: "Receipts and hash verification",
          copy: "Audit receipts, proof reports, response hash verification, and tamper rejection are visible in the browser.",
        },
        {
          category: "Privacy boundary",
          title: "No raw documents or private keys",
          copy: "Ledger evidence stays public and minimal; signing keys remain local and imports cannot impersonate original actors.",
        },
        {
          category: "Presentation",
          title: "Responsive EN/RO walkthrough",
          copy: "Civic UI alignment, light/dark theme, Romanian mode, presenter cues, and release checks are tested.",
        },
      ],
    },
    readiness: {
      title: "Release readiness",
      status: "Status",
      statusReady: "Browser demo ready",
      buildProof: "Build proof",
      commit: "Commit",
      branch: "Branch",
      environment: "Environment",
      builtAt: "Built",
      deployTargets: "Deploy targets",
      hub: "Projects hub",
      privacyBoundary: "Privacy boundary",
      noRoeid: "No ROeID integration",
      noDurableCloudflare: "No durable Cloudflare data resources required",
      noPiiLedger: "No PII or raw documents on the ledger",
      localSigningKeys: "Signing keys stay in this browser",
      verification: "Verification gates",
      verify: "pnpm verify",
      demoVerify: "pnpm demo:verify",
      e2e: "E2E / Playwright",
      codeql: "CodeQL",
      gitleaks: "Secret Scan / gitleaks",
      dependencyReview: "dependency-review",
    },
    presenter: {
      title: "Presenter checklist",
      label: "Live demo flow",
      copy:
        "Use this sequence for a five-minute public walkthrough after the release check passes.",
      modeTitle: "Presenter mode",
      modeNotice: "Presenter mode is on (?presenter=1). The panels below are not shown to the public.",
      exitMode: "Leave presenter mode",
      cues: {
        explorer: {
          label: "Start",
          title: "Show the public explorer",
          copy: "Point to anonymized Law 544 requests and current statuses.",
          href: "#request-explorer-section",
        },
        scenario: {
          label: "Next",
          title: "Run the signed workflow",
          copy: "Advance the request and show each recorded state change.",
          href: "#run-request",
        },
        machinery: {
          label: "Now",
          title: "Open the machinery view",
          copy: "Show the owner, handoff path, signer role, and graph lane.",
          href: "#request-accountability",
        },
        proofs: {
          label: "Verify",
          title: "Preview and verify proofs",
          copy: "Compare receipt exports and response hashes without exposing documents.",
          href: "#proof-verification",
        },
        localization: {
          label: "Close",
          title: "Switch language and release view",
          copy: "Finish with Romanian mode and the release-readiness gates.",
          href: "#release-operations",
        },
      },
      steps: [
        "Open the explorer and point to anonymized seeded Law 544 requests.",
        "Run the full guided scenario from citizen submission to final response.",
        "Show signer roles, DID hashes, state hashes, and the machinery graph.",
        "Export an audit receipt and explain that documents stay off-ledger.",
        "Verify a received response file against the recorded hash.",
        "Switch to Romanian mode for civic stakeholders.",
      ],
      commandsTitle: "Operator commands",
      releaseCommand: "pnpm demo:release",
      captureCommand: "pnpm demo:capture",
    },
  },
  ro: {
    app: {
      eyebrow: "Laborator de Administrație Publică Digitală",
      skipLink: "Sari la explorerul public de cereri",
      lawExplainer:
        "Potrivit Legii 544/2001, instituția publică răspunde la o cerere de informații de interes public în 10 zile sau în cel mult 30 de zile, dacă prelungește termenul și te anunță în primele 10 zile.",
      startRequest: "Începe cererea",
      continueRequest: "Continuă cererea",
      tools: "Instrumente",
      title: "Birocrație ca program",
      intro:
        "Explorer public pentru Legea 544/2001: acțiuni administrative semnate, trasee anonimizate și verificare locală a hash-ului răspunsului.",
      ledgerOk: "Registrul se verifică",
      ledgerFailed: "Verificarea registrului a eșuat",
      actionsLabel: "Acțiuni demo",
      exportState: "Exportă stare",
      importState: "Importă",
      exportReceipt: "Exportă dovada",
      exportProofReport: "Exportă raport",
      proofReportScope: "{count} cereri vizibile",
      proofReportEvents: "{count} evenimente semnate",
      proofReportResponses: "{count} hash-uri răspuns",
      reset: "Resetează",
      languageLabel: "Limbă",
      themeLabel: "Temă",
      lightTheme: "Luminos",
      darkTheme: "Întunecat",
      english: "EN",
      romanian: "RO",
      loadingTitle: "Pregătim registrul local",
      loadingCopy: "Creăm identități demo, credențiale și un lanț de hash-uri gol în browser.",
      startMessage: "Gata pentru rulare live. Depune cererea pentru prima tranziție semnată.",
      resetMessage: "Demo resetat. Cererea live este goală și așteaptă prima semnătură a cetățeanului.",
      exportStateMessage: "Au fost exportate {count} evenimente. Cheile de semnare rămân în browser.",
      exportReceiptMessage: "Dovada de audit pentru {requestId} a fost exportată.",
      exportProofReportMessage: "Raportul pentru {count} cereri vizibile a fost exportat.",
      importSuccessMessage:
        "Au fost importate {count} evenimente și lanțul de hash-uri se verifică. Cheile private nu au fost importate.",
      importFailureMessage: "Fișierul nu a putut fi citit.",
      tamperNeedsEventMessage: "Creează cel puțin un eveniment înainte să testezi un export modificat.",
      tamperUnexpectedMessage: "Rezultat neașteptat: exportul modificat a fost importat cu succes.",
      tamperWorkedMessage: "Testul de modificare a funcționat: {reason}",
      tamperWorkedFallbackMessage: "Testul de modificare a funcționat: exportul editat a fost respins.",
      scenarioReplayedMessage: "Scenariul {scenario} a rulat: {count} schimbări semnate se verifică.",
      transitionRecordedMessage:
        "{event}. Statusul a trecut de la {fromStatus} la {toStatus}.",
      transitionProofMessage: "Hash dovadă {hash}; evenimente verificate în registru: {count}.",
      transitionFailureMessage: "Tranziția nu a putut fi aplicată.",
      hubLabel: "Proiecte civice",
      demoBadge: "Date demonstrative",
      purpose: "Vezi ce se întâmplă cu o cerere depusă în baza Legii 544/2001, pas cu pas, și până când trebuie să răspundă instituția.",
      provenanceLabel: "Date:",
      provenance: "demo sintetice, generate în browser",
      nothingLeaves: "Nimic nu părăsește browserul",
      method: "Metodă",
      lawCaveat: "Despre Legea 544/2001",
      source: "Sursa",
      contact: "Contact",
      footerLabel: "Despre acest instrument",
      loadingStages: ["Jurnal verificabil gol", "Identități și credențiale demo"],
      loadingStep: "Pasul {current} din {total}",
      stageDone: "gata",
      stageActive: "în curs",
      loadErrorTitle: "Registrul local nu a putut fi pregătit.",
      loadErrorCopy: "Browserul a refuzat stocarea locală, de exemplu în mod privat.",
      retry: "Reîncearcă",
    },
    views: { label: "Vizualizări", demo: "Demonstrație", explorer: "Explorer", skipToDemo: "Sari la cerere" },
    progress: { label: "Progresul cererii", step: "Pasul {current}/{total}" },
    sections: {
      run: {
        title: "Cererea",
        copy: "Parcurge fluxul Legea 544 și urmărește fiecare tranziție semnată în dashboard.",
      },
      explorer: {
        title: "Explorer public",
        copy: "Consultă cereri anonimizate, preîncărcate sau create local, ca într-un flux național public.",
      },
      accountability: {
        title: "Mecanismul",
        copy: "Inspectează responsabilul curent, traseul dosarului și auditul semnat.",
      },
      proof: {
        title: "Dovada",
        copy: "Exportă dovezi și compară local fișierele primite cu hash-urile înregistrate.",
      },
      release: {
        title: "Operare release",
        copy: "Note de prezentare, ținte deploy, verificări și metadate build pentru demo.",
      },
    },
    guided: {
      title: "Flux ghidat Legea 544",
      complete: "complet",
      nextStep: "pasul următor",
      signs: "semnează",
      scenariosLabel: "Reluare scenariu dintr-un click",
      controlsLabel: "Controale cronologie",
      stepNext: "Pasul următor",
      autoRun: "Rulează automat",
      pause: "Pauză",
      recordedLabel: "Tocmai înregistrat",
      noRecordedEvent: "Niciun eveniment înregistrat încă",
      scenarios: {
        "happy-path": "Rulează complet",
        extension: "Prelungire",
        "deadline-warning": "Termen apropiat",
        "partial-disclosure": "Divulgare parțială",
        redirected: "Redirecționată",
        overdue: "Întârziată",
        rejected: "Respinsă",
      },
      scenarioOutcome: "Rezultat",
      scenarioEvents: "evenimente semnate",
      scenarioSummaries: {
        "happy-path": "Ciclul normal al cererii, cu dovadă și hash pentru răspunsul final.",
        extension: "Prelungire permisă, apoi rezolvare din starea extinsă.",
        "deadline-warning": "Stare de prelungire deschisă, cu termen și escaladare vizibile.",
        "partial-disclosure": "Notă de redactare și hash pentru răspuns parțial.",
        redirected: "Redirecționare către autoritatea competentă, semnată ca rezolvare.",
        overdue: "Registratura marchează cererea ca întârziată după termenul legal.",
        rejected: "Refuz semnat pentru o cerere în afara scopului demo.",
      },
      scenarioProofs: {
        "happy-path": "Demonstrează fluxul complet până la verificarea răspunsului.",
        extension: "Demonstrează că prelungirea trece doar prin ruta codificată.",
        "deadline-warning": "Demonstrează presiunea termenului înainte de închidere.",
        "partial-disclosure": "Demonstrează auditarea redactării fără publicarea documentelor.",
        redirected: "Demonstrează verificarea redirecționării din metadate publice.",
        overdue: "Demonstrează că termenul depășit rămâne vizibil.",
        rejected: "Demonstrează că refuzul are nevoie de răspuns semnat.",
      },
      steps: {
        create: { label: "Depune cererea", actor: "Cetățean" },
        register: { label: "Alocă număr de registru", actor: "Registratură" },
        route: { label: "Trimite către funcționar", actor: "Director" },
        start: { label: "Începe procesarea", actor: "Funcționar public" },
        attach: { label: "Atașează dovada", actor: "Funcționar public" },
        resolve: { label: "Rezolvă cererea", actor: "Funcționar public" },
      },
    },
    dataFlow: {
      title: "Flux de date semnat",
      label: "Ce se mută prin sistem",
      copy:
        "Demo-ul separă conținutul privat al cererii de dovezile publice de verificare. Fiecare pas înregistrează suficientă dovadă pentru audit fără publicarea documentelor brute.",
      publicData: "Dovezi publice în registru",
      privateData: "Date private în browser/documente",
      steps: [
        {
          title: "Cetățeanul depune",
          actor: "Credențial cetățean",
          data: "Textul cererii rămâne local sau off-chain; hash-ul payloadului și hash-ul DID devin dovezi publice.",
          proof: "„Cerere depusă” cu hash payload semnat",
        },
        {
          title: "Registratura alocă",
          actor: "Robot registratură",
          data: "Numărul intern intră în traseul public fără expunerea dosarului complet.",
          proof: "„Număr de registru alocat” leagă noua stare de hash-ul anterior",
        },
        {
          title: "Directorul repartizează",
          actor: "Credențial director",
          data: "Responsabilitatea trece către hash-ul DID al funcționarului public.",
          proof: "„Repartizată unui funcționar public” înregistrează rolul semnatarului și hash-ul responsabilului",
        },
        {
          title: "Funcționarul rezolvă",
          actor: "Funcționar public",
          data: "Dovezile și răspunsul final rămân off-chain; numai hash-urile documentelor sunt vizibile.",
          proof: "„Dovadă atașată” și „Răspuns comunicat” închid lanțul",
        },
      ],
    },
    integrity: {
      title: "Integritatea jurnalului",
      explainLabel: "Ce arată",
      valid: "valid",
      failed: "eșuată",
      validTitle: "Lanțul de hash-uri se verifică",
      failedTitle: "Rupere detectată în lanț",
      validCopy:
        "Registrul este un jurnal verificabil: fiecare eveniment vizibil trimite la amprenta (hash) stării precedente. În producție, capătul lanțului ar fi publicat extern.",
      failedCopy: "Un eveniment importat sau stocat nu mai corespunde hash-ului înregistrat.",
      eventsChecked: "Evenimente verificate",
      currentHead: "Capăt curent",
      firstInvalidEvent: "Primul eveniment invalid",
      noEvents: "Niciun eveniment",
      none: "Niciunul",
      tamperButton: "Testează export modificat",
      tamperFailedTitle: "Verificarea a eșuat",
      tamperFallbackReason: "Exportul modificat nu mai corespunde hash-urilor semnate.",
      tamperChainUnchanged: "Copia modificată a fost respinsă; lanțul stocat nu s-a schimbat.",
      backToVerified: "Înapoi la lanțul verificat",
    },
    transferSafety: {
      title: "Siguranța transferului",
      label: "Export și import",
      copy:
        "Starea demo se mută între browsere doar ca dovadă publică de registru. Importul este refuzat dacă lanțul de hash-uri nu se verifică.",
      idle: "pregătit",
      exported: "exportat",
      imported: "importat",
      rejected: "respins",
      reset: "resetat",
      idleDetail: "Nicio acțiune de transfer încă. Exportă starea după cel puțin un eveniment semnat.",
      exportScope: "Scop export",
      importGate: "Poartă import",
      keyBoundary: "Limita cheilor",
      lastResult: "Ultimul rezultat",
      eventCount: "{count} evenimente live",
      request: "Cerere activă {requestId}",
      chainMustVerify: "Lanțul de hash-uri trebuie să se verifice",
      refusesTampering: "Exporturile modificate sunt respinse înainte să înlocuiască starea locală.",
      noPrivateKeys: "Fără chei private exportate",
      localKeys: "Demo-urile importate pot fi citite și reverificate, dar semnatarii inițiali nu pot fi imitați.",
    },
    feed: {
      title: "Explorer public de cereri",
      visible: "vizibile",
      filters: "Filtre cereri",
      request: "Cerere",
      status: "Status",
      statusSummary: "Rezumat statusuri",
      institution: "Instituție",
      signerRole: "Rol semnatar",
      search: "Caută",
      searchPlaceholder: "Caută cerere, subiect, instituție, registru",
      sort: "Sortare",
      sortDeadline: "Termen apropiat",
      sortNewest: "Cele mai noi",
      sortEvents: "Cele mai multe evenimente",
      sortStatus: "Status",
      all: "Toate",
      resetFilters: "Resetează filtrele",
      latestRole: "Ultimul rol",
      trail: "Traseu",
      deadline: "Termen",
      source: "Sursă",
      noSigner: "Fără semnatar",
      events: "evenimente",
      live: "live",
      seed: "exemplu",
      emptyTitle: "Nicio cerere găsită",
      empty: "Registrul local are cereri, dar niciuna nu corespunde filtrelor curente.",
      emptyFilters: "Filtre active: {filters}.",
      visibleOf: "{count} din {total} cereri vizibile",
      daysRemaining: "{days} rămase",
      daysOverdue: "{days} întârziere",
      closed: "închisă",
      deadlineUnset: "se calculează la depunere",
    },
    operations: {
      title: "Încărcare instituții",
      copy:
        "Vedere operațională cu cozi deschise, dosare întârziate și următoarele termene din registrul local.",
      browserOnly: "simulare în browser",
      summary: "Rezumat încărcare instituții",
      institutions: "Instituții",
      open: "Deschise",
      overdue: "Întârziate",
      finalized: "Finalizate",
      nextFile: "Următorul dosar",
      nextDeadline: "Următorul termen",
      ownerQueue: "Coadă responsabilă",
      citizenQueue: "Draft cetățean",
      registryQueue: "Coadă registratură",
      directorQueue: "Coadă director",
      officerQueue: "Birou funcționar",
      escalationQueue: "Coadă escaladare",
      urgentOverdue: "Urgent pentru că are {days} zile întârziere.",
      urgentDueSoon: "Urgent pentru că termenul este în {days} zile.",
      urgentEarliest: "Primul în instituție după termen: {days} zile rămase.",
      noOpenFiles: "Fără dosare deschise",
      closedQueue: "Coadă închisă",
      none: "Niciunul",
    },
    scenarioComparison: {
      title: "Comparație scenarii",
      copy:
        "Sari între rezultatele principale simulate pentru Legea 544: răspuns normal, prelungire, întârziere, refuz și procesare activă.",
      browserOnly: "simulări preîncărcate",
      events: "Evenimente",
      deadline: "Termen",
      owner: "Responsabil",
      inspect: "Inspectează traseul",
      officer: "Birou funcționar",
      escalation: "Escaladare",
      closed: "Închis",
      refusal: "Dosar refuz",
      scenarios: {
        Resolved: "Răspuns normal",
        ExtensionRequested: "Prelungire legală",
        Overdue: "Termen depășit",
        Rejected: "Răspuns de refuz",
        InProgress: "Procesare activă",
      },
    },
    detail: {
      title: "Detaliu cerere",
      live: "lanț local live",
      seed: "exemplu public preîncărcat",
      institution: "Instituție",
      deadline: "Termen",
      latestSignerRole: "Ultimul rol semnatar",
      currentStatus: "Status curent",
      latestAction: "Ultima acțiune",
      responsibility: "Responsabilitate",
      evidence: "Dovadă",
      deadlineStatus: "Status termen",
      deadlineClosed: "Închisă",
      deadlineUnset: "Se calculează la depunere",
      deadlineOverdue: "Întârziată",
      deadlineDueSoon: "Termen apropiat",
      deadlineOnTrack: "În grafic",
      daysRemaining: "{days} rămase",
      daysOverdue: "{days} întârziere",
      handoffTitle: "Predare responsabilitate",
      registryStep: "Registratură",
      directorStep: "Rutare director",
      officerStep: "Birou funcționar",
      responseStep: "Răspuns final",
      signedBy: "Semnat de {role}",
      waitingForSignature: "Așteaptă semnătura",
      registryQueue: "Coadă registratură",
      directorQueue: "Coadă director",
      finalResponse: "Răspuns final",
      noSigner: "Fără semnatar încă",
      events: "Evenimente",
      citizenDidHash: "Hash DID cetățean",
      registryNumber: "Număr de registru",
      assignedDidHash: "Hash DID alocat",
      responseHash: "Hash răspuns",
      latestStateHash: "Ultimul hash de stare",
      latestSignature: "Ultima semnătură",
      notAssigned: "Nealocat",
      noResponse: "Fără răspuns final",
      noProof: "Fără dovadă încă",
    },
    evidenceBrief: {
      title: "Rezumat public al dovezilor",
      label: "Vedere cetățean",
      responsibleDesk: "Birou responsabil",
      latestSignedAction: "Ultima acțiune semnată",
      stateEvidence: "Dovada de stare",
      citizenCanVerify: "Cetățeanul poate verifica",
      signedBy: "Semnat de {role}",
      waiting: "Așteaptă primul eveniment semnat",
      hashChain: "Legat în lanțul public de hash-uri",
      documentHashAvailable: "Hash răspuns disponibil",
      noDocumentHash: "Fără hash de răspuns încă",
      awaitingResponse: "Așteaptă răspuns final",
      noProof: "Fără dovadă încă",
      registryQueue: "Coadă registratură",
      directorQueue: "Coadă director",
      escalationDesk: "Birou escaladare",
      responsePublished: "Răspuns publicat",
      refusalPublished: "Refuz publicat",
      nextSubmit: "Cetățeanul trebuie să depună cererea.",
      nextRegistry: "Registratura trebuie să aloce numărul oficial.",
      nextDirector: "Directorul trebuie să ruteze dosarul.",
      nextProcessing: "Funcționarul alocat trebuie să înceapă procesarea.",
      nextResolve: "Funcționarul trebuie să atașeze dovezi sau răspunsul final.",
      nextExtension: "Funcționarul trebuie să răspundă până la termenul extins.",
      nextEscalate: "Instituția trebuie să rezolve întârzierea și să explice depășirea.",
      nextVerify: "Cetățeanul poate verifica dovada și hash-ul răspunsului.",
      copyDraft: "Cererea este încă draft, deci nu există act administrativ public semnat.",
      copyCreated: "Depunerea cetățeanului este înregistrată și așteaptă registratura.",
      copyRegistered: "Instituția a alocat numărul de registru și trebuie să ruteze responsabilitatea.",
      copyRouted: "Directorul a rutat dosarul către un birou responsabil.",
      copyInProgress: "Biroul alocat procesează cererea și adaugă dovezi.",
      copyExtension: "Instituția a cerut prelungire; motivul semnat rămâne vizibil.",
      copyOverdue: "Termenul legal a fost depășit, deci dosarul apare ca escaladare.",
      copyResolved: "Cererea are hash final de răspuns care poate fi verificat local.",
      copyRejected: "Ruta de refuz este semnată, iar hash-ul răspunsului poate fi verificat local.",
    },
    graph: {
      title: "Mecanism birocratic",
      explainLabel: "Ce arată",
      copy:
        "Graful arată responsabilul curent al dosarului: cetățean, instituție, registratură, director, funcționar alocat sau răspuns final.",
      currentPath: "traseu curent",
      citizenDid: "DID cetățean",
      institution: "Instituție",
      registryAssigned: "Registru alocat",
      registryQueue: "Coadă registratură",
      directorRouted: "Rutat de director",
      directorQueue: "Coadă director",
      publicServant: "Funcționar public",
      unassigned: "Nealocat",
      complete: "complet",
      current: "curent",
      waiting: "în așteptare",
      hashEvidence: "dovadă hash",
      currentOwner: "Responsabil curent",
      finalResponse: "Răspuns final",
      refusalResponse: "Răspuns de refuz",
      escalationQueue: "Coadă escaladare",
      exceptionLane: "Rută internă specială",
      standardFlow: "Flux standard",
      noExceptions: "Nu există rută internă specială înregistrată.",
      extensionSignal: "Prelungire",
      partialDisclosureSignal: "Divulgare parțială",
      redirectSignal: "Redirecționare",
      overdueSignal: "Escaladare întârziere",
      rejectionSignal: "Refuz",
      signedMetadata: "Metadate semnate",
    },
    trail: {
      title: "Traseu de audit semnat",
      explainLabel: "Ce arată",
      explainerCopy:
        "Fiecare rând este o tranziție administrativă semnată, legată de starea precedentă prin hash-uri.",
      proofTitle: "Dovadă eveniment",
      event: "Eveniment",
      eventCode: "Cod eveniment",
      state: "Stare",
      signerRole: "Rol semnatar",
      signerDidHash: "Hash DID semnatar",
      credentialHash: "Hash credențial",
      payloadHash: "Hash payload",
      previousStateHash: "Hash stare precedentă",
      stateHash: "Hash stare",
      signature: "Semnătură",
      documentHash: "Hash document",
      metadata: "Metadate",
      copy: "Copiază",
      copied: "Copiat",
      none: "Niciuna",
      empty: "Nu există încă evenimente semnate pentru această cerere.",
    },
    hash: {
      title: "Verificator hash răspuns",
      explainLabel: "Ce arată",
      verified: "verificat",
      local: "local",
      copy:
        "Alege fișierul răspuns primit de la instituție. Browserul îi calculează amprenta (hash) local și o compară cu cea înregistrată pentru cererea selectată.",
      onLedgerHash: "Hash în registru",
      selectedFileHash: "Hash fișier selectat",
      noFinalResponse: "Fără răspuns final",
      chooseFile: "Alege fișier",
      chooseFileToVerify: "Alege un fișier de verificat",
      mismatch: "Amprenta calculată diferă de hash-ul înregistrat; fișierul este altul sau a fost modificat.",
      match: "Amprenta fișierului selectat este identică cu hash-ul răspunsului înregistrat.",
      waiting: "În așteptarea unui fișier",
    },
    proofPreview: {
      title: "Previzualizare dovezi",
      copy:
        "Inspectează pachetul public de dovezi înainte de export. Previzualizarea este generată local din cererea selectată și filtrul vizibil.",
      localOnly: "previzualizare locală",
      receipt: "Dovada selectată",
      report: "Raport vizibil",
      privacy: "Limita de confidențialitate",
      receiptScope: "{count} evenimente în dovadă",
      reportScope: "{count} cereri",
      reportEvents: "{count} evenimente semnate",
      privacyCopy: "Nu include documente brute, chei private sau date personale.",
      schema: "Schemă dovadă",
      chainHead: "Capăt lanț selectat",
      responseHashes: "Hash-uri răspuns",
      invalidChains: "Lanțuri invalide",
      none: "Niciunul",
    },
    receipt: {
      title: "Verificator dovadă",
      verified: "dovadă verificată",
      failed: "dovadă eșuată",
      local: "local",
      copy:
        "Alege o dovadă de audit exportată. Browserul verifică schema, ordinea evenimentelor, legăturile lanțului de hash-uri, referințele payload semnate și sumarul hash-ului răspunsului.",
      chooseFile: "Alege dovada",
      chooseReceipt: "Alege un fișier JSON de dovadă",
      loadedReceipt: "Dovada încărcată",
      receiptId: "Cerere dovadă",
      verdict: "Verdict verificare",
      reason: "Motiv eșec",
      eventsChecked: "Intrări dovadă",
      chainHead: "Capăt lanț",
      responseHash: "Hash răspuns",
      tamperButton: "Testează dovada modificată",
      noReceipt: "Nicio dovadă încărcată",
    },
    build: {
      title: "Versiune publicată",
      environment: "Mediu",
      builtAt: "Construită",
      local: "Build local",
    },
    familyLinks: {
      hub: "Toate proiectele civice",
    },
    privacy: {
      link: "Confidențialitate",
      title: "Notă de confidențialitate",
      intro:
        "Acest demo rulează integral în browserul tău. Ce creezi aici nu este trimis niciodată către un server.",
      points: [
        "Starea demo rămâne în acest browser: registrul, identitățile demo și alegerile de limbă și temă în localStorage, documentele demo în IndexedDB și o copie offline a aplicației în cache-ul service worker. Ștergerea datelor acestui site din browser le elimină pe toate.",
        "Fără cookie-uri, analiză de trafic sau trackere și fără scripturi sau fonturi de la terți.",
        "Toate identitățile din demo sunt fictive. Nu introduce date personale reale.",
        "Site-ul este găzduit pe Cloudflare Pages. Ca orice furnizor de găzduire, Cloudflare primește datele tehnice ale cererii (de exemplu adresa IP) necesare pentru a livra paginile.",
      ],
      operator: "Operat de Cristian Nichifor.",
      contact: "Întrebările și sesizările se trimit prin",
      contactLink: "issues pe GitHub",
      close: "Închide",
    },
    demoCompleteness: {
      title: "Completitudine demo",
      label: "Milestone doar în browser",
      status: "100% scop demo",
      copy:
        "Aplicația acoperă scopul demo agreat doar în browser, fără ROeID, servicii reale de identitate, resurse Cloudflare durabile sau dependențe de avizare juridică.",
      criteria: [
        {
          category: "Explorer public",
          title: "Feed Legea 544 anonimizat",
          copy: "Dashboardul pornește cu cereri preîncărcate și live, filtre de status, încărcarea instituțiilor și comparație scenarii.",
        },
        {
          category: "Flux semnat",
          title: "Ciclu complet al cererii",
          copy: "Prezentatorul poate rula depunere, registratură, rutare, procesare, atașare dovezi și răspuns.",
        },
        {
          category: "Rute alternative",
          title: "Excepțiile rămân vizibile",
          copy: "Prelungirea, întârzierea, refuzul, redirecționarea și divulgarea parțială sunt scenarii semnate.",
        },
        {
          category: "Dovezi publice",
          title: "Dovezi și verificare hash",
          copy: "Dovezile de audit, raportul de dovezi, verificarea hash-ului răspunsului și respingerea modificărilor sunt vizibile.",
        },
        {
          category: "Limita de confidențialitate",
          title: "Fără documente brute sau chei private",
          copy: "Dovada din registru rămâne publică și minimă; cheile rămân locale, iar importurile nu pot imita semnatarii inițiali.",
        },
        {
          category: "Prezentare",
          title: "Walkthrough responsive EN/RO",
          copy: "Alinierea Civic UI, tema luminos/întunecat, limba română, indiciile și verificările release sunt testate.",
        },
      ],
    },
    readiness: {
      title: "Pregătire release",
      status: "Status",
      statusReady: "Demo-ul din browser este pregătit",
      buildProof: "Dovadă build",
      commit: "Commit",
      branch: "Ramură",
      environment: "Mediu",
      builtAt: "Construită",
      deployTargets: "Țintele de publicare",
      hub: "Hub de proiecte",
      privacyBoundary: "Limita de confidențialitate",
      noRoeid: "Fără integrare ROeID",
      noDurableCloudflare: "Nu necesită resurse Cloudflare durabile",
      noPiiLedger: "Fără date personale sau documente brute în registru",
      localSigningKeys: "Cheile de semnare rămân în acest browser",
      verification: "Verificări",
      verify: "pnpm verify",
      demoVerify: "pnpm demo:verify",
      e2e: "E2E / Playwright",
      codeql: "CodeQL",
      gitleaks: "Secret Scan / gitleaks",
      dependencyReview: "dependency-review",
    },
    presenter: {
      title: "Checklist prezentare",
      label: "Flux demo live",
      copy:
        "Folosește această ordine pentru o prezentare publică de cinci minute după ce release-ul este verificat.",
      modeTitle: "Mod prezentare",
      modeNotice: "Mod prezentare activ (?presenter=1). Panourile de mai jos nu apar publicului.",
      exitMode: "Ieși din modul prezentare",
      cues: {
        explorer: {
          label: "Start",
          title: "Arată explorerul public",
          copy: "Indică cererile Legea 544 anonimizate și statusurile curente.",
          href: "#request-explorer-section",
        },
        scenario: {
          label: "Următor",
          title: "Rulează fluxul semnat",
          copy: "Avansează cererea și arată fiecare schimbare de stare înregistrată.",
          href: "#run-request",
        },
        machinery: {
          label: "Acum",
          title: "Deschide vederea mașinăriei",
          copy: "Arată responsabilul, transferul, rolul semnatar și graful.",
          href: "#request-accountability",
        },
        proofs: {
          label: "Verifică",
          title: "Previzualizează și verifică dovezi",
          copy: "Compară exporturile și hash-urile răspunsurilor fără documente brute.",
          href: "#proof-verification",
        },
        localization: {
          label: "Final",
          title: "Schimbă limba și vederea release",
          copy: "Încheie cu limba română și verificările de release-readiness.",
          href: "#release-operations",
        },
      },
      steps: [
        "Deschide explorerul și arată cererile Legea 544 anonimizate.",
        "Rulează scenariul complet de la depunere până la răspuns final.",
        "Arată rolurile semnatare, hash-urile DID, hash-urile de stare și graful.",
        "Exportă dovada de audit și explică faptul că documentele rămân în afara registrului.",
        "Verifică un fișier de răspuns primit față de hash-ul înregistrat.",
        "Rămâi în limba română pentru stakeholderii civici.",
      ],
      commandsTitle: "Comenzi operator",
      releaseCommand: "pnpm demo:release",
      captureCommand: "pnpm demo:capture",
    },
  },
};

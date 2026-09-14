export type Language = "en" | "ro";

export type Dictionary = {
  app: {
    eyebrow: string;
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
  };
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
  };
  feed: {
    title: string;
    visible: string;
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
    standalone: string;
    digital: string;
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
        "{actor} signed {action}. Status moved from {fromStatus} to {toStatus}.",
      transitionProofMessage: "Proof hash {hash}; verified ledger events: {count}.",
      transitionFailureMessage: "Could not apply transition.",
    },
    sections: {
      run: {
        title: "Run the request",
        copy: "Drive the live Law 544 flow and watch each signed transition change the dashboard.",
      },
      explorer: {
        title: "Public explorer",
        copy: "Browse anonymized seeded and live requests as a citizen-facing national feed.",
      },
      accountability: {
        title: "Request accountability",
        copy: "Inspect responsibility, current location, and the signed trail for the selected file.",
      },
      proof: {
        title: "Proof and verification",
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
    },
    feed: {
      title: "Public request explorer",
      visible: "visible",
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
      deadlineOverdue: "Overdue",
      deadlineDueSoon: "Due soon",
      deadlineOnTrack: "On track",
      daysRemaining: "{days} days remaining",
      daysOverdue: "{days} days overdue",
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
      standalone: "Standalone Pages",
      digital: "Digital mount",
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
        "Use this sequence for a five-minute public walkthrough after running the release check.",
      modeTitle: "Presenter mode",
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
      eyebrow: "Laborator de Administratie Publica Digitala",
      title: "Birocratie ca Software",
      intro:
        "Explorer public pentru Legea 544/2001: actiuni administrative semnate, trasee anonimizate si verificare locala a hash-ului raspunsului.",
      ledgerOk: "Registrul se verifica",
      ledgerFailed: "Verificarea registrului a esuat",
      actionsLabel: "Actiuni demo",
      exportState: "Exporta stare",
      importState: "Importa",
      exportReceipt: "Exporta dovada",
      exportProofReport: "Exporta raport",
      proofReportScope: "{count} cereri vizibile",
      proofReportEvents: "{count} evenimente semnate",
      proofReportResponses: "{count} hash-uri raspuns",
      reset: "Reseteaza",
      languageLabel: "Limba",
      themeLabel: "Tema",
      lightTheme: "Luminos",
      darkTheme: "Intunecat",
      english: "EN",
      romanian: "RO",
      loadingTitle: "Pregatim registrul local",
      loadingCopy: "Cream identitati demo, credentiale si un lant de hash-uri gol in browser.",
      startMessage: "Gata pentru rulare live. Depune cererea pentru prima tranzitie semnata.",
      resetMessage: "Demo resetat. Cererea live este goala si asteapta prima semnatura a cetateanului.",
      exportStateMessage: "Au fost exportate {count} evenimente. Cheile de semnare raman in browser.",
      exportReceiptMessage: "Dovada de audit pentru {requestId} a fost exportata.",
      exportProofReportMessage: "Raportul pentru {count} cereri vizibile a fost exportat.",
      importSuccessMessage:
        "Au fost importate {count} evenimente si lantul de hash-uri se verifica. Cheile private nu au fost importate.",
      importFailureMessage: "Fisierul nu a putut fi citit.",
      tamperNeedsEventMessage: "Creeaza cel putin un eveniment inainte sa testezi un export modificat.",
      tamperUnexpectedMessage: "Rezultat neasteptat: exportul modificat a fost importat cu succes.",
      tamperWorkedMessage: "Testul de modificare a functionat: {reason}",
      tamperWorkedFallbackMessage: "Testul de modificare a functionat: exportul editat a fost respins.",
      scenarioReplayedMessage: "Scenariul {scenario} a rulat: {count} schimbari semnate se verifica.",
      transitionRecordedMessage:
        "{actor} a semnat {action}. Statusul a trecut de la {fromStatus} la {toStatus}.",
      transitionProofMessage: "Hash dovada {hash}; evenimente verificate in registru: {count}.",
      transitionFailureMessage: "Tranzitia nu a putut fi aplicata.",
    },
    sections: {
      run: {
        title: "Ruleaza cererea",
        copy: "Parcurge fluxul Legea 544 si urmareste fiecare tranzitie semnata in dashboard.",
      },
      explorer: {
        title: "Explorer public",
        copy: "Consulta cereri anonimizate, preincarcate sau create local, ca intr-un flux national public.",
      },
      accountability: {
        title: "Responsabilitate pe cerere",
        copy: "Inspecteaza responsabilul curent, traseul dosarului si auditul semnat.",
      },
      proof: {
        title: "Dovezi si verificare",
        copy: "Exporta dovezi si compara local fisierele primite cu hash-urile inregistrate.",
      },
      release: {
        title: "Operare release",
        copy: "Note de prezentare, tinte deploy, verificari si metadate build pentru demo.",
      },
    },
    guided: {
      title: "Flux ghidat Legea 544",
      complete: "complet",
      nextStep: "pasul urmator",
      signs: "semneaza",
      scenariosLabel: "Reluare scenariu dintr-un click",
      controlsLabel: "Controale cronologie",
      stepNext: "Pasul urmator",
      autoRun: "Ruleaza automat",
      pause: "Pauza",
      recordedLabel: "Tocmai inregistrat",
      noRecordedEvent: "Niciun eveniment inregistrat inca",
      scenarios: {
        "happy-path": "Ruleaza complet",
        extension: "Prelungire",
        "deadline-warning": "Termen apropiat",
        "partial-disclosure": "Divulgare partiala",
        redirected: "Redirectionata",
        overdue: "Intarziata",
        rejected: "Respinsa",
      },
      scenarioOutcome: "Rezultat",
      scenarioEvents: "evenimente semnate",
      scenarioSummaries: {
        "happy-path": "Ciclul normal al cererii, cu dovada si hash pentru raspunsul final.",
        extension: "Prelungire permisa, apoi rezolvare din starea extinsa.",
        "deadline-warning": "Stare de prelungire deschisa, cu termen si escaladare vizibile.",
        "partial-disclosure": "Nota de redactare si hash pentru raspuns partial.",
        redirected: "Redirectionare catre autoritatea competenta, semnata ca rezolvare.",
        overdue: "Registratura marcheaza cererea ca intarziata dupa termenul legal.",
        rejected: "Refuz semnat pentru o cerere in afara scopului demo.",
      },
      scenarioProofs: {
        "happy-path": "Demonstreaza fluxul complet pana la verificarea raspunsului.",
        extension: "Demonstreaza ca prelungirea trece doar prin ruta codificata.",
        "deadline-warning": "Demonstreaza presiunea termenului inainte de inchidere.",
        "partial-disclosure": "Demonstreaza auditarea redactarii fara publicarea documentelor.",
        redirected: "Demonstreaza verificarea redirectionarii din metadate publice.",
        overdue: "Demonstreaza ca termenul depasit ramane vizibil.",
        rejected: "Demonstreaza ca refuzul are nevoie de raspuns semnat.",
      },
      steps: {
        create: { label: "Depune cererea", actor: "Cetatean" },
        register: { label: "Aloca numar de registru", actor: "Registratura" },
        route: { label: "Trimite catre functionar", actor: "Director" },
        start: { label: "Incepe procesarea", actor: "Functionar public" },
        attach: { label: "Ataseaza dovada", actor: "Functionar public" },
        resolve: { label: "Rezolva cererea", actor: "Functionar public" },
      },
    },
    integrity: {
      title: "Integritatea registrului",
      explainLabel: "Ce arata",
      valid: "valid",
      failed: "esuata",
      validTitle: "Lantul de hash-uri se verifica",
      failedTitle: "Rupere detectata in lant",
      validCopy:
        "Fiecare eveniment vizibil trimite la hash-ul starii precedente. In productie, capatul lantului ar fi publicat extern.",
      failedCopy: "Un eveniment importat sau stocat nu mai corespunde hash-ului inregistrat.",
      eventsChecked: "Evenimente verificate",
      currentHead: "Capat curent",
      firstInvalidEvent: "Primul eveniment invalid",
      noEvents: "Niciun eveniment",
      none: "Niciunul",
      tamperButton: "Testeaza export modificat",
    },
    feed: {
      title: "Explorer public de cereri",
      visible: "vizibile",
      request: "Cerere",
      status: "Status",
      statusSummary: "Rezumat statusuri",
      institution: "Institutie",
      signerRole: "Rol semnatar",
      search: "Cauta",
      searchPlaceholder: "Cauta cerere, subiect, institutie, registru",
      sort: "Sortare",
      sortDeadline: "Termen apropiat",
      sortNewest: "Cele mai noi",
      sortEvents: "Cele mai multe evenimente",
      sortStatus: "Status",
      all: "Toate",
      resetFilters: "Reseteaza filtrele",
      latestRole: "Ultimul rol",
      trail: "Traseu",
      deadline: "Termen",
      source: "Sursa",
      noSigner: "Fara semnatar",
      events: "evenimente",
      live: "live",
      seed: "exemplu",
      emptyTitle: "Nicio cerere gasita",
      empty: "Registrul local are cereri, dar niciuna nu corespunde filtrelor curente.",
    },
    operations: {
      title: "Incarcare institutii",
      copy:
        "Vedere operationala cu cozi deschise, dosare intarziate si urmatoarele termene din registrul local.",
      browserOnly: "simulare in browser",
      summary: "Rezumat incarcare institutii",
      institutions: "Institutii",
      open: "Deschise",
      overdue: "Intarziate",
      finalized: "Finalizate",
      nextFile: "Urmatorul dosar",
      nextDeadline: "Urmatorul termen",
      ownerQueue: "Coada responsabila",
      citizenQueue: "Draft cetatean",
      registryQueue: "Coada registratura",
      directorQueue: "Coada director",
      officerQueue: "Birou functionar",
      escalationQueue: "Coada escaladare",
      urgentOverdue: "Urgent pentru ca are {days} zile intarziere.",
      urgentDueSoon: "Urgent pentru ca termenul este in {days} zile.",
      urgentEarliest: "Primul in institutie dupa termen: {days} zile ramase.",
      noOpenFiles: "Fara dosare deschise",
      closedQueue: "Coada inchisa",
      none: "Niciunul",
    },
    scenarioComparison: {
      title: "Comparatie scenarii",
      copy:
        "Sari intre rezultatele principale simulate pentru Legea 544: raspuns normal, prelungire, intarziere, refuz si procesare activa.",
      browserOnly: "simulari preincarcate",
      events: "Evenimente",
      deadline: "Termen",
      owner: "Responsabil",
      inspect: "Inspecteaza traseul",
      officer: "Birou functionar",
      escalation: "Escaladare",
      closed: "Inchis",
      refusal: "Dosar refuz",
      scenarios: {
        Resolved: "Raspuns normal",
        ExtensionRequested: "Prelungire legala",
        Overdue: "Termen depasit",
        Rejected: "Raspuns de refuz",
        InProgress: "Procesare activa",
      },
    },
    detail: {
      title: "Detaliu cerere",
      live: "lant local live",
      seed: "exemplu public preincarcat",
      institution: "Institutie",
      deadline: "Termen",
      latestSignerRole: "Ultimul rol semnatar",
      currentStatus: "Status curent",
      latestAction: "Ultima actiune",
      responsibility: "Responsabilitate",
      evidence: "Dovada",
      deadlineStatus: "Status termen",
      deadlineClosed: "Inchisa",
      deadlineOverdue: "Intarziata",
      deadlineDueSoon: "Termen apropiat",
      deadlineOnTrack: "In grafic",
      daysRemaining: "{days} zile ramase",
      daysOverdue: "{days} zile intarziere",
      handoffTitle: "Predare responsabilitate",
      registryStep: "Registratura",
      directorStep: "Rutare director",
      officerStep: "Birou functionar",
      responseStep: "Raspuns final",
      signedBy: "Semnat de {role}",
      waitingForSignature: "Asteapta semnatura",
      registryQueue: "Coada registratura",
      directorQueue: "Coada director",
      finalResponse: "Raspuns final",
      noSigner: "Fara semnatar inca",
      events: "Evenimente",
      citizenDidHash: "Hash DID cetatean",
      registryNumber: "Numar de registru",
      assignedDidHash: "Hash DID alocat",
      responseHash: "Hash raspuns",
      latestStateHash: "Ultimul hash de stare",
      latestSignature: "Ultima semnatura",
      notAssigned: "Nealocat",
      noResponse: "Fara raspuns final",
      noProof: "Fara dovada inca",
    },
    evidenceBrief: {
      title: "Rezumat public al dovezilor",
      label: "Vedere cetatean",
      responsibleDesk: "Birou responsabil",
      latestSignedAction: "Ultima actiune semnata",
      stateEvidence: "Dovada de stare",
      citizenCanVerify: "Cetateanul poate verifica",
      signedBy: "Semnat de {role}",
      waiting: "Asteapta primul eveniment semnat",
      hashChain: "Legat in lantul public de hash-uri",
      documentHashAvailable: "Hash raspuns disponibil",
      noDocumentHash: "Fara hash de raspuns inca",
      awaitingResponse: "Asteapta raspuns final",
      noProof: "Fara dovada inca",
      registryQueue: "Coada registratura",
      directorQueue: "Coada director",
      escalationDesk: "Birou escaladare",
      responsePublished: "Raspuns publicat",
      refusalPublished: "Refuz publicat",
      nextSubmit: "Cetateanul trebuie sa depuna cererea.",
      nextRegistry: "Registratura trebuie sa aloce numarul oficial.",
      nextDirector: "Directorul trebuie sa ruteze dosarul.",
      nextProcessing: "Functionarul alocat trebuie sa inceapa procesarea.",
      nextResolve: "Functionarul trebuie sa ataseze dovezi sau raspunsul final.",
      nextExtension: "Functionarul trebuie sa raspunda pana la termenul extins.",
      nextEscalate: "Institutia trebuie sa rezolve intarzierea si sa explice depasirea.",
      nextVerify: "Cetateanul poate verifica dovada si hash-ul raspunsului.",
      copyDraft: "Cererea este inca draft, deci nu exista act administrativ public semnat.",
      copyCreated: "Depunerea cetateanului este inregistrata si asteapta registratura.",
      copyRegistered: "Institutia a alocat numarul de registru si trebuie sa ruteze responsabilitatea.",
      copyRouted: "Directorul a rutat dosarul catre un birou responsabil.",
      copyInProgress: "Biroul alocat proceseaza cererea si adauga dovezi.",
      copyExtension: "Institutia a cerut prelungire; motivul semnat ramane vizibil.",
      copyOverdue: "Termenul legal a fost depasit, deci dosarul apare ca escaladare.",
      copyResolved: "Cererea are hash final de raspuns care poate fi verificat local.",
      copyRejected: "Ruta de refuz este semnata, iar hash-ul raspunsului poate fi verificat local.",
    },
    graph: {
      title: "Mecanism birocratic",
      explainLabel: "Ce arata",
      copy:
        "Graful arata responsabilul curent al dosarului: cetatean, institutie, registratura, director, functionar alocat sau raspuns final.",
      currentPath: "traseu curent",
      citizenDid: "DID cetatean",
      institution: "Institutie",
      registryAssigned: "Registru alocat",
      registryQueue: "Coada registratura",
      directorRouted: "Rutat de director",
      directorQueue: "Coada director",
      publicServant: "Functionar public",
      unassigned: "Nealocat",
      complete: "complet",
      current: "curent",
      waiting: "in asteptare",
      hashEvidence: "dovada hash",
      currentOwner: "Responsabil curent",
      finalResponse: "Raspuns final",
      refusalResponse: "Raspuns de refuz",
      escalationQueue: "Coada escaladare",
      exceptionLane: "Ruta interna speciala",
      standardFlow: "Flux standard",
      noExceptions: "Nu exista ruta interna speciala inregistrata.",
      extensionSignal: "Prelungire",
      partialDisclosureSignal: "Divulgare partiala",
      redirectSignal: "Redirectionare",
      overdueSignal: "Escaladare intarziere",
      rejectionSignal: "Refuz",
      signedMetadata: "Metadate semnate",
    },
    trail: {
      title: "Traseu de audit semnat",
      explainLabel: "Ce arata",
      explainerCopy:
        "Fiecare rand este o tranzitie administrativa semnata, legata de starea precedenta prin hash-uri.",
      proofTitle: "Dovada eveniment",
      state: "Stare",
      signerRole: "Rol semnatar",
      signerDidHash: "Hash DID semnatar",
      credentialHash: "Hash credential",
      payloadHash: "Hash payload",
      previousStateHash: "Hash stare precedenta",
      stateHash: "Hash stare",
      signature: "Semnatura",
      documentHash: "Hash document",
      metadata: "Metadate",
      copy: "Copiaza",
      copied: "Copiat",
      none: "Niciuna",
      empty: "Nu exista inca evenimente semnate pentru aceasta cerere.",
    },
    hash: {
      title: "Verificator hash raspuns",
      explainLabel: "Ce arata",
      verified: "verificat",
      local: "local",
      copy:
        "Alege fisierul raspuns primit. Browserul ii calculeaza hash-ul local si il compara cu hash-ul inregistrat pentru cererea selectata.",
      onLedgerHash: "Hash in registru",
      selectedFileHash: "Hash fisier selectat",
      noFinalResponse: "Fara raspuns final",
      chooseFile: "Alege fisier",
      chooseFileToVerify: "Alege un fisier de verificat",
      mismatch: "Fisierul selectat nu corespunde hash-ului inregistrat.",
      match: "Fisierul selectat corespunde hash-ului raspunsului inregistrat.",
      waiting: "In asteptarea unui fisier",
    },
    proofPreview: {
      title: "Previzualizare dovezi",
      copy:
        "Inspecteaza pachetul public de dovezi inainte de export. Previzualizarea este generata local din cererea selectata si filtrul vizibil.",
      localOnly: "previzualizare locala",
      receipt: "Dovada selectata",
      report: "Raport vizibil",
      privacy: "Limita de confidentialitate",
      receiptScope: "{count} evenimente in dovada",
      reportScope: "{count} cereri",
      reportEvents: "{count} evenimente semnate",
      privacyCopy: "Nu include documente brute, chei private sau date personale.",
      schema: "Schema dovada",
      chainHead: "Capat lant selectat",
      responseHashes: "Hash-uri raspuns",
      invalidChains: "Lanturi invalide",
      none: "Niciunul",
    },
    receipt: {
      title: "Verificator dovada",
      verified: "dovada verificata",
      failed: "dovada esuata",
      local: "local",
      copy:
        "Alege o dovada de audit exportata. Browserul verifica schema, ordinea evenimentelor, legaturile lantului de hash-uri, referintele payload semnate si sumarul hash-ului raspunsului.",
      chooseFile: "Alege dovada",
      chooseReceipt: "Alege un fisier JSON de dovada",
      loadedReceipt: "Dovada incarcata",
      receiptId: "Cerere dovada",
      verdict: "Verdict verificare",
      reason: "Motiv esec",
      eventsChecked: "Intrari dovada",
      chainHead: "Capat lant",
      responseHash: "Hash raspuns",
      tamperButton: "Testeaza dovada modificata",
      noReceipt: "Nicio dovada incarcata",
    },
    build: {
      title: "Versiune publicata",
      environment: "Mediu",
      builtAt: "Construita",
      local: "Build local",
    },
    readiness: {
      title: "Pregatire release",
      status: "Status",
      statusReady: "Demo-ul din browser este pregatit",
      buildProof: "Dovada build",
      commit: "Commit",
      branch: "Ramura",
      environment: "Mediu",
      builtAt: "Construita",
      deployTargets: "Tintele de publicare",
      standalone: "Pages standalone",
      digital: "Montare digital",
      privacyBoundary: "Limita de confidentialitate",
      noRoeid: "Fara integrare ROeID",
      noDurableCloudflare: "Nu necesita resurse Cloudflare durabile",
      noPiiLedger: "Fara date personale sau documente brute in registru",
      localSigningKeys: "Cheile de semnare raman in acest browser",
      verification: "Verificari",
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
        "Foloseste aceasta ordine pentru o prezentare publica de cinci minute dupa verificarea release-ului.",
      modeTitle: "Mod prezentare",
      cues: {
        explorer: {
          label: "Start",
          title: "Arata explorerul public",
          copy: "Indica cererile Legea 544 anonimizate si statusurile curente.",
          href: "#request-explorer-section",
        },
        scenario: {
          label: "Urmator",
          title: "Ruleaza fluxul semnat",
          copy: "Avanseaza cererea si arata fiecare schimbare de stare inregistrata.",
          href: "#run-request",
        },
        machinery: {
          label: "Acum",
          title: "Deschide vederea masinariei",
          copy: "Arata responsabilul, transferul, rolul semnatar si graful.",
          href: "#request-accountability",
        },
        proofs: {
          label: "Verifica",
          title: "Previzualizeaza si verifica dovezi",
          copy: "Compara exporturile si hash-urile raspunsurilor fara documente brute.",
          href: "#proof-verification",
        },
        localization: {
          label: "Final",
          title: "Schimba limba si vederea release",
          copy: "Incheie cu limba romana si verificarile de release-readiness.",
          href: "#release-operations",
        },
      },
      steps: [
        "Deschide explorerul si arata cererile Legea 544 anonimizate.",
        "Ruleaza scenariul complet de la depunere pana la raspuns final.",
        "Arata rolurile semnatare, hash-urile DID, hash-urile de stare si graful.",
        "Exporta dovada de audit si explica faptul ca documentele raman in afara registrului.",
        "Verifica un fisier de raspuns primit fata de hash-ul inregistrat.",
        "Ramai in limba romana pentru stakeholderii civici.",
      ],
      commandsTitle: "Comenzi operator",
      releaseCommand: "pnpm demo:release",
      captureCommand: "pnpm demo:capture",
    },
  },
};

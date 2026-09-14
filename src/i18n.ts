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
    reset: string;
    languageLabel: string;
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
    steps: Record<string, { label: string; actor: string }>;
  };
  integrity: {
    title: string;
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
  graph: {
    title: string;
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
  };
  trail: {
    title: string;
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
  receipt: {
    title: string;
    verified: string;
    failed: string;
    local: string;
    copy: string;
    chooseFile: string;
    chooseReceipt: string;
    loadedReceipt: string;
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
      reset: "Reset",
      languageLabel: "Language",
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
        overdue: "Overdue",
        rejected: "Rejected",
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
    graph: {
      title: "Bureaucratic machinery",
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
    },
    trail: {
      title: "Signed audit trail",
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
      reset: "Reseteaza",
      languageLabel: "Limba",
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
        overdue: "Intarziata",
        rejected: "Respinsa",
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
    graph: {
      title: "Mecanism birocratic",
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
    },
    trail: {
      title: "Traseu de audit semnat",
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
  },
};

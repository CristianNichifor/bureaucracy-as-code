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
    reset: string;
    languageLabel: string;
    english: string;
    romanian: string;
  };
  guided: {
    title: string;
    complete: string;
    nextStep: string;
    signs: string;
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
    status: string;
    institution: string;
    signerRole: string;
    all: string;
    latestRole: string;
    trail: string;
    deadline: string;
    source: string;
    noSigner: string;
    events: string;
    live: string;
    seed: string;
    empty: string;
  };
  detail: {
    title: string;
    live: string;
    seed: string;
    institution: string;
    deadline: string;
    latestSignerRole: string;
    noSigner: string;
    events: string;
    citizenDidHash: string;
    registryNumber: string;
    assignedDidHash: string;
    responseHash: string;
    notAssigned: string;
    noResponse: string;
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
  };
  trail: {
    title: string;
    state: string;
    signerRole: string;
    signerDidHash: string;
    stateHash: string;
    documentHash: string;
    metadata: string;
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
      reset: "Reset",
      languageLabel: "Language",
      english: "EN",
      romanian: "RO",
    },
    guided: {
      title: "Guided Law 544 run",
      complete: "complete",
      nextStep: "next step",
      signs: "signs",
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
      status: "Status",
      institution: "Institution",
      signerRole: "Signer role",
      all: "All",
      latestRole: "Latest role",
      trail: "Trail",
      deadline: "Deadline",
      source: "Source",
      noSigner: "No signer",
      events: "events",
      live: "live",
      seed: "seed",
      empty: "No requests match these filters.",
    },
    detail: {
      title: "Request detail",
      live: "live browser chain",
      seed: "seeded public example",
      institution: "Institution",
      deadline: "Deadline",
      latestSignerRole: "Latest signer role",
      noSigner: "No signer yet",
      events: "Events",
      citizenDidHash: "Citizen DID hash",
      registryNumber: "Registry number",
      assignedDidHash: "Assigned DID hash",
      responseHash: "Response hash",
      notAssigned: "Not assigned",
      noResponse: "No response yet",
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
    },
    trail: {
      title: "Signed audit trail",
      state: "State",
      signerRole: "Signer role",
      signerDidHash: "Signer DID hash",
      stateHash: "State hash",
      documentHash: "Document hash",
      metadata: "Metadata",
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
      reset: "Reseteaza",
      languageLabel: "Limba",
      english: "EN",
      romanian: "RO",
    },
    guided: {
      title: "Flux ghidat Legea 544",
      complete: "complet",
      nextStep: "pasul urmator",
      signs: "semneaza",
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
      status: "Status",
      institution: "Institutie",
      signerRole: "Rol semnatar",
      all: "Toate",
      latestRole: "Ultimul rol",
      trail: "Traseu",
      deadline: "Termen",
      source: "Sursa",
      noSigner: "Fara semnatar",
      events: "evenimente",
      live: "live",
      seed: "exemplu",
      empty: "Nicio cerere nu corespunde filtrelor.",
    },
    detail: {
      title: "Detaliu cerere",
      live: "lant local live",
      seed: "exemplu public preincarcat",
      institution: "Institutie",
      deadline: "Termen",
      latestSignerRole: "Ultimul rol semnatar",
      noSigner: "Fara semnatar inca",
      events: "Evenimente",
      citizenDidHash: "Hash DID cetatean",
      registryNumber: "Numar de registru",
      assignedDidHash: "Hash DID alocat",
      responseHash: "Hash raspuns",
      notAssigned: "Nealocat",
      noResponse: "Fara raspuns final",
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
    },
    trail: {
      title: "Traseu de audit semnat",
      state: "Stare",
      signerRole: "Rol semnatar",
      signerDidHash: "Hash DID semnatar",
      stateHash: "Hash stare",
      documentHash: "Hash document",
      metadata: "Metadate",
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
    },
  },
};

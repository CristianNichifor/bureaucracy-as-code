import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileCheck2, FilePlus2, GitBranch, RefreshCw, ShieldCheck, Upload } from "lucide-react";
import { RequestFeed } from "./dashboard/RequestFeed";
import { RequestTrail } from "./dashboard/RequestTrail";
import { HashVerifier } from "./dashboard/HashVerifier";
import { MachineryGraph } from "./graph/MachineryGraph";
import { BrowserIdentityProvider } from "./identity/BrowserIdentityProvider";
import type { DemoContext } from "./demo/scenarioLaw544";
import { applyDemoAction, createDemoDocumentHash, createInitialDemoContext } from "./demo/scenarioLaw544";
import { LocalLedgerProvider } from "./ledger/LocalLedgerProvider";
import type { LedgerEvent } from "./ledger/types";

export function App() {
  const ledger = useMemo(() => new LocalLedgerProvider(), []);
  const provider = useMemo(() => new BrowserIdentityProvider(), []);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [chainValid, setChainValid] = useState<boolean>(true);
  const [message, setMessage] = useState("Start the scenario to create a signed Law 544 request.");

  const refresh = useCallback(async () => {
    const nextEvents = await ledger.listEvents();
    setEvents(nextEvents);
    setChainValid((await ledger.verifyChain()).valid);
  }, [ledger]);

  const resetDemo = useCallback(async () => {
    await ledger.reset();
    setContext(await createInitialDemoContext());
    setEvents([]);
    setChainValid(true);
    setMessage("Demo reset. Submit the request to begin the chain.");
  }, [ledger]);

  useEffect(() => {
    void resetDemo();
  }, [resetDemo]);

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

  return (
    <main className="appShell">
      <header className="hero">
        <div>
          <p className="eyebrow">Digital Public Administration Lab</p>
          <h1>Bureaucracy as Code</h1>
          <p>
            A browser-only Law 544/2001 demo where every administrative action is a signed,
            tamper-evident state transition.
          </p>
        </div>
        <div className="integrity">
          <ShieldCheck size={20} />
          <span>{chainValid ? "Ledger verifies" : "Ledger verification failed"}</span>
        </div>
      </header>

      <section className="toolbar" aria-label="Demo actions">
        <button onClick={() => void runAction("create")}><FilePlus2 size={18} />Submit</button>
        <button onClick={() => void runAction("register")}><Upload size={18} />Register</button>
        <button onClick={() => void runAction("route")}><GitBranch size={18} />Route</button>
        <button onClick={() => void runAction("start")}><CheckCircle2 size={18} />Start</button>
        <button onClick={() => void runAction("attach")}><FileCheck2 size={18} />Attach</button>
        <button onClick={() => void runAction("resolve")}><ShieldCheck size={18} />Resolve</button>
        <button className="secondary" onClick={() => void resetDemo()}><RefreshCw size={18} />Reset</button>
      </section>

      <p className="message">{message}</p>

      <div className="grid">
        <RequestFeed request={request} />
        <MachineryGraph request={request} />
        <RequestTrail events={events} />
        <HashVerifier expectedHash={request.responseDocumentHash} />
      </div>
    </main>
  );
}

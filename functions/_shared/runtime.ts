import { InMemoryRequestRepository } from "../../src/api/InMemoryRequestRepository";
import { TransitionIngestionService } from "../../src/api/transitionIngestion";
import { BrowserIdentityProvider } from "../../src/identity/BrowserIdentityProvider";
import { InMemoryLedgerProvider } from "./InMemoryLedgerProvider";

const identity = new BrowserIdentityProvider();
const ledger = new InMemoryLedgerProvider();
const requests = new InMemoryRequestRepository();

export const apiRuntime = {
  identity,
  ledger,
  requests,
  ingestion: new TransitionIngestionService({ identity, ledger, requests }),
};


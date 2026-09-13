import { InMemoryRequestRepository } from "../../src/api/InMemoryRequestRepository";
import { InMemoryNonceStore } from "../../src/api/InMemoryNonceStore";
import { TransitionIngestionService } from "../../src/api/transitionIngestion";
import { BrowserIdentityProvider } from "../../src/identity/BrowserIdentityProvider";
import { InMemoryLedgerProvider } from "./InMemoryLedgerProvider";

const identity = new BrowserIdentityProvider();
const ledger = new InMemoryLedgerProvider();
const requests = new InMemoryRequestRepository();
const nonces = new InMemoryNonceStore();

export const apiRuntime = {
  identity,
  ledger,
  requests,
  nonces,
  ingestion: new TransitionIngestionService({ identity, ledger, requests, nonces }),
};

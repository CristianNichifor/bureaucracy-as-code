export type HashCheckState = "waiting" | "local" | "match" | "mismatch";

/** Compares a locally hashed file with the response hash recorded on the ledger. */
export function getHashCheckState(expectedHash: string | undefined, actualHash: string): HashCheckState {
  if (!actualHash) return "waiting";
  if (!expectedHash) return "local";
  return expectedHash === actualHash ? "match" : "mismatch";
}

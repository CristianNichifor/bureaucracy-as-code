import type { NonceStore } from "./types";

export class InMemoryNonceStore implements NonceStore {
  private readonly seen = new Map<string, string>();

  async has(input: { signerDidHash: string; nonce: string }): Promise<boolean> {
    return this.seen.has(nonceKey(input));
  }

  async remember(input: { signerDidHash: string; nonce: string; signedAt: string }): Promise<void> {
    this.seen.set(nonceKey(input), input.signedAt);
  }

  async reset(): Promise<void> {
    this.seen.clear();
  }
}

function nonceKey(input: { signerDidHash: string; nonce: string }) {
  return `${input.signerDidHash}:${input.nonce}`;
}

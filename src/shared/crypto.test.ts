import { describe, expect, it } from "vitest";
import {
  fromBase64,
  hashJson,
  sha256Hex,
  signText,
  stableStringify,
  toBase64,
  verifyText,
} from "./crypto";

async function demoKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
    "sign",
    "verify",
  ]);
}

describe("sha256Hex", () => {
  it("matches the published digest for the standard test vector", async () => {
    expect(await sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("changes completely when a single character changes", async () => {
    const before = await sha256Hex("Request_Resolved");
    const after = await sha256Hex("Request_Rejected");
    expect(after).not.toBe(before);
  });
});

describe("stableStringify", () => {
  it("does not depend on the order the keys were written in", () => {
    expect(stableStringify({ b: 2, a: 1 })).toBe(stableStringify({ a: 1, b: 2 }));
  });

  it("sorts nested objects too, so a hash survives a reshuffled payload", async () => {
    const first = { action: "Task_Routed", metadata: { assignedToDidHash: "x", note: "y" } };
    const second = { metadata: { note: "y", assignedToDidHash: "x" }, action: "Task_Routed" };
    expect(await hashJson(first)).toBe(await hashJson(second));
  });

  it("keeps array order, because order is meaning in a chain", () => {
    expect(stableStringify([1, 2])).not.toBe(stableStringify([2, 1]));
  });
});

describe("base64 round trip", () => {
  it("returns the bytes it was given", () => {
    const bytes = new Uint8Array([0, 1, 127, 128, 255]);
    const restored = fromBase64(toBase64(bytes.buffer));
    expect([...restored]).toEqual([...bytes]);
  });
});

describe("signText / verifyText", () => {
  it("verifies a signature made by the matching private key", async () => {
    const { privateKey, publicKey } = await demoKeyPair();
    const payloadHash = await sha256Hex("REQ-2026-0001:Request_Resolved");
    const signature = await signText(privateKey, payloadHash);

    expect(await verifyText(await crypto.subtle.exportKey("jwk", publicKey), signature, payloadHash)).toBe(
      true,
    );
  });

  it("rejects the signature once the signed text is altered", async () => {
    const { privateKey, publicKey } = await demoKeyPair();
    const signature = await signText(privateKey, "REQ-2026-0001:Request_Resolved");

    expect(
      await verifyText(
        await crypto.subtle.exportKey("jwk", publicKey),
        signature,
        "REQ-2026-0001:Request_Rejected",
      ),
    ).toBe(false);
  });

  it("rejects a signature checked against somebody else's key", async () => {
    const signer = await demoKeyPair();
    const stranger = await demoKeyPair();
    const payloadHash = await sha256Hex("REQ-2026-0001:Registry_Assigned");
    const signature = await signText(signer.privateKey, payloadHash);

    expect(
      await verifyText(await crypto.subtle.exportKey("jwk", stranger.publicKey), signature, payloadHash),
    ).toBe(false);
  });
});

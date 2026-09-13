/**
 * A `Storage` that lives in a Map. Tests run in Node, which has no `localStorage`, and the
 * ledger is deliberately built on the real browser API rather than an abstraction over it.
 * Only tests import this — the app never does.
 */
export function memoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => [...entries.keys()][index] ?? null,
    removeItem: (key: string) => {
      entries.delete(key);
    },
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  };
}

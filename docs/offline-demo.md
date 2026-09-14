# Offline Demo Mode

Production builds register a small service worker so the demo remains usable
during presentations after the first successful online load.

## What Is Cached

- app shell route
- `index.html`
- `manifest.webmanifest`
- `build-info.json`
- same-origin built assets after the browser requests them

The service worker uses network-first handling for navigations and cache-first
handling for static assets. This keeps the latest deployed app preferred while
still giving the presenter a usable fallback if the network drops.

## What Is Not Synced

Browser-local demo data stays in the browser:

- DID-like demo identities
- private signing keys
- IndexedDB documents
- local hash-chain ledger events

Offline mode does not create shared state, durable public storage, ROeID
integration, or Cloudflare data resources.

## Verification

Run:

```bash
pnpm demo:verify
```

The Playwright suite checks that the production preview registers the service
worker under `/bureaucracy-as-code/`.

## Presenter Checklist

1. Open the deployed demo once while online.
2. Run the guided scenario or select a seeded request.
3. Keep the tab open for the presentation.
4. If the network drops, refresh and continue from the browser-local state.

# Bureaucracy as Code

Browser-only demo for a Romanian public administration transparency system.

The demo models Law 544/2001 requests as signed, trackable state transitions. It uses a local append-only hash-chain ledger rather than a production blockchain, so it can run as a static site under:

```txt
https://digital.cristian-nichifor.com/bureaucracy-as-code
```

## What it demonstrates

- DID-like browser identities for citizens and public servants.
- Verifiable credential-shaped role claims.
- Law 544 request states and allowed transitions.
- Cryptographically signed administrative actions.
- Tamper-evident local ledger with previous-state hashes.
- IndexedDB document storage and document hash verification.
- Public dashboard with anonymized request feed, audit trail, and machinery graph.
- Export and import of the whole demo state as JSON, refused unless the chain still verifies.

## What it does not do yet

- It does not integrate ROeID.
- It does not run a backend API.
- It does not run a real blockchain node.
- It does not store raw personal data on a ledger.
- It does not notice a chain truncated at its end. Dropping trailing events leaves a shorter,
  internally consistent chain; catching that needs an anchor the chain cannot supply itself —
  a published head, a countersignature, or an external timestamp.
- It does not check signatures while verifying the chain. Verification re-hashes each event and
  follows the links; `BrowserIdentityProvider.verifySignature` exists but is not yet on that path,
  so a forged event carrying a nonsense signature still passes `verifyChain`.
- It does not export signing keys. An imported state can be read and re-verified; new
  transitions are signed by the identities of the browser doing the importing. Writing a
  private key into a shareable JSON file is the habit this demo argues against.

Future ledger providers can implement the same interface as the browser `LocalLedgerProvider`.

## Local setup

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```

Cloudflare Pages notes are in [docs/cloudflare-pages.md](docs/cloudflare-pages.md).

## GitHub setup

After authenticating `gh`, publish the repo:

```bash
gh auth login -h github.com
gh repo create CristianNichifor/bureaucracy-as-code --public --source=. --remote=origin --push
```

Enable security features:

```bash
gh api -X PATCH repos/CristianNichifor/bureaucracy-as-code \
  -f has_issues=true \
  -f has_projects=false \
  -f has_wiki=false \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=true \
  -f delete_branch_on_merge=true

gh api -X PATCH repos/CristianNichifor/bureaucracy-as-code \
  -H "Accept: application/vnd.github+json" \
  -f security_and_analysis.secret_scanning.status=enabled \
  -f security_and_analysis.secret_scanning_push_protection.status=enabled \
  -f security_and_analysis.dependabot_security_updates.status=enabled
```

Add branch protection after the first push creates `main`:

```bash
gh api -X PUT repos/CristianNichifor/bureaucracy-as-code/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f enforce_admins=true \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="CI / build" \
  -f required_status_checks.contexts[]="CodeQL / analyze" \
  -f restrictions=
```

Do not auto-merge PRs.

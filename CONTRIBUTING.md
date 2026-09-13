# Contributing

This is currently a single-maintainer public demo repository.

## Development

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Pull Requests

- Open pull requests against `main`.
- Do not auto-merge pull requests.
- Keep changes scoped and documented.
- Use signed commits.
- Wait for required checks before merging.

`main` is protected with required CI, CodeQL, signed commits, admin
enforcement, and blocked force-push/delete. Required approving reviews are not
enabled while there is only one maintainer, because that would prevent the
maintainer from merging their own pull requests.

## Security

Do not commit secrets, private keys, real personal data, or live public
administration records. Demo fixtures should be fictional and privacy-safe.

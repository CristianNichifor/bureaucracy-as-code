# GitHub security setup

These settings require repository admin permissions. Run them after `gh auth login` and after the public repo exists.

```bash
gh repo create CristianNichifor/bureaucracy-as-code --public --source=. --remote=origin --push
```

Enable repository features:

```bash
gh api -X PATCH repos/CristianNichifor/bureaucracy-as-code \
  -f has_issues=true \
  -f has_projects=false \
  -f has_wiki=false \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=true \
  -f delete_branch_on_merge=true
```

Enable security and analysis:

```bash
gh api -X PATCH repos/CristianNichifor/bureaucracy-as-code \
  -H "Accept: application/vnd.github+json" \
  -f security_and_analysis.secret_scanning.status=enabled \
  -f security_and_analysis.secret_scanning_push_protection.status=enabled \
  -f security_and_analysis.dependabot_security_updates.status=enabled
```

Enable private vulnerability reporting:

```bash
gh api -X PUT repos/CristianNichifor/bureaucracy-as-code/private-vulnerability-reporting
```

Protect `main`:

```bash
gh api -X PUT repos/CristianNichifor/bureaucracy-as-code/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="CI / build" \
  -f required_status_checks.contexts[]="CodeQL / analyze" \
  -f restrictions=
```

Manual check in GitHub UI:

- Settings -> Code security and analysis -> Secret scanning: enabled.
- Settings -> Code security and analysis -> Push protection: enabled.
- Settings -> Code security and analysis -> Dependabot alerts: enabled.
- Settings -> Code security and analysis -> Dependabot security updates: enabled.
- Settings -> Branches -> `main` requires PR review and required checks.

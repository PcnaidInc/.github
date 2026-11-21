# org-github STATE — d377 L2-07 actions pinned (TL1 session a38262fb, 2026-11-21 05:50Z)

## Decisions
- Issue #11 filed and closed; PR #12 merged as 6108e780 at head 358f5a81. The four moving-tag `uses:` lines in dd-catalog-shared.yml and claude-code-review.yml are pinned to full SHAs with version comments.
- `sha_pinning_required=true` is set on this repo, read back after the change: enabled true, allowed_actions all, sha_pinning_required true.
- Nested uses were checked first: the datadog provider action is node20 with no nested uses, and claude-code-action's setup-bun is already SHA-pinned.

## Tried-Rejected
- The first arm run stopped because its brief asked for a HEAD check that the arm's working copy cannot do (no commit history). The brief was fixed and the second run applied the change.
- The review App got 403 on the permissions setting; the eng App set it.

## Open threads
1. The two pins in dd-catalog-shared.yml are not exercised by any run (workflow_call). Their SHAs were read from the GitHub API, not run.
2. workflow-templates contains a one-byte file literally named `*.yml`; it holds no actions and was left alone.

## Next step
0. None in this repo. Cross-repo work from this session is in the TL1 role STATE in the hq repo.

## Evidence
- Run 44867814110 (Claude Code Review on head 358f5a81): pinned checkout and claude-code-action steps succeeded; 0 review threads; verify grep `uses: [^.].*@(v[0-9]|main|master)` on main prints nothing.

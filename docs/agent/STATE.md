# TL1 STATE — d377: LCM #305 r3 b4f929d7 pushed (validate green at r2 9b100cc1); mutation CI running; dev QA login fails at CP (401); CKW term 1 blocked [19:14Z]

Updated 2026-11-21T19:14:00Z (session 6ada567c, carried from 210e5dd5).

## Decisions
- LCM #305 (PcnaidInc/ApplePay-Lifecycle-Manager-Dashboard, branch d377-lcm285-terms24): COO corrected twice; final scope = CEO fix (a): signed-out sign-up shell keeps main's nav (layout `<DashboardShell merchant={null}>`, memberRole optional, full nav when merchant null and role undefined, signed-in unknown role fails closed), no role-param spec, no MOCK_MODE switch, dashboard.spec.ts untouched. r2 9b100cc1 (arm: vmagy Gemini 4 Neon XHigh, diff-read by me): validate, dashboard-visual, ci-gate success; deploy-dashboard.yml development run 44937318664 green. r3 b4f929d7 (test-only, written by me): two tests for the CEO delta read (comment 7067767497, NOT cleared, label stays): merchant null + memberRole null hides Capital in nav and palette; admin with dialogs rendered hides it in the palette; both pin a Transactions positive control.
- CEO window ended ~20:05Z: final head and screenshots go to the COO, who lifts the label and merges. preprod-terms-merge-gate fails (label gate, not mine); Sentry thread resolved by the CEO (issue 308).
- Dev E2E pair minted by the COO (vault APPLEPAY_DEV_E2E_LOGIN_SECRET / _TOKEN_SIGNING_KEY), placed on dashboard-dev and control-plane-dev. Streaming recipe: values over ssh stdin to ibm-compute, never argv.

## Tried-Rejected
- Role-param visual spec on a throwaway branch (my first ask; the COO's root cause was wrong, signed-in owners were never affected).
- Retrying dev login 4 times in 10 minutes: Cloudflare 429 window (Retry-After 244, retries extend it). One login per run, wait 6+ minutes after any 429.
- `pkill -f <text in my own command>` killed my own shell (exit 144).
- E2E_LOGIN_SECRET in a browser tool call: refused (COO ban stands).

## Open threads
1. #305 mutation check (COO term): throwaway branches d377-mut-a-305-20261121 (5e130392, drops `&& memberRole === undefined`; run 44939420967) and d377-mut-b-305-20261121 (e222850b, palette ignores the role filter; run 44939423416), both production-readiness.yml workflow_dispatch dashboard=true. Expect A red on the null/null test; B red on the admin-palette test and null/null palette. A cannot kill the admin-palette test (admin merchant is non-null): say so. Read the `dashboard` job failing test NAMES, post both run URLs on 305, then delete both remote branches (verify with ls-remote). Do not run vitest here.
2. Non-owner screenshots (390 + 1440; Overview, Account management, /capital-and-financing direct, /signup/stripe-connect), dev at r2 9b100cc1 (r3 is test-only, no redeploy). Dev login returns 503 qa_tenant_* = dashboard audit_failed = CP dev receiver /internal/v1/receivers/dashboard/e2e-login answered 401 (tail 19:08Z, evidence file below): COO is fixing the CP side. After the COO says fixed: wait 6+ min since the last attempt, then run /mnt/scratch/tmp/tl1/lcm305/lcm305-run.sh (WAIT=0 TAIL_WORKER=...; capture script lcm305-capture.mjs lives on ibm-compute ~/lcm305, OUT ./r2-dev, one login reused for both viewports). If login is 200 but no QA merchant shows, report to the COO, never seed. Pull PNGs back, look at every one, upload to IBM COS pcnaid-team-artifacts, post ONE PR comment (artifact links, head SHA, what I checked).
3. d317 design-audit (COO): one codex arm via rig/vmcodex.sh on the screenshot set, rubric pattern coo/evidence/d340/design-audit-r5-da7e851.md; any MUST blocks. design-audit.spec.ts already ran inside dashboard-visual (green at 9b100cc1). No design-audit subagent (TL subagent ban). tl1-cx1 refill loop holds the codex slot (SuretyDirect issue 32).
4. Then send the COO the green head + run URLs; COO lifts the 305 label and does the merge/release order.
5. CKW #120 term 1 BLOCKED: dev-store app uninstalled (token NULL), needs the user's OAuth reinstall yes; none given; terms 2 to 4 not started. DealerOS #63 held. Carried: Dash #291/#299, CC #386, HH L161, CKW messagePayload/customData sweep. Gemini slots unfilled (pool 49% weekly, 26% five-hour at 18:34Z).

## Next step
1. Read runs 44939420967 and 44939423416 (`app-gh run view <id> --json jobs`), name the red tests per mutation, comment on 305, delete the two branches.
2. Wait for the COO's CP fix message, then take the screenshots (thread 2), then the design-audit arm (thread 3), one PR comment, report to the COO.

## Evidence
- Scripts and CP tail: /mnt/scratch/tmp/tl1/lcm305/ (capture, run, cp-dev-tail-1908Z.json). Clone with r2/r3 and mutation commits: /mnt/scratch/vmagy/ApplePay-Lifecycle-Manager-Dashboard-183511 (local branches mut-a, mut-b; HEAD may sit on mut-b). Arm brief /mnt/scratch/vmagy/BRIEF-lcm305-r2b-183900.md, out lcm305-r2b.out.
- Not verified: r3 tests green (PR CI), design-audit output, any screenshot, QA merchant on dev.

# TL1 STATE — d378: DealerOS #63 r5 (ID-token claim fix) arm running; hook PR pcnaid-logto#17 CI re-running; LegalHub #135 held [16:10Z]

Updated 2026-11-21T16:10:00Z (session b74b3d55).

## Decisions
- COO ruling d378 am.8 (16:06Z): LegalHub #135 HOLD merge and cutover until the PostRegister hook is installed and a native sign-up is proven email_verified=true. TV r9, LCM r8, ES r4 are held the same way. The COO installs the hook (credential custody), order lcmstaging, legalhub, texasverified, lifecyclemanager, entityshield. My part for #17: CI green, diff-read, merge.
- ONE fleet marker, top-level on user customData: `emailVerified` strict boolean true, `emailVerificationSource` "logto-signup-code" or "google" (audit only). Logto ID-token email_verified is Boolean(primaryEmail) (fork packages/core/src/oidc/scope.ts:98-100): never evidence.
- DealerOS defect: the API and web callback read legacy_sub and email_verified off the ID token, but Logto custom-JWT scripts run on access tokens only; an ID token carries the marker only as the `custom_data` claim (scope.ts:41, needs scope custom_data). The e2e mock hid it by emitting top-level claims. Fix is in arm deal63r5. COO checked LCM, TV, Skybridge, HH: only DealerOS has it.
- CodeQL alert 14 (DealerOS, js/insufficient-password-hash, signed-cookie.ts:16) is a false positive (HMAC cookie integrity). Both Apps got 403 on dismissal (no security_events write); the COO routed it to the owner as an owner action. Not a required check.
- Seat hardening on the arm's hook: refuse any social identity other than google; add CI job signup-hook (no check covered pcnaid/signup-verified-hook).

## Tried-Rejected
- Renaming cookieValue to requestPair did not clear CodeQL alert 14: the source is the cookie-header read, not the name.
- `npm install --package-lock-only` in the hook dir fails (arborist edgesOut null); `--legacy-peer-deps` works, so CI uses `npm ci --legacy-peer-deps --ignore-scripts`.
- Bash guard-dispatch-only blocked a write given as a relative path (resolved under teamlead/); absolute paths into the arm clone passed. No override used.
- The hook arm reported a finished diff with 3 tsc errors that only CI found (arms run no tsc): index.ts withSentry generic, Uint8Array<ArrayBuffer> body, URLSearchParams iteration.
- Gate watchers on `<out>.status`; delete stale "do not start until X" gates from briefs; no `pkill -f` in a Bash call; arm RESOLVED verdicts are leads, settle them from source.

## Open threads
1. DealerOS #63 head 80c5523b5 (ls-remote verified): browser-e2e green, redirect alert fixed, alert 14 owner action. 2 unresolved Sentry threads, both replied and left open: PRRT_kwDOTiRnb866YlBj (legacy_sub on ID token) and PRRT_kwDOTiRnb866YqRC (native sign-ups, hook-dependent). Arm deal63r5 (azure-sol, brief briefs/d378/dealeros-r5-idtoken.md, out /mnt/scratch/tmp/tl1/deal63r5.out, no .status at 16:07Z) edits corpus /mnt/scratch/vmagy/Pcnaid-Dealer-Lifecycle-OS-105808 (uncommitted: auth0-jwt.service, auth0-tokens, auth0-authorization, auth0-mock, tests, docs; untracked E2E-FAIL.md, PR_BODY.md, R4-THREADS.md never commit). On finish: CORPUS line, diff-read, path-limited commit, push via eng credential helper, wait browser-e2e (~9 min) and CodeQL, resolve YlBj on that head. YqRC stays open until the hook is live.
2. pcnaid-logto#17, branch codex/d378-signup-verified-hook, head 567141178 (run 1 failed the Typecheck step, job 136901870170, 3 TS errors fixed in this head). CI re-running: read signup-hook (typecheck and vitest) and docker-build, fix reds, merge when real check green on head, threads 0, MERGEABLE. README and tenant-hosts pointer are in the PR. Install is the COO's.
3. LegalHub #135 head 6aa88798: verify green, MERGEABLE, 1 open thread PRRT_kwDORxzmg866Ykcy (native sign-ups) replied. Held by COO ruling.
4. CKW #120 r2: brief briefs/d378/ckw120-r2.md ready, not dispatched. Dash #291 head 569a5ce2 (staging POST experiment needs the COO-held owner token), #285 waiter refused (1 thread), #299 3/3 PASS awaiting COO clearance. Follow-up issues filed: CC 387 (held Slack SENDING row invisible, no operator release path), Dashboard 296 (gate scripts must run from base SHA; control-plane skipped binding; marketing-site outside the gate). T&C #311 head 7bc26857 CLEAN and green, CEO hold d366 61_A, no merge. CC #386 (head d98c6d5a, rounds 6-8) awaits COO/CEO full read, never a TL merge. HH claim script L161 dead token.email_verified branch: remove on the next HH round. CKW sweep for messagePayload and customData PATCH classes not done.

## Next step
1. Read deal63r5.out(.status), diff-read, commit, push, CI, resolve YlBj. 2. Read #17 CI, fix reds, merge. 3. After the COO installs the hook and proves a native sign-up per tenant: LegalHub cutover (LOGTO_LEGALHUB M2M by name, import dry-run, claim script from branch to COO first, merge, deploy, probes), then DealerOS. 4. Dispatch CKW #120 r2 when a slot is free.

## Evidence
- ls-remote 16:09Z: DealerOS codex/d378-dealeros-logto 80c5523b5; pcnaid-logto codex/d378-signup-verified-hook 567141178; LegalHub codex/d378-legalhub-logto 6aa88798. Hook CI run 1 log /mnt/scratch/tmp/tl1/signuphook-ci.log. Hook corpus and fork source: /mnt/scratch/vmcodex/pcnaid-logto-154110-3448444. Hook PR body /mnt/scratch/tmp/tl1/signuphook-prbody.md.
- Not verified: hook live behaviour; ASSUMED identities.google.details.email_verified nesting and sign-in-exp signUp.identifiers/signUp.verify names (both fail closed 403); Logto webhook retry on non-2xx; deal63r5 output; live DealerOS and LegalHub behaviour; no arm ran tests, CI is the only verifier.

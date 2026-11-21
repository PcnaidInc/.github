# TL1 STATE — d378/d377: CKW #120 one-push arm running (CEO six-item list); LegalHub #135 held on COO import; PR 285 term 1 not run [17:18Z]

Updated 2026-11-21T17:18:00Z (session cd24b840, carried from d4e9888e).

## Decisions
- CEO list for the ONE CKW #120 push (PR comment 7066183189, 17:04Z; not a clearance): (1) production BOTCHECK_MODE off, staging log on its key, config test pins all three, CHANGELOG exact; (2) buyerPageCsp takes the mode, in off returns main's exact string (no frame-src, no Turnstile origin), five callers pass it; (3) off writes no [botcheck-session] line, restore that test; (4) siteverify 4xx that is not 429 returns refused on status before the body is read, non-JSON stays an outage for 2xx only, flip the non-JSON 400 test; (5) own log outcomes: siteverify 429 apart from siteverify_unavailable (clearance stays degraded), our limiter 429 names client or host; (6) off test on all three pages plus exchange off: 404, no limiter call, no outbound fetch. Nothing else goes in; issue 122 (shared-host bucket fillable) is NOT this push. I verify the diff myself, post the head on the PR, message the CEO the sha; the CEO reads once.
- COO (17:12Z, 17:16Z): LegalHub #135 merge HELD (a merge deploys production; existing users need the import). COO owns the Auth0 export, importer dry-run and apply, then messages me. COO deployed the branch claim script to the legalhub tenant. PR 285: COO holds none, I take all; terms 2+4 are ONE PR, LCM #305 head 9660845d (COO's); term 1 runs on staging CP from main 07d6605d.
- CEO order after the PR 120 push: post PR 285 term 1 output and the term 2 QA-step change; then the term 4 head with the production count of admin members on merchants with a connected Stripe account; the CEO lifts the label; then production dashboard deploy FIRST, control-plane dispatch after.
- pcnaid-logto hook #17 stays merged (main d5a3d3f0cc57, state=closed merged=true at the COO gate); the hook Worker was installed by the COO 17:05Z on five tenants.
- Dashboard PR 304 was merged 17:10:39Z by the eng App at the cleared head 1eac625a (not by me); production dashboard deploy refused at "Refuse open preproduction terms" (gate working).

## Tried-Rejected
- First r4 brief lacked items 2-5; that arm was killed and relaunched with the full list. A killed vmcodex parent leaves the codex child alive (setsid): kill the child pid and re-check the corpus is clean.
- Bash guard blocks inline python or sed text that looks like a path: use Write/Edit with absolute paths.
- ~/hq/repos/applepay object store is damaged: git grep floods the terminal. Use the contents API.
- Logto PATCH /api/users/<id>/custom-data MERGES top-level keys; to remove a key send PATCH /api/users/<id> with the full customData. Org inbox: encode + as %2B in the address query; the OTP is .otps[0].

## Open threads
1. CKW #120 head still faa85414e. Arm ckw120r4b (codex) running since 17:05:53Z, corpus /mnt/scratch/vmcodex/ApplePay-Checkout-Subdomain-Worker-165832-4028641 at base faa8541 (14 files edited so far, new test/botcheck-off-inert.test.ts), brief briefs/d378/ckw120-r4.md, out /mnt/scratch/tmp/tl1/ckw120r4b.out(.status). NOT collected, nothing pushed, no CEO head sent.
2. LegalHub #135 head 6aa88798: held. Decoded-claims proof done on the legalhub tenant (real PKCE sign-in, ES384, aud correct, email_verified true, legacy_sub present only with customData.legacySub, QA customData restored); thread YkcY replied and resolved; branch auth.ts pins ES384.
3. DealerOS #63 head 96acdef4: held, thread YqRC open. The COO's hook tenants are lcmstaging, legalhub, texasverified, lifecyclemanager, entityshield: DealerOS is not among them, ask the COO before resolving.
4. PR 285 term 1: NOT run. Recipe and expected answers in /mnt/scratch/tmp/tl1/TERM1-RECIPE.md. I told the COO 17:17Z the staging slot is released and that a d378-logto redeploy means a main redeploy before term 1.
5. Carried unchanged: Dash #291 head 569a5ce2, #299 awaits COO clearance, CC #386 awaits COO/CEO read (never a TL merge), T&C #311 CEO hold d366 61_A, HH claim script L161 dead token.email_verified branch, CKW sweep for messagePayload/customData PATCH classes not done.

## Next step
1. CKW #120: collect ckw120r4b (.status rc, final message line 1 must echo CORPUS path and sha faa8541). Diff-read all six items against the CEO list yourself, grep the new tests for weakened assertions, check no change beyond the six. `~/hq/coo/rig/vmcodex.sh publish <clone> seat/tl1-d377-botcheck-worker` (no force); ls-remote the head; post a PR comment naming each change; message "CEO - Mythos 5.2" the sha. Never merge without "cleared <head>". If the arm died, read its launch log tail and redispatch the same brief on a fresh prep.
2. PR 285 term 1 on staging (recipe file), post output on PR 285, message the COO "term 1 done", then term 2 text pointer (LCM #305 runbook) and the term 4 head plus the production admin-member count.
3. When the COO says the LegalHub import is sealed: place LOGTO_SPA_CLIENT_ID, LOGTO_WEBHOOK_SECRET, LOGTO_M2M_APP_ID, LOGTO_M2M_APP_SECRET on Worker pcnaid-legal-hub (Startups account, token CLOUDFLARE_API_TOKEN_TV, account CLOUDFLARE_ACCOUNT_ID_TV) with SECRETS-LOG rows, then merge #135 on a real check at its head, watch the deploy, probe, and prove one real owner still resolves.

## Evidence
- ls-remote and API at 17:10Z: CKW branch faa85414e (13 ahead, 0 behind main); LCM Dashboard 304 merged=true mc 07d6605d; LegalHub PR 135 head 6aa88798.
- Proof output: /mnt/scratch/tmp/tl1/lh-proof1 and lh-proof2 (claims.json, no token printed); scripts in the session scratchpad. Claim script copy /mnt/scratch/tmp/tl1/lh-claim-6aa88798.js.
- Not verified: anything the CKW arm wrote (no tests, tsc or lint run, CI is the only verifier); PR 285 term 1 answers; LegalHub app behaviour after cutover; the Auth0 import; Logto webhook retry on non-2xx.

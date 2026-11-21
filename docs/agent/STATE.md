# org-github STATE — d377/d378: HH + Skybridge LIVE; DealerOS #63 + LegalHub #135 CI pending; sign-up hook queued; detail in ~/hq/teamlead/docs/agent/STATE.md (TL1 session c990e5a8) [14:36Z]

Updated 2026-11-21T14:36:00Z (session c990e5a8).

## Decisions
- COO order: d378 first; QA (d381) is the COO's and runs on the cut-over live apps. After each T head is green + threads 0 the SEAT does cutover (vars/secrets by name, import dry-run then apply, merge, deploy, probes) and sends "<App> live". HH and Skybridge done.
- Claim scripts are MARKER-ONLY (customData.emailVerified === true, no emailVerificationSource requirement, no token.email_verified fallback); legacy_sub from customData.legacySub; first-login rebind matches the legacy subject only, never email. COO installs the claim script on the tenant from the branch copy BEFORE the seat merges (HH 13:41Z, Skybridge 14:25Z).
- VM-PRESSURE SET 14:11Z: no new VM-local arms. ibmagy sub E walled (0% Gemini + Claude/GPT pools to 11-26/11-28). Seat wrote the Skybridge T fix itself.
- New COO assignment 13:40Z (queued): shared Cloudflare Worker for Logto PostRegister -> writes customData {emailVerified:true, emailVerificationSource:"logto-signup-code"|"google"}; brief ready briefs/d378/signup-hook.md (lives in PcnaidInc/pcnaid-logto under pcnaid/signup-verified-hook/). Needs an off-VM arm or a freed VM slot.

## Tried-Rejected
- Waiting on `<tag>.status`: vmcodex writes `<out>.status` (deal63t.out.status); my first watcher polled the wrong name. Gate watchers on the out-file name.
- Brief text "do not start until X .status exists" blocked skybridge-t (arm obeyed a stale note and ran nothing). Delete stale gates from briefs before dispatch.
- `pkill -f <script>` in a Bash call killed my own shell (exit 144): use pgrep + kill by pid.
- Logto token-exchange for the SPA app is disabled: no minted-token proof; the COO set a password on the QA migrated user instead.
- ibmagy / Flash off-VM: walled.

## Open threads
1. DealerOS #63 head c4a009a9 (T fix, pushed 13:5xZ): component web/config/db/api green, `browser-e2e` in_progress >35 min, CodeScene (non-required) red, 0 unresolved threads on a paginated read (11 total), residual in PR body. Then: add test user, import (needs LOGTO_DEALEROS_M2M_CLIENT_ID/_SECRET in vault, Auth0 export), merge, deploy, probes, "DealerOS live". Thread 66WVdO (messagePayload echo) resolved but live-Logto behaviour unverified.
2. LegalHub #135 head 0cffbc10 (r2 + T round collected from arm lh135r2t, claim script made marker-only by me): `verify` pending, 13 unresolved threads (r2 round claims to address them: resolve via /mnt/scratch/tmp/tl1/resolve-threads.sh PcnaidInc Pcnaid_legal_hub 135 <sha> ONLY after verify is green and diff-read), residual in PR body. Vault has LOGTO_LEGALHUB_M2M_APP_ID/_SECRET/_MGMT_API_RESOURCE. Then cutover as above. 37 files +1761/-706: arm reported no tests run.
3. Skybridge #47 MERGED 33ff11de, Deploy 44914000462 green, probes ok (401 unauth, /auth/login -> skybridge.auth.pndsvcs.com). Awaiting COO d381; legacy_sub rebind on a migrated Google user's login not yet proven (R2 mailboxes/*.json ownerSub flips from auth0|... to the Logto sub). 3 users imported with legacySub; 1 Auth0 password dup (badran.abdul@, no mailbox) failed 422 email_in_use, harmless.
4. HH #230 MERGED 01d8a5c4, closed: legacy_sub proven (householdos_users id auth0:auth0|6a5f… subject -> 19dheb9j1j1u, provider logto, no duplicate row).
5. CKW #120 head 56ff91f0: 1 thread (429 in exchange() locks Apple Pay), brief briefs/d378/ckw120-r2.md, not dispatched.
6. Dash #291 head 569a5ce2 (staging POST experiment needs COO-held owner token), #285 waiter refused (1 thread), #299 3/3 PASS awaiting COO clearance, CC #386 awaits COO read.
8. Follow-up issues: CC 387 (held Slack SENDING row invisible, no operator release path), Dashboard 296 (gate scripts must run from base SHA; control-plane skipped binding; marketing-site outside the gate). T&C #311 head 7bc26857 CLEAN and green, CEO hold d366 61_A, no merge. CC #386 (head d98c6d5a, rounds 6-8) awaits COO/CEO full read, never a TL merge.
7. Sentry class to sweep in other Logto PRs: onboarding/provisioning code that PATCHes /api/users/{id} with customData replaces the whole object (found in Skybridge; fixed with /custom-data). Grep DealerOS/LegalHub/CKW for it.

## Next step
1. Read DealerOS #63 browser-e2e (job log, not the badge); if red read the log, if green run cutover (needs LOGTO_DEALEROS M2M by name; claim script from branch to COO first). 2. LegalHub #135: wait for `verify`, diff-read identity-link + staff changes, resolve threads, send COO the claim script (docs/logto-custom-jwt-claims.js) to install, then cutover. 3. Grep for the customData-overwrite bug in DealerOS/LegalHub. 4. Dispatch signup-hook off-VM when a slot exists; ckw120-r2; Dash items.

## Evidence
- ls-remote heads: HH main 01d8a5c4 (merged), Skybridge main 33ff11de (merged), DealerOS codex/d378-dealeros-logto c4a009a9, LegalHub codex/d378-legalhub-logto 0cffbc10.
- HH: Worker householdos (Startups acct) secrets OIDC_TX_SECRET + TURNSTILE_SECRET_KEY present by name; repo var VITE_TURNSTILE_SITE_KEY set; ci.yml passes it; live bundle carries the key. Import 11 created/0 failed, 12 users, 11 legacySub = Auth0 ids. SECRETS-LOG rows written for every placement/read.
- Not verified: Skybridge real sign-in and mailbox rebind; any Turnstile sitekey/hostname pairing; DealerOS/LegalHub live behaviour; no arm ran tests (CI is the only verifier). Import PII files shredded/removed from /mnt/scratch/tmp/tl1 (sky-*.json removed with rm, not shred).

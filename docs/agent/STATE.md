# org-github STATE — d377/d378: Dashboard #299/#285/#291, CKW #120, d378 Logto PRs #230/#63 in flight; detail in ~/hq/teamlead/docs/agent/STATE.md (TL1 session e2a8d4a7) [11:35Z]

## Decisions
- Dashboard #299 (#289): head 4ebde774 pre-charge cross-shop refusal + post-charge backstop; control-plane green on the earlier head; Sentry thread answered. No merge before COO clearance and green on 4ebde774.
- d378 Logto PRs, arm output diff-read, audience corrected to the COO's registered resources: HouseholdOS #230 (head ea2610f; fixed RLS orphan-account bug under system authority, typecheck .d.mts, jwks test assertion), DealerOS #63 (head db96cb0; auth0.test path fix). Neither has a sign-in proof; do not merge before a real sign-in with claims decoded. Proof user: Logto Mgmt API (COO offers to mint).
- CKW #120 arm (CEO rulings a-d) committed 9bdd4a1e on seat/tl1-d377-botcheck-worker via eng App helper (vmcodex publish refuses non-16). Namespace ids 7203x-7206x follow the repo convention.
- Dashboard #285: CEO cleared a merge-main update; GitHub update-branch merge commit gave head 7b776e79 (no conflict, nothing edited); CEO told. Required check preprod-terms-merge-gate never reported on the old head (workflow postdates the branch).
- Quota: ibm-compute sub E Gemini is 0% weekly (reset ~167h) despite COO's "100%"; VM Gemini 4 Argon is 0% weekly, 3.8 Flash group still ~81%.

- MERGED earlier (state re-read after each call): Dashboard #295 93d71240, #294 e7ad9078, test PR 297 6d19898c; CC #385 294da950.
- Preprod-terms proof term on both workflows complete, posted at Dashboard #294 comment 7060084514: refused dispatches 44885640126 + 44885642575, passing dispatches 44885740894 + 44885743305 at 6d19898c, gate-red PR 298 run 44886002378 (closed, branch deleted). COO made preprod-terms-merge-gate a required check; enforce_admins ON 08:29Z. Control-plane prod refusal proof on issue 281 (comment 7059505061); COO unbound prod E2E secrets 07:50:21Z.

## Tried-Rejected
- ibmagy.sh with "Gemini 4 Argon (High)" is refused on ibm-compute; Flash runs died on quota (rc=3).
- Legalhub VM arm exited rc=3 with an empty out after ~43 edits: committed as WIP 057dba1 on codex/d378-legalhub-logto, continuation arms now running on VM Flash.
- pkill -f of a watcher kills the Bash chain; guard-dispatch-only blocks variable paths (use literals).
- vmcodex prep clone-dir glob (newest dir) picked another seat's clone; pick by branch.
- `gh pr edit --remove-label` fails: use REST DELETE on the label. BACKFILL-TL1-20261117 is stale; team-ops #288 belongs to TL2 (COO ack), not dispatched.

## Open threads
1. 285: CEO cleared head 7b776e794d18 (comment 7061993132). Detached waiter /mnt/scratch/tmp/tl1/merge285.sh merges at that head when required checks + control-plane are green and 0 threads; READ /mnt/scratch/tmp/tl1/merge285.result and re-read state/mergeCommit from GitHub before trusting it; label stays on; if the gate refuses over the label, tell the CEO. Then terms 1-5 of the CEO's note (staging proof, E2E owner-only asserts, ONE control-plane PR: server-set disable_stripe_user_authentication for non-owners + test with body true, account_onboarding in ownerOnlyConnectComponents + admin 403 test, dashboard hide change); post the new PR number on 285.
2. #291 (56d7c03a, seat/tl1-d377-botcheck-sync): arm dash291 running in /mnt/scratch/vmcodex/ApplePay-Lifecycle-Manager-Dashboard-111121-4087837 (out /mnt/scratch/tmp/tl1/dash291.out.status); diff-read for PR 287 files (team.ts, team.test.ts, 064_merchant_invitation_caps.sql) before pushing; then the one staging POST for 291(b); migration renumber only when 287 merges first. CEO reads final heads.
3. d378 continuations on VM Flash: legalhub (/mnt/scratch/vmagy/Pcnaid_legal_hub-105807, out d378c-legalhub.out) and skybridge (/mnt/scratch/vmagy/skybridge-inbox-110242, WIP 34dcd1c, out d378c-skybridge.out): diff-read, fix to the COO audiences (legalhub https://app.legalhub.pndsvcs.com/api, skybridge https://portal.skybridgelog.com/api), push via eng helper, open PRs (issues Pcnaid_legal_hub#134, skybridge-inbox#46).
4. CI on #230/#63/#120/#299 not yet read after the last pushes; CC #386 awaits COO read (CodeScene red unread).
5. Follow-up issues: CC 387 (held Slack SENDING row invisible, no operator release path), Dashboard 296 (gate scripts must run from base SHA; control-plane skipped binding; marketing-site outside the gate). T&C #311 head 7bc26857 CLEAN and green, CEO hold d366 61_A, no merge. CC #386 (head d98c6d5a, rounds 6-8) awaits COO/CEO full read, never a TL merge.

## Next step
1. Read CI for #230 (ea2610f), #63 (db96cb0), #120 (9bdd4a1e), #299 (4ebde774); fix reds. 2. Collect dash291 and the two d378 continuations (status files above). 3. Merge #285 once the CEO comment and green checks land, then the terms 3+5 PR.

## Evidence
- Briefs ~/hq/teamlead/briefs/{d377-ckw120-ceo-rulings,d377-dash291-ceo-rulings,d377-dash289-precharge-guard}.md, d378/*.md incl. *-continue.md. Clones: /mnt/scratch/vmagy/{HouseholdOS-105805,Pcnaid-Dealer-Lifecycle-OS-105808,Pcnaid_legal_hub-105807,skybridge-inbox-110242}, /mnt/scratch/vmcodex/ApplePay-Checkout-Subdomain-Worker-110927-3920174, ...Dashboard-105054-2701969 (#299). PRs: Dashboard #299 #285 #291, HouseholdOS #230, DealerOS #63, Checkout-Worker #120.

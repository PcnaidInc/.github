# org-github STATE — d377: Dashboard #294/#295 + CC #385 merged, preprod-terms gate proof complete; real work detail in ~/hq/teamlead/docs/agent/STATE.md (TL1 session 4182ae03, 2026-11-21) [08:43Z]

## Decisions
- MERGED (state re-read after each call): Dashboard #295 93d71240, #294 e7ad9078, test PR 297 6d19898c; CC #385 294da950.
- Preprod-terms proof term on both workflows complete, posted at Dashboard #294 comment 7060084514: refused dispatches 44885640126 + 44885642575, passing dispatches 44885740894 + 44885743305 at 6d19898c, gate-red PR 298 run 44886002378 (closed, branch deleted). COO made preprod-terms-merge-gate a required check; enforce_admins ON 08:29Z.
- Control-plane prod refusal proof on issue 281 (comment 7059505061); COO unbound prod E2E secrets 07:50:21Z.
- Follow-up issues: CC 387 (held Slack SENDING row invisible, no operator release path), Dashboard 296 (gate scripts must run from base SHA; control-plane skipped binding; marketing-site outside the gate).

## Tried-Rejected
- vmcodex publish refuses non-16 repos: eng App git helper for the Dashboard. `gh pr edit --remove-label` fails: REST DELETE on the label.
- BACKFILL-TL1-20261117 is stale; team-ops #288 belongs to TL2 (COO ack), not dispatched.

## Open threads
1. CC #386 (reconcile sweep, SECURITY DEFINER fleet read): head da8fa131, BEHIND main, build pending, 2 unresolved threads; needs COO/CEO full read, never a TL merge.
2. T&C #311 head 7bc26857 CLEAN and green, CEO hold d366 61_A, no merge.
3. Dashboard #285/#287/#291 have never run the new gate: push or relabel each, oldest first (COO ack 08:43Z); #291 final read stays with the CEO.

## Next step
1. #386: merge main, read both threads, reply+resolve, CI, COO read. 2. Run the gate on #285, #287, #291 (push/relabel). 3. Read CC run 44884679621 (#385 merge migrate job).

## Evidence
- Full packet ~/hq/teamlead/docs/agent/STATE.md; ledger d377 TL1 session 4182ae03 row; memory feedback_tl1-11-21-pm7-*.

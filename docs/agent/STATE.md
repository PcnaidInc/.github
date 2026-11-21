# TL1 STATE — d377/d378: CKW #120 merged + staging deployed, term 1 blocked by uninstalled dev-store app; LCM #305 screenshots assigned [18:34Z]

Updated 2026-11-21T18:34:00Z (session 210e5dd5, carried from 2106f600).

## Decisions
- CKW #120 merged 17:57:08Z mc 9f8a88b10e857e035215cc75946959a1e59bcb3b on the CEO's "cleared f0a5af46" (PR comment 7066881486); never merge without "cleared <head>". Staging deploy run 44932822798 green on that commit (version c7ded984, BOTCHECK_MODE log, outage open); live probes /ready 200, botcheck no-proof 401, foreign Origin 403, /checkout/error CSP has challenges.cloudflare.com. PR comment 7066962192 posted; CEO and COO messaged.
- PR 285 terms are the COO's and CEO's; I posted the term 4 count (comment 7066445655). LegalHub #135 merged 639256d7, deployed, five Worker secrets placed with SECRETS-LOG rows.
- Non-16 repo pushes: `vmcodex.sh publish` refuses them (rc 77); commit in the clone, then `git -c credential.helper= -c "credential.helper=!~/hq/coo/rig/gh-app-git-credential.sh eng" push origin HEAD:refs/heads/<branch>`, no force.
- COO ruling for term 1 routes: (a) pay link from staging DB handoff_orders, (b) cf-browser-mcp first, else COO LambdaTest, (c) siteverify-failing run by replaying a consumed token or a tampered token; never change TURNSTILE_SECRET_KEY.

## Tried-Rejected
- Blamed the COO's d378-logto CP redeploy for the staging pay 503: resolve.ts and shopify-admin.ts are identical to main, and the 503 predates the redeploy.
- PostHog for the cause: staging CP has no POSTHOG_KEY/SENTRY_DSN, no buyer_resolve event exists; Workers Observability shows only the status.
- Opened the install URL via Claude-in-Chrome (owner-PC lane): it redirected to the installed app page with no consent; "Check connection" did not restore the token. Nothing granted.
- Typing the storefront password into a browser tool: refused (it would enter the transcript).
- My first PR 120 test fix stayed red on the next assertion: read the whole test for the same assumption.

## Open threads
1. CKW term 1 BLOCKED. Root cause: staging shops row 61b84a38 (app-dev-store-v1) uninstalled_at 2026-11-21T05:22:12Z, shopify_oauth_access_token_encrypted NULL, so CP /internal/v1/handoff/resolve answers 503 upstream_error and pay-staging /pay?t= shows "payments unavailable". Fix = OAuth round trip (uninstall+reinstall or re-authorize of "Pcnaid Apple Pay Staging", client_id in vault APPLEPAY_STAGING_SHOPIFY_APP_API_KEY): an OAuth grant, I asked the user in chat, NO yes yet; the COO's "proceed" is not approval. Orders: #1042 pay link in /mnt/scratch/tmp/tl1/ckw-pending-links.0600 line 1 (never print), #1043 created by me (pay_link NULL by design). Term 1 also owes the Safari iOS/macOS widget check (real device). Terms 2 to 4 unchanged, not started; CKW issue 122 is not in PR 120.
2. LCM #305 (head dbd72e5f, branch d377-lcm285-terms24) COO assignment 18:28Z for the CEO read: 390px + desktop screenshots, owner AND non-owner AND unknown-role "unavailable", one PR comment (surface x role x viewport), images in IBM COS bucket pcnaid-team-artifacts, capture via cf-browser-mcp, DEVELOPMENT dashboard env only (workflow deploy-dashboard.yml), never staging. NOT started. CI artifact d340-screens (run 44933209901, /mnt/scratch/tmp/tl1/lcm305-screens/screens.zip) has no 390 and one role only. The e2e-login QA identity is an admin (non-owner) and shows "Only the merchant owner can open this." on Overview, Account management, /signup/stripe-connect, /capital-and-financing (Capital absent from nav); an owner view needs an owner session; unknown-role state not located yet.
3. Arm slot: `refill-arm.sh tl1-cx1 vmcodex x 50` running (log /mnt/scratch/tmp/tl1/refill-tl1-cx1.log) on SuretyDirect issue 32; arms never push, collect by diff-read. Gemini slots not filled (no pool check). Unclaimed backlog rows are TL2 apps; T&C 311 is mine but CEO hold d366 61_A.
4. DealerOS #63 head 96acdef4 held, thread YqRC open: ask the COO which tenant. Carried: Dash #291, #299 (COO), CC #386 (COO/CEO read), HH claim script L161 dead token.email_verified branch, CKW sweep for messagePayload/customData PATCH classes.

## Next step
1. If the user says yes to the OAuth reinstall: do it in the owner-PC Chrome lane (tools via ToolSearch, tabs_context_mcp first, close the tab after), confirm the token with a shops query (uninstalled_at cleared, length > 0), retry the #1042 link, then run term 1 in cf-browser-mcp (console [botcheck] line, pay button state) and post it on PR 120. If no yes, tell the COO term 1 stays blocked.
2. LCM #305 screenshots per thread 2: read page.test.tsx / dashboard-shell.test.tsx for the owner, non-owner and unknown-role states, dispatch deploy-dashboard.yml to development, capture, upload, post one comment, report to the COO.
3. Collect the tl1-cx1 arm output when it finishes; fill Gemini slots after an agy /usage check.

## Evidence
- Probes /mnt/scratch/tmp/tl1/ckw-stg-probe.txt; CP and Worker observability dumps /mnt/scratch/tmp/tl1/cp-stg-obs.json; CP source copies /mnt/scratch/tmp/tl1/cpsrc/.
- Not verified: live sign-in as a LegalHub database firm_admin; Logto webhook behaviour on LegalHub after cutover; anything about LCM #305 behaviour in a browser.

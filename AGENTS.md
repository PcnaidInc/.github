# Repository guidance

This repository contains organization defaults, conventions and GitHub Actions workflows.
The executable application code is the screenshot tool in `app-home-screens/`.

- Read `app-home-screens/app-home-screens.mjs` and
  `.github/workflows/app-home-screens.yml` together before changing screenshot behavior.
  The workflow uses Ubuntu 24.04 and Node.js 22; the manifest and lockfile pin Playwright 1.63.0.
- Keep `README.md` and `docs/app-home-screens.md` aligned with workflow inputs, secrets,
  runner/action versions, route selection, readiness checks and output behavior.
  The guide records the configuration changes since documentation commit `b777d5b`.
- Screenshot callers must use `workflow_dispatch` only. Store, tester and inbox identifiers
  belong in the private caller's variables; credentials belong in its secrets.
  Preserve the existing sign-in handling, error detection and phone emulation description.
- `.github/workflows/dd-catalog-shared.yml` publishes the caller's Datadog metadata.
  `.github/workflows/claude-code-review.yml` runs on opened/synchronized pull requests;
  its prompt references a `CLAUDE.md` that is absent from this clone.
- `.github/dependabot.yml` configures weekly Monday updates and ignores major versions.
  Its GitHub Actions group covers minor/patch releases; its npm directory list does not
  include `/app-home-screens`, so do not claim that it updates the tool's dependencies.
- `docs/conventions/README.md` indexes organization standards. Their example schemas,
  routes and environment modules are not implementations in this repository.
- `app-home-screens/package.json` declares no build, test or lint scripts. Describe only
  checks actually performed; do not claim that Claude review runs a test suite.
  No checked-in workflow defines an application deployment job.

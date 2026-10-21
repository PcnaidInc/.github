# PcnaidInc/.github

Organization defaults and shared, reusable workflows.

| workflow | purpose |
|---|---|
| `.github/workflows/app-home-screens.yml` | Signed-in full-page App Home screenshots, desktop + phone ([docs](docs/app-home-screens.md)) |
| `.github/workflows/dd-catalog-shared.yml` | Datadog service-catalog metadata |
| `.github/workflows/claude-code-review.yml` | Claude Code review |

App Home screens and Datadog expose `workflow_call`; Claude review runs on pull requests
when opened or synchronized. These workflows define no application deployment job.

App Home screens uses Ubuntu 24.04, Node.js 22 and Playwright 1.63.0. Call it from
`workflow_dispatch` with the private caller's store, tester and secrets. See the
[screenshot guide](docs/app-home-screens.md) for inputs, pinned action versions, output
and the commit history behind the current configuration.

The Datadog workflow reads `service.datadog.yaml` from the caller checkout and requires
`DD_API_KEY` and `DD_APP_KEY`. Claude review requires `ANTHROPIC_API_KEY` and declares
`contents: read`, `pull-requests: write`, `issues: write` and `id-token: write` permissions.
Its prompt references `CLAUDE.md`; this clone does not contain that file.

[Organization conventions](docs/conventions/README.md) cover URLs, configuration and
database design. [Agent guidance](AGENTS.md) maps this repository's implementation and docs.

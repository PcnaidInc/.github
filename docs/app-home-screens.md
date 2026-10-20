# App Home screens — reusable workflow (PCNSF-144)

`.github/workflows/app-home-screens.yml` takes signed-in, full-page screenshots of a Shopify
app's App Home pages at desktop (1440 px) and phone (390 px, iPhone 14 descriptor) width. It runs
inside the real admin iframe. Any app repo can call it. The code is `app-home-screens/`.

## Workflow runtime

| setting | current value |
|---|---|
| Runner / job timeout | `ubuntu-24.04` / 30 minutes |
| Node.js / Playwright | `22` / `1.63.0` (manifest and lockfile) |
| SHA-pinned actions | checkout `v7.0.1`, setup-node `v7.1.0`, upload-artifact `v7.0.2` |
| Artifact / retention | `app-home-screens-${{ github.run_id }}` / 14 days |
| Workflow permissions | `contents: read` |

The workflow checks out the caller into `app/` and this repository into `tool/`, installs
the tool's locked dependencies, and installs Chromium with OS dependencies for `grid: local`.
The tool checkout has no `ref`, so it uses this repository's default branch even if the
caller pins the reusable workflow to another ref. BrowserStack connects to remote Chrome.

## Call it from an app repo

```yaml
name: App Home screens
on:
  workflow_dispatch:
    inputs:
      grid: { type: choice, options: [local, browserstack], default: local }
      routes: { type: string, default: '' }
jobs:
  screens:
    uses: PcnaidInc/.github/.github/workflows/app-home-screens.yml@main
    with:
      grid: ${{ inputs.grid }}
      routes: ${{ inputs.routes }}
      store: ${{ vars.SHOPIFY_E2E_STORE }}
      tester_email: ${{ vars.SHOPIFY_E2E_TESTER_EMAIL }}
      inbox_url: ${{ vars.ORG_INBOX_URL }}
      # app_toml: apps/<name>/shopify.app.toml   # monorepos
      # routes_dir: apps/<name>/app/routes        # Remix app not at the root
    secrets: inherit
```

**Trigger it from `workflow_dispatch` only.** A `pull_request` trigger would expose the tester
secret to an untrusted branch.

The caller repo needs these:

| name | kind |
|---|---|
| `SHOPIFY_E2E_STORE`, `SHOPIFY_E2E_TESTER_EMAIL` | repo variables, required |
| `ORG_INBOX_URL` | repo variable, optional; pair with `ORG_INBOX_API_TOKEN` for code reading |
| `SHOPIFY_E2E_TESTER_PASSWORD` | secret |
| `ORG_INBOX_API_TOKEN` | secret, optional; code reading requires both inbox settings |
| `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` | secrets, only for `grid: browserstack` |

This repo is public, so identifiers of the store, tester or inbox never live here. The private
caller passes them in.

## Behaviour

- **Pages**: `routes` if given. Otherwise the Remix flat-route files in `routes_dir`, skipping
  `$id`, `foo_`, `*.export`, `*.confirmed` and action-only files with no default export (they have
  no page). With no routes directory, it captures the App Home root, then every page the app's own
  admin sidebar links to. Links to other apps in the same sidebar are ignored.
- **URL**: `admin.shopify.com/store/<store>/apps/<client_id><path>`. The `client_id` comes from
  `app_toml` when supplied, otherwise root `shopify.app.toml`, otherwise the sole root
  `shopify.app.*.toml`. With zero or multiple fallback files, set `app_toml` explicitly.
- **Full page**: the admin scrolls its own container, so the job grows the viewport to the
  iframe's content height plus its offset and padding, capped at 12,000 px, before capture.
- **Sign-in**: only the job types the password. It is never logged, traced or uploaded. A
  new-device code is read from the org test inbox when both inbox settings are supplied.
  Sign-in failures log the host/path and page title and attempt to save `login-failed.png`.
- **Phone profile** is Chromium mobile emulation (iPhone 14 descriptor: 390 px, touch, mobile UA),
  not a real device. With `grid: browserstack` it is still emulation, on a recorded remote desktop
  Chrome.
- **Error pages**: a page passes when `s-page` or a Polaris layout renders, which covers short
  empty states. A plain-HTML app passes when `main`, `h1` or `ui-title-bar` renders with more than
  40 characters of text. A page fails if the frame shows an application error, 404 or "no page at
  this address".
- **Bot checks**: a Cloudflare "Just a moment" title on arrival, or a detected captcha iframe
  during the post-password wait, stops sign-in with `LOGIN-BOT-CHECK` and `login-bot-check.png`.
  The job does not solve these challenges. The runner is fixed to `ubuntu-24.04`; there is no
  input for selecting a different runner.
- **Result**: PNGs, `summary.md` and `results.json`, plus a step summary. Summary and artifact
  upload steps use `always()`, but setup failures before browser launch can leave no report.
  Exit code `1` means a failed page or horizontal overflow. Failures caught by the main run
  handler, including sign-in failures, use `2`. Route failures attempt an error screenshot
  and do not stop subsequent routes.

## Configuration history

The last documentation change before this refresh was `b777d5b` (PR #5), covering page
readiness, action-only route exclusion and sidebar discovery. Two commits followed on `main`:

- `8c5dda8` (PR #6) updated setup-node `7.0.0` → `7.1.0` and upload-artifact `7.0.1` → `7.0.2`.
  It also added `id-token: write` to Claude review so its action can mint an OIDC token.
- `a67d5fb` (PR #7) pinned the screenshot runner from `ubuntu-latest` to `ubuntu-24.04`.
  Its commit message cites Playwright support as the reason. Other workflow runners remain
  `ubuntu-latest`.

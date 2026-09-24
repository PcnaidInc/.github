# App Home screens — reusable workflow (PCNSF-144)

`.github/workflows/app-home-screens.yml` takes signed-in, full-page screenshots of a Shopify
app's App Home pages at desktop (1440 px) and phone (390 px, iPhone 14 descriptor) width. It runs
inside the real admin iframe. Any app repo can call it. The code is `app-home-screens/`.

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
| `SHOPIFY_E2E_STORE`, `SHOPIFY_E2E_TESTER_EMAIL`, `ORG_INBOX_URL` | repo variables |
| `SHOPIFY_E2E_TESTER_PASSWORD` | secret |
| `ORG_INBOX_API_TOKEN` | secret, optional. Used to read Shopify's new-device code |
| `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` | secrets, only for `grid: browserstack` |

This repo is public, so identifiers of the store, tester or inbox never live here. The private
caller passes them in.

## Behaviour

- **Pages**: `routes` if given. Otherwise the Remix flat-route files in `routes_dir`, skipping
  `$id`, `foo_`, `*.export`, `*.confirmed` and action-only files with no default export (they have
  no page). With no routes directory, it captures the App Home root, then every page the app's own
  admin sidebar links to. Links to other apps in the same sidebar are ignored.
- **URL**: `admin.shopify.com/store/<store>/apps/<client_id><path>`. The `client_id` comes from
  the app toml, so the app handle is never guessed.
- **Full page**: the admin scrolls its own container, so the job grows the viewport to the
  iframe's content height before it captures.
- **Sign-in**: only the job types the password. It is never logged, traced or uploaded. A
  new-device code is read from the org test inbox. A captcha stops the run with
  `login-bot-check.png`, and the job never tries to solve it.
- **Phone profile** is Chromium mobile emulation (iPhone 14 descriptor: 390 px, touch, mobile UA),
  not a real device. With `grid: browserstack` it is still emulation, on a recorded remote desktop
  Chrome. Real iOS Safari is a separate follow-up.
- **Error pages**: a page passes when `s-page` or a Polaris layout renders, which covers short
  empty states. A plain-HTML app passes when `main`, `h1` or `ui-title-bar` renders with more than
  40 characters of text. A page fails if the frame shows an application error, 404 or "no page at
  this address".
- **Where it can sign in**: Shopify's login shows a Cloudflare human check to GitHub-hosted runners
  and to cloud browser grids (BrowserStack and LambdaTest, measured 2026-09-23). The job stops
  there with `LOGIN-BOT-CHECK`. A run that has to sign in needs a runner on a network Shopify
  trusts.
- **Result**: an artifact with PNGs, `summary.md` and `results.json`, plus a step summary. The run
  fails when a page does not load or scrolls horizontally.

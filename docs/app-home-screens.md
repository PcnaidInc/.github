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
  `$id`, `foo_`, `*.export` and `*.confirmed`. With no routes directory, it captures the App Home
  root.
- **URL**: `admin.shopify.com/store/<store>/apps/<client_id><path>`. The `client_id` comes from
  the app toml, so the app handle is never guessed.
- **Full page**: the admin scrolls its own container, so the job grows the viewport to the
  iframe's content height before it captures.
- **Sign-in**: only the job types the password. It is never logged, traced or uploaded. A
  new-device code is read from the org test inbox. A captcha stops the run with
  `login-bot-check.png`, and the job never tries to solve it.
- **Result**: an artifact with PNGs, `summary.md` and `results.json`, plus a step summary. The run
  fails when a page does not load or scrolls horizontally.

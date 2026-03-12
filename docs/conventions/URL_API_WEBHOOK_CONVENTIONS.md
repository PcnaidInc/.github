# URL, API, and Webhook Conventions

## Purpose
This file is the canonical standard for URL structure, API routes, webhooks, callbacks, route naming, and endpoint assignment across all Pcnaid repos and services.

## Environment Hosts
Use hostnames for environment separation.
- Production: `https://api.pcnaid.com`
- Staging / Sandbox: `https://api-staging.pcnaid.com`
- Development: `https://api-dev.pcnaid.com`
- Human-facing portal: `https://portal.pcnaid.com` or `https://app.pcnaid.com`

Do not use `/dev`, `/staging`, or `/prod` in public paths unless a provider forces it.

## Canonical Public Patterns
- Human UI pages: `https://{portal-host}/{product}/{feature}`
- Public API: `https://{api-host}/{app-slug}/v{major}/{resource}`
- Public webhooks: `https://{api-host}/integrations/v1/webhooks/{provider}/{event-family}`
- Public callbacks / pull endpoints: `https://{api-host}/integrations/v1/callbacks/{provider}/{action}`
- Internal receivers: `https://{api-host}/internal/v1/receivers/{system}/{provider}`
- Health endpoints: `/health`, `/ready`, `/live`

Examples:
- `https://api.pcnaid.com/applepay-lifecycle/v1/domains`
- `https://api.pcnaid.com/integrations/v1/webhooks/doordash/orders`
- `https://api.pcnaid.com/integrations/v1/callbacks/doordash/menu-request`
- `https://portal.pcnaid.com/integrations/doordash/onboarding`

## Naming Rules
- Use lowercase only.
- Use `kebab-case` for path segments.
- Use plural nouns for collections: `/orders`, `/domains`, `/shops`.
- Use singular slugs for providers and systems: `doordash`, `shopify`, `ingram-micro`, `svix`.
- No trailing slash.
- No verbs in resource paths unless the route is an action endpoint that cannot be modeled as a resource.
- No secrets, tokens, IDs with meaning, or environment-specific internals in URLs.

Good:
- `/orders`
- `/orders/{orderId}`
- `/orders/{orderId}/cancel`

Avoid:
- `/getOrders`
- `/createOrder`
- `/doordashWebhookV2`

## Versioning Rules
- Public APIs must include a major version in the path: `/v1/`.
- Internal handlers may use `/internal/v1/`.
- Do not version by date in the URL unless a partner requires it.
- Breaking changes require a new major path version.
- Non-breaking changes stay in the same major version.

## App and Route Assignment
- Each repo/service owns one primary `app-slug`.
- Third-party inbound endpoints belong under `integrations` unless a provider contract requires a fixed path.
- One public provider endpoint per event family unless a provider requires separate URLs.
- Standardized provider-facing routes must be recorded in `config/routes.registry.yaml`.
- Keep backward-compatible aliases only during migration windows.

Recommended slugs:
- `applepay-lifecycle`
- `delegated-ssl`
- `atlas-main`
- `atlas-agenthub`
- `atlas-homehub`
- `integrations`

## Webhook Processing Rules
Public webhooks must stay thin and fast.
1. Verify provider auth or signature at the edge.
2. Capture raw body and critical headers.
3. Assign a normalized internal event name: `{provider}.{entity}.{action}`.
4. Enqueue async work.
5. Return a fast `200` or `202`.

Do not put heavy business logic, third-party fan-out, or slow DB workflows in the public webhook route.

Examples of normalized event names:
- `doordash.order.created`
- `shopify.app.uninstalled`
- `ingram.order.shipped`

## Special Exceptions
These may bypass the normal app-slug pattern when externally required:
- `/.well-known/*`
- Apple Pay domain association paths
- ACME / certificate validation paths
- Provider-mandated fixed callback URLs

Externally fixed paths should still be mapped internally to the owning service.

## Required Route Registry
Every repo that exposes routes must define a route registry file and treat it as the single source of truth.

Example:
```yaml
baseUrls:
  prod: https://api.pcnaid.com
  staging: https://api-staging.pcnaid.com
  dev: https://api-dev.pcnaid.com

apps:
  integrations:
    version: v1
    routes:
      doordashOrdersWebhook: /integrations/v1/webhooks/doordash/orders
      doordashMenuRequest: /integrations/v1/callbacks/doordash/menu-request
      ingramWebhook: /integrations/v1/webhooks/ingram-micro/orders
```

## Enforcement
No new public URL, API path, callback, or webhook route should be added unless it:
- matches this standard,
- is added to the route registry,
- has a documented owner,
- has auth/signature validation defined,
- has logging and retry behavior defined.

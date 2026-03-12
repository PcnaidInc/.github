# Variables, Secrets, and Config Conventions

## Purpose
This file is the canonical standard for environment variables, secrets, config naming, secret storage, rotation, and assignment across all Pcnaid repos and services.

## Core Rules
- Never hardcode real secrets in source code, docs, migrations, tests, screenshots, or sample payloads.
- Keep one canonical secret per provider/integration per environment unless a provider requires per-endpoint secrets.
- Use platform secret stores for real values; keep only placeholders in git.
- Store secret values outside the database whenever possible. If the database must reference a secret, store a reference ID, not the raw secret.
- All repos must include a checked-in `.env.example` or equivalent placeholder file.

## Naming Rules
- Use uppercase `SNAKE_CASE` only.
- Prefix variables by domain or system.
- Keep names stable across repos for the same concept.
- Prefer semantic names over ambiguous ones.

Good:
- `APP_ENV`
- `API_BASE_URL`
- `SUPABASE_URL`
- `SHOPIFY_API_SECRET`
- `DD_AUTH_ORDERS`
- `SVIX_INGEST_DD_ORDERS`

Avoid:
- `secret1`
- `prodToken`
- `DbUrl2`
- `myKey`

## Standard Prefixes
### App/runtime
- `APP_*`
- `API_*`
- `PORTAL_*`

### Database
- `SUPABASE_*`
- `DATABASE_*`

### Cloudflare / infra
- `CF_*`
- `R2_*`
- `KV_*`
- `QUEUE_*`

### Providers
- `SHOPIFY_*`
- `DD_*` for DoorDash
- `INGRAM_*`
- `WALMART_*`
- `SVIX_*`
- `AUTH0_*`

## Required Common Variables
Use these names unless a framework forces a specific name.
- `APP_NAME`
- `APP_ENV` (`development`, `staging`, `production`)
- `APP_BASE_URL`
- `API_BASE_URL`
- `PORTAL_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

## Inbound Webhook Secret Pattern
For provider auth or per-route webhook secrets, use:
- `{PROVIDER}_AUTH_{EVENT}` for inbound auth headers/tokens
- `{PROVIDER}_WEBHOOK_SECRET` for one global provider secret when applicable
- `SVIX_INGEST_{PROVIDER}_{EVENT}` for Svix ingest source URLs

Examples:
- `DD_AUTH_ORDERS`
- `DD_AUTH_MENU_REQUEST`
- `SHOPIFY_WEBHOOK_SECRET`
- `SVIX_INGEST_DD_ORDERS`

## File Conventions
- `.env.example`: checked in, placeholders only
- `.env.local`: local dev only, gitignored
- `.env.production`: never checked in
- `.dev.vars`: local Cloudflare Workers secrets, gitignored
- `wrangler.jsonc` or platform config: may reference secret names, never real values

## Assignment Rules
Every secret/config value must have:
- an owner,
- an environment scope,
- a rotation path,
- a source of truth,
- a usage location.

Suggested ownership model:
- app runtime config: repo owner
- provider credentials: integration owner
- database/admin credentials: platform owner
- shared infra secrets: platform/infrastructure owner

## Rotation Rules
- Rotate exposed or screenshot-leaked secrets immediately.
- Prefer short-lived credentials where supported.
- When rotating, support overlap windows if the provider allows old/new secret coexistence.
- Record the rotation date and owner in an internal secret registry.

## Validation Rules
- Validate required variables at startup.
- Fail fast if required secrets/config are missing.
- Never silently default a production secret.
- Provide one typed config module as the only runtime entry point for env access.

Recommended files:
- `src/config/env.ts`
- `src/config/secrets.ts`
- `config/env.schema.ts`

## Logging Rules
- Never log full secret values.
- Mask tokens, API keys, auth headers, cookies, and connection strings.
- Safe logging examples:
  - last 4 characters only
  - key IDs instead of key values
  - boolean presence checks like `SHOPIFY_API_SECRET present=true`

## Repo Checklist
Every repo should contain:
- this convention file,
- `.env.example`,
- one typed env validation module,
- one secret masking/logging rule,
- one owner for provider credentials and platform secrets.

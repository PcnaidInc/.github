# Database, Schema, and Table Conventions

## Purpose
This file is the canonical standard for database design, Supabase schema layout, table naming, table assignment, tenant boundaries, and migration structure across all Pcnaid repos and services.

## Project-Level Rule
Default to one shared Supabase project for the connected Pcnaid platform unless a service needs hard isolation for compliance, security, separate auth, noisy-neighbor risk, or likely white-label / spin-out operation.

## Required Schema Buckets
Use schemas by responsibility, not by convenience.

### Shared schemas
- `core`: shared business entities used by multiple apps
- `billing`: subscription, invoicing, plan, and monetization state
- `ops`: internal support and operations workflow data
- `private`: secrets, tokens, sensitive audit data, and backend-only records
- `events`: append-only inbound/outbound event and delivery logs

### App schemas
Use one app schema per product area.
- Shopify-specific apps may keep the existing pattern: `shopify_<slug>`
- Non-Shopify products should use: `app_<slug>`

Existing acceptable Shopify app schema examples:
- `shopify_applepay`
- `shopify_campaign`
- `shopify_cart`
- `shopify_commerce`
- `shopify_dandh`
- `shopify_ingram`
- `shopify_landing`
- `shopify_locallyft`
- `shopify_loyalty`
- `shopify_merch`
- `shopify_order`
- `shopify_pos`
- `shopify_tdsynnex`

## Schema Assignment Rules
### `core`
Put shared identity, merchant, org, and tenant records here.
Examples:
- `organizations`
- `merchants`
- `shops`
- `team_members`
- `shop_settings`
- `platform_connections`
- `app_installations`

### `billing`
Put cross-app billing state here.
Examples:
- `billing_accounts`
- `app_subscriptions`
- `invoices`
- `payment_methods`

### `ops`
Put internal admin/support workflow here.
Examples:
- `support_tickets`
- `announcements`
- `todos`
- `admin_notes`

### `private`
Put anything sensitive or backend-only here.
Examples:
- `api_keys`
- `oauth_tokens`
- `dns_oauth_tokens`
- `link_codes`
- `audit_log`
- `secret_references`

### `events`
Put append-only event records here.
Examples:
- `webhook_events`
- `event_outbox`
- `delivery_attempts`
- `dead_letter_events`

### App schema
Put only app-specific domain tables in the owning app schema.
Example for `shopify_applepay`:
- `apple_pay_features`
- `domains`
- `merchant_domains`

## Public Exposure Rules
- Raw tables do not belong in `public` long term.
- `public` should be empty or contain only intentionally exposed views/functions during transition.
- API-facing views/RPCs should live in an `api_<slug>` schema when needed.
- Sensitive schemas like `private` must never be exposed through the data API.

## Naming Rules
- Schema names: lowercase `snake_case`
- Table names: plural `snake_case`
- Join tables: `{left}_{right}` or `{left}_{right}_map`
- Primary key: `id` (UUID preferred)
- Foreign keys: `{entity}_id`
- Tenant keys: `organization_id`, `merchant_id`, `shop_id`
- Timestamps: `created_at`, `updated_at`, optional `deleted_at`
- Booleans: `is_*`, `has_*`
- Status fields: `status` for lifecycle, `state` only when a separate machine state is needed

## Modeling Rules
- Shared entities go in shared schemas, not app schemas.
- App schemas must not duplicate `organizations`, `merchants`, or `shops`.
- Store secrets in `private`; store secret references elsewhere if needed.
- Avoid unbounded JSON blobs when the shape is stable.
- Use `metadata` or `provider_payload` only for truly provider-specific or unstable attributes.
- Prefer normalized join tables over comma-separated values or embedded lists.

## Required Hierarchy
Use this mental model unless explicitly documented otherwise:
- `organizations` = parent account / business owner
- `merchants` = merchant identity / billing or operational merchant record
- `shops` = individual storefronts or connected stores
- `team_members` = people attached to an organization or merchant

## Migration Rules
- Each repo must own migrations for the schemas it changes.
- Shared-schema migrations must be clearly marked and reviewed because they affect multiple apps.
- Recommended pattern:
  - `supabase/migrations/shared/*`
  - `supabase/migrations/shopify_applepay/*`
  - `supabase/migrations/shopify_loyalty/*`
- Never hot-edit production tables by hand unless the change is documented and backfilled into migrations.

## Minimum Table Checklist
Every durable table should answer these questions:
- What schema owns it?
- What tenant key applies?
- Is it shared or app-specific?
- Is it safe for API exposure?
- Does it need soft delete?
- What indexes and uniqueness rules protect it?
- What upstream system owns the truth?

## Split-Out Rule
Move an app into its own project only when one of these becomes true:
- legal/compliance isolation is required,
- security/auth model is materially different,
- performance isolation is needed,
- the product will be sold, licensed, or separately operated.

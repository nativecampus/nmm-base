# NMM Architecture Patterns

The architectural patterns every NMM API follows. These are NMM-specific
conventions layered on the base FastAPI architecture in `docs/architecture.md`.
The canonical specification is `nmm_functional_spec_v17.md`; the construction
plan is `nmm_build_plan_v15.md`.

## Outbox transactionality

Every cross-API state change is written through the outbox, never by calling
another service synchronously. The originating endpoint, in one database
transaction:

1. writes its local row(s), and
2. writes one outbox row per emitted event,

then commits and returns. The outbox relay — a worker from the **`nmm-events`**
package — reads pending rows in id order per aggregate, publishes each to the
`nmm.events` topic exchange on RabbitMQ with the routing key derived from the
event, and marks the row published. Failures retry with exponential backoff;
persistent failures are logged for engineering review.

Per-aggregate ordering is preserved because the relay publishes serially per
`aggregate_id`. Cross-aggregate ordering for related events is the producer's
responsibility: write them atomically to the outbox in one transaction with
sequential ids.

The only synchronous cross-boundary calls allowed are the three documented
exceptions: the Auth0 Action endpoint (called at token issuance), the HubSpot
webhook receiver (queues its work), and the Advertiser API's self-serve booking
submission (a write to HubSpot, not an NMM-internal write).

## Projection tables

A consuming API does not read another API's database. It maintains local
**projection tables** updated by its event consumer from the events it
subscribes to. Projection rows carry a **tenant column** (publisher_id or
advertiser_id) populated from the event envelope by the consumer worker — never
by an HTTP request handler. The multi-tenancy listener's invariant on Updates and
Deletes catches any code path that tries to write a tenant value mismatching the
request contextvar.

## Event consumers

Each API runs an event consumer worker (from `nmm-events`) subscribed to the
routing keys it consumes. On receipt the worker:

1. validates the payload against the registered schema for the routing key
   (validation failure dead-letters the event),
2. dispatches to the registered handler, which runs the projection update and
   any derived computation — and any downstream outbox writes — in a single
   database transaction.

Handlers encode consumer-side business logic, not just row copies: recomputing
derived views, evaluating state-machine guards, enqueuing or suppressing
notifications, emitting downstream events. Idempotency is keyed on
`(tenant, event_id)` via the `consumed_events` table. See
`docs/cross-api-events.md` for routing keys and schema versioning.

## Multi-tenancy listener

Tenant isolation is enforced by a SQLAlchemy listener from the **`nmm-tenancy`**
package, identical across the SU MM and Advertiser APIs per that package's
`multi-tenancy-contract.md`:

- The JWT validation dependency sets a tenant contextvar on every request,
  before any service or query runs, derived from a JWT custom claim
  (publisher_id on the SU MM API, advertiser_ids on the Advertiser API).
- The listener intercepts every Select, Update, and Delete against the
  tenant-scoped tables and constrains them to the contextvar's tenant.
- `native_staff` users bypass via the contextvar value `{"type": "native_bypass"}`.

Each repo ships `scripts/fixtures/cross_tenant_isolation.py`, run as part of
`python manage.py harness`, asserting that list endpoints return only the
caller's data and that out-of-tenant detail/update/delete return 404.

## JWT validation

Authentication is a dependency factory from the **`nmm-auth`** package,
parameterised by audience and role taxonomy. It validates the bearer token for
the API's audience (e.g. `nmm-su-mm`, `nmm-advertiser`, `nmm-delivery`) and
derives the tenant contextvar from the token's custom claim. It does **not**
evaluate permissions: the role-permission matrix per spec section 31 lives on
each API's own admin tables, not in `nmm-auth`.

## OpenAPI as an exported artefact

The API contract is generated from the code, never authored by hand. FastAPI
route signatures and Pydantic schemas are the source of truth; `python -m
scripts.export_openapi` writes `<api>.openapi.json` at the repo root and CI fails
when the committed file diverges. Implementation starts with typed route stubs
returning HTTP 501 `{"error": "not_implemented"}`; the OpenAPI document is
canonical from the moment the stubs land. SPAs and the Publisher Widget generate
their clients from it. See `docs/openapi-export.md`.

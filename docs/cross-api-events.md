# Cross-API Events

How NMM services communicate. No service calls another synchronously to write —
all cross-API state change flows through the RabbitMQ message bus via the outbox
pattern. This document is the routing-key and schema-versioning reference;
`docs/architecture-patterns.md` covers the transactional mechanics. Canonical
spec: `nmm_functional_spec_v17.md` sections 8 and 9.

## Publish / consume

An originating endpoint writes its local row(s) and one outbox row per event in a
single database transaction, commits, and returns. The **outbox relay** (a worker
from the **`nmm-events`** package) publishes pending outbox rows to the
`nmm.events` topic exchange in id order per aggregate, marking each published.

A consuming API runs an **event consumer worker** (also from `nmm-events`)
subscribed to the routing keys it cares about. On receipt it validates the
payload against the registered schema, then dispatches to a handler that updates
its local projection and runs any derived computation and downstream outbox
writes in one transaction. Handlers are idempotent.

## Routing keys

Every event's routing key has the form:

```
<api>.<aggregate_type>.<event_type>
```

where `<api>` is the publishing service (`delivery`, `su_mm`, `advertiser`).
Examples:

```
delivery.campaign_booking.state_changed
su_mm.booking.accepted_by_su
advertiser.campaign_plan.approved_by_advertiser
```

## Envelope

Every event carries an envelope plus a payload:

- `event_id` (UUID)
- `event_type`
- `aggregate_type`
- `aggregate_id`
- `schema_version`
- `occurred_at`
- `published_at`
- `publisher` (the api name)
- tenant identity (`publisher_id` or `advertiser_id` where applicable)
- `payload`

The tenant identity in the envelope is how a consumer populates the tenant column
on its projection rows — never an HTTP request handler.

## Delivery and idempotency (spec §9)

- **At-least-once delivery.** Consumers dedupe on `(publisher, event_id)`,
  persisted in a `consumed_events` table (7-day TTL).
- **Per-aggregate ordering** is preserved by the outbox publishing serially per
  `aggregate_id`. Cross-aggregate ordering, where needed, is achieved by the
  producer writing the related events atomically to the outbox with sequential
  ids.
- **Failure** retries with exponential backoff (1s, 5s, 25s, 2m, 10m); after five
  attempts the event dead-letters per consumer per aggregate type.
- **Deterministic downstream ids.** A handler that emits a downstream event
  derives its `event_id` from the input event's id, so a re-run produces the same
  id and the downstream consumer dedupes.

## Schema versioning (spec §8)

Every event includes a `schema_version` integer starting at **1**.

- **Non-breaking (same version):** adding a new optional field.
- **Breaking (version bump):** removing a field, renaming a field, or changing a
  field's type.
- Consumers must handle **every version they have ever seen**; old versions are
  not retired without a migration plan.

Schemas live in the shared **`nmm-event-contracts`** package, consumed by all
three services. It holds JSON Schema 2020-12 documents — one per event type per
schema version, laid out as
`schemas/<api>/<aggregate>/<event_type>/v<n>.json` — plus a `registry.json`
mapping each routing key to its current schema version, its publisher API, its
consumer APIs, and the projection or side effect each consumer performs. The
package is versioned and released normally; consuming repos pin it by exact
version.

## Package dependencies

- **Runtime:** the outbox relay and event consumer come from **`nmm-events`**.
- **Schemas:** the event payload contracts come from **`nmm-event-contracts`**.

Both are added by each application repo after scaffolding (build-plan step 3+),
pinned by exact version. They are not part of the `nmm-base` scaffold itself.

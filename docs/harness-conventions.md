# Harness Conventions

The harness is NMM's integration-test pattern, carried forward from the `nmm`
repo. It exercises a running service end to end — HTTP in, database and message
bus and outbound effects out — rather than mocking at the unit boundary. Unit
tests (`pytest`) still cover service and handler logic in isolation; the harness
covers the wired-up behaviour the unit tests cannot.

## The command

```bash
python manage.py harness
```

`cmd_harness` runs `scripts/harness.py`, which executes every fixture in
`scripts/fixtures/` against the **live dev stack**. The stack (Postgres, Redis,
RabbitMQ, the API process, the outbox relay, the event consumer, and any fakes
for external services) is brought up first:

```bash
npm run dev:stack
```

The harness is not a `pytest` suite. It drives the real HTTP API and asserts on
the real side effects, so the stack must be up before it runs.

## What a fixture does

A fixture is a Python module under `scripts/fixtures/` that posts to the API as a
real client and then asserts on captured effects through the harness assertion
helpers, for example:

- **`assert_api_state`** — GET an endpoint and assert the response shape/values.
- **`assert_outbox`** — assert the expected outbox rows (routing key, payload)
  were written by the transaction.
- **`assert_domain_event_log`** — assert events were published/consumed.
- **`assert_emails`** / **`assert_follow_links`** — assert captured notifications
  (via the Postmark fake or mailpit) and follow rendered links.

Fixtures are grouped by area (e.g. `admin/`, `demo/`, `email/`, `webhook/` in
`nmm`). Each NMM API repo adds the fixtures relevant to its surface.

## Cross-tenant isolation fixture

Every tenant-scoped API ships `scripts/fixtures/cross_tenant_isolation.py`, run as
part of the harness. It creates two tenants with their own records, acts as each
tenant's user, and asserts that list endpoints return only the caller's data and
that out-of-tenant detail, update, and delete return 404. This is the executable
check on the `nmm-tenancy` listener (see `docs/architecture-patterns.md`).

## Email transport

When a fixture asserts on notifications, the harness captures them through the
configured transport. The dev stack defaults to a Postmark fake that captures the
rendered template model (so the harness can assert on template fields and follow
links); set `EMAIL_TRANSPORT=mailpit` to inspect rendered MIME in the mailpit UI
instead:

```bash
python manage.py harness --email-transport mailpit
```

## Carrying it forward

A freshly scaffolded repo starts with the convention documented here and no
fixtures yet. As an API's endpoints and event handlers land, add fixtures under
`scripts/fixtures/` and wire the `harness` command in `manage.py` following the
`nmm` implementation (`scripts/harness.py` plus the assertion helpers in
`scripts/harness_pkg/`).

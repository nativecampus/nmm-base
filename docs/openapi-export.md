# OpenAPI Export

The repo commits its OpenAPI document to a JSON file at the repo root. This file
is the contract that frontend SPAs (see `docs/frontends.md`) generate their
TypeScript clients from. A CI gate keeps it in sync with the FastAPI app.

## The file

The document lives at `<api-name>.openapi.json` at the repo root. For base_app
this is `base-app.openapi.json`. The name is configurable per project so each
repo scaffolded from base_app produces a correctly named file without editing
the export script.

## Configuration

Two env vars control the export (defaults shown, also written to `.env.example`):

| Variable                  | Default                  | Purpose                                   |
|---------------------------|--------------------------|-------------------------------------------|
| `OPENAPI_APP_IMPORT`      | `app.main:app`           | `module:attr` path to the FastAPI app     |
| `OPENAPI_OUTPUT_FILENAME` | `base-app.openapi.json`  | Output filename at the repo root          |

`scripts/init_project.py` rewrites `OPENAPI_OUTPUT_FILENAME` in `.env.example`
to the new project's kebab-case name when a project is scaffolded.

## Regenerating locally

```bash
pipenv run python -m scripts.export_openapi
```

This imports the FastAPI app, calls `app.openapi()`, and writes the document to
the configured file. Commit the result whenever you change routes, request or
response schemas, or anything else that affects the API surface.

## CI gate

The CI workflow runs:

```bash
pipenv run python -m scripts.export_openapi --check
```

`--check` regenerates the document in memory and compares it to the committed
file without writing. If they differ, the step exits non-zero and the PR fails,
with a message telling you to run the export and commit the result. This
guarantees the committed contract always matches the code.

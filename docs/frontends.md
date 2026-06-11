# Frontends

Single-page applications that consume this repo's JSON API live under
`frontends/<spa-name>/`. The repo-root OpenAPI document (see
`docs/openapi-export.md`) is the contract between the API and every SPA.

## Convention

- Each SPA is a self-contained directory under `frontends/`.
- SPAs talk to the API over HTTP only. They never import Python code or query the
  database directly.
- The TypeScript client is generated from `<api-name>.openapi.json` at the repo
  root, not hand-written. This keeps the client in lockstep with the API surface.
- The default component library is `nmm-ui` (`docs/nmm-ui.md`); the template
  pre-wires it and wraps the app in `NmmProvider`. `native-ui`
  (`docs/native-ui.md`) is the per-project alternative. SPAs compose the
  library's exports rather than inventing their own primitives.
- During development a Prism mock server stands in for the real API, so the SPA
  can be built against the contract before the endpoints exist.

## The template

`frontends/_template/` is the starting point for a new SPA. It uses Vite, React,
and TypeScript, with `openapi-typescript` for client generation and
`@stoplight/prism-cli` for mocking.

```
_template/
├── package.json        scripts and dev dependencies
├── vite.config.ts      dev server; proxies /api to the Prism mock on :4010
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    └── api/            generated types.ts (gitignored)
```

### Creating a SPA

```bash
cp -r frontends/_template frontends/dashboard
cd frontends/dashboard
npm install
```

Update the `name` field in `package.json` to match the directory.

## Scripts

| Command                  | Purpose                                                     |
|--------------------------|-------------------------------------------------------------|
| `npm run dev`            | Vite dev server on :5173                                     |
| `npm run build`          | Type-check then build a production bundle                    |
| `npm run generate-types` | Regenerate `src/api/types.ts` from the repo-root OpenAPI doc |
| `npm run mock`           | Prism mock server on :4010 from the OpenAPI doc              |

## The Prism mock pattern

`npm run mock` starts a Prism mock server that serves a response for every
operation defined in the OpenAPI document, using the schema examples and types to
synthesise payloads. `vite.config.ts` proxies `/api` to it on port 4010.

This means a SPA can be developed end to end — fetching data, rendering it,
handling errors — against the agreed contract before any API route is
implemented. When the real API is ready, point the proxy at it instead.

## Generated client

`npm run generate-types` runs `openapi-typescript` against the repo-root OpenAPI
document and writes typed definitions to `src/api/types.ts`. The file is
generated, not committed (it is gitignored), and is regenerated in CI and
whenever the contract changes. Import the `paths` and `components` types from it
to type fetch calls against the API.

## Scaffolding

When a project is created with `scripts/init_project.py`, the template's
`package.json` name and its references to the OpenAPI filename are rewritten to
the new project's kebab-case name, so `generate-types` and `mock` point at the
correct contract file out of the box.

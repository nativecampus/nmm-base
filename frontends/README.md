# frontends/

Single-page applications that consume this repo's JSON API.

Each SPA lives in its own directory under `frontends/<spa-name>/`. The OpenAPI
document at the repo root (`<api-name>.openapi.json`) is the contract between the
API and every SPA. SPAs do not import Python code or read the database directly;
they call the API over HTTP and generate their TypeScript client from the
committed OpenAPI document.

## Creating a new SPA

Copy the template and install:

```bash
cp -r frontends/_template frontends/dashboard
cd frontends/dashboard
npm install
```

Set the `name` field in `package.json` to match the directory.

## Template layout

```
_template/
├── package.json        vite + react + typescript + openapi-typescript + prism
├── vite.config.ts      dev server, proxies /api to the Prism mock on :4010
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx        React entry point
    ├── App.tsx         example component that calls the API
    └── api/            generated client types land here (types.ts, gitignored)
```

## Scripts

| Command                  | Purpose                                                        |
|--------------------------|----------------------------------------------------------------|
| `npm run dev`            | Vite dev server on :5173                                        |
| `npm run build`          | Type-check and produce a production bundle                      |
| `npm run generate-types` | Regenerate `src/api/types.ts` from the repo-root OpenAPI doc    |
| `npm run mock`           | Run a Prism mock server on :4010 from the OpenAPI doc           |

## Working before the API exists

`npm run mock` serves a mock implementation of every endpoint in the OpenAPI
document via Prism. The Vite dev server proxies `/api` to it, so the SPA can be
built against the contract before the corresponding API routes are implemented.

See `docs/frontends.md` for the full convention.

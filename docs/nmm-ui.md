# nmm-ui

`nmm-ui` is the default component library for NMM SPAs scaffolded from `nmm-base`.
It is the Native Media Manager 2.0 design system packaged as a React library:
tokens, primitives, a provider, and a white-label theme factory. It is styled
with CSS custom properties — `NmmProvider` injects the design tokens at runtime;
there is no stylesheet to import.

Every frontend depends on it; SPAs compose its exports rather than inventing their
own primitives. `native-ui` is the per-project alternative (`docs/native-ui.md`).

## Installation

`nmm-ui` is not yet published to the public npm registry. It is consumed as a git
dependency from `nativecampus/nmm-ui`; its `prepare` script builds `dist/` on
install. The Vite SPA scaffold under `frontends/_template/` already declares it:

```json
"nmm-ui": "github:nativecampus/nmm-ui"
```

Resolving it requires git access to the `nativecampus/nmm-ui` repository (SSH) at
`npm install` time. Once `nmm-ui` is published to a registry, the dependency can
be pinned by version instead.

### Peer dependencies

`nmm-ui` peers only on React (`>=18`), satisfied by the template's React 19:

- `react@>=18`, `react-dom@>=18`

## Provider and theme

Wrap the app in `NmmProvider` to inject the NMM design tokens (see
`frontends/_template/src/App.tsx`):

```tsx
import { NmmProvider, Card, Button, StatusPill } from "nmm-ui";

<NmmProvider>
  <Card pad={24}>
    <StatusPill status="in-progress" />
    <Button variant="primary">Advance stage</Button>
  </Card>
</NmmProvider>
```

`NmmProvider` accepts white-label overrides directly via its `theme` prop. Options:
`injectTokens` (default true), `loadFonts` (default false — webfont fetching is
opt-in for privacy/offline hosts), `nonce` (for a strict Content-Security-Policy).

For white-label SPAs that re-skin the panel, `createNmmTheme` deep-merges
`CustomThemeOptions` (partial `colors` / `radii` / `fonts`) onto the defaults and
returns a resolved `NmmTheme` — see `frontends/_template/src/nmm-ui-theme-example.tsx`.

## Available components

From `nmm-ui`'s `dist/index.d.ts`:

- **Components (11 primitives)** — `Button`, `Chip`, `StatusPill`, `Card`,
  `Avatar`, `FilterChip`, `Input`, `Checkbox`, `KbdKey`, `CountBadge`, `NavLink`.
- **Icons** — `Icon` (a Lucide/Feather-family line set) and the `IconName` union.
- **Provider** — `NmmProvider` / `Nmm`.
- **Theme** — `createNmmTheme`, `extendTheme`, `defaultTheme`, `themeToCssVars`,
  `getCustomColor`, `getCustomRadius`; types `NmmTheme`, `CustomThemeOptions`.
- **Tokens** — `tokenCss` and `fontImportCss` (raw stylesheet strings, if you
  prefer to inject them yourself).

See the [nmm-ui README](https://github.com/nativecampus/nmm-ui) for usage and the
`examples/admin` demo.

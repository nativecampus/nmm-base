# nmm-ui

`nmm-ui` is the second component-library option, selected per project in place of
`native-ui` (the default). It is the Native Media Manager 2.0 design system
packaged as a React library: tokens, primitives, a provider, and a white-label
theme factory. Unlike `native-ui` (MUI-based), `nmm-ui` is styled with CSS custom
properties — `NmmProvider` injects the design tokens at runtime; there is no
stylesheet to import.

## Status — not yet published

> **Confirm against the published package.** `nmm-ui` is currently version
> **0.1.0** and is **not published to a registry**. Until it is, consume it from
> the `nativecampus/nmm-ui` git repository or a local `file:` link. The version
> and install spec below must be reconfirmed once the package is published.

```jsonc
// once published:
"nmm-ui": "0.1.0"
// until then, from git:
"nmm-ui": "github:nativecampus/nmm-ui"
```

### Peer dependencies

`nmm-ui` peers only on React (`>=18`), so it works with the template's React 19:

- `react@>=18`, `react-dom@>=18`

## Switching a project from native-ui to nmm-ui

The default scaffold keeps `native-ui`. To switch a project:

1. Replace the `native-ui` dependency (and its MUI/Emotion peers, if unused
   elsewhere) with `nmm-ui` in `frontends/<spa>/package.json`.
2. In `src/App.tsx`, wrap the app in `NmmProvider` instead of `NativeProvider`.
3. Use `src/nmm-ui-theme-example.tsx` as the white-label reference in place of
   `native-ui-theme-example.tsx`.

```tsx
import { NmmProvider, Card, Button, StatusPill } from "nmm-ui";

<NmmProvider>
  <Card pad={24}>
    <StatusPill status="in-progress" />
    <Button variant="primary">Advance stage</Button>
  </Card>
</NmmProvider>
```

## Provider and theme

- **`NmmProvider`** (alias `Nmm`) — injects the design tokens and accepts
  white-label overrides directly via its `theme` prop. Options: `injectTokens`
  (default true), `loadFonts` (default false — webfont fetching is opt-in for
  privacy/offline hosts), `nonce` (for a strict Content-Security-Policy).
- **`createNmmTheme`** — white-label theme factory; deep-merges
  `CustomThemeOptions` (partial `colors` / `radii` / `fonts`) onto the defaults
  and returns a resolved `NmmTheme`. See
  `frontends/_template/src/nmm-ui-theme-example.tsx`.

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

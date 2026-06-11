# native-ui

`native-ui` is the default component library for NMM SPAs. Every frontend depends
on it; SPAs compose its exports rather than inventing their own primitives. It is
a React component library built on Material-UI v7 with the Native.fm design
system.

## Installation

`native-ui` is not published to the public npm registry. It is consumed as a git
dependency from `nativecampus/native-ui`. The Vite SPA scaffold under
`frontends/_template/` already declares it:

```json
"native-ui": "github:nativecampus/native-ui#v2"
```

The `v2` branch is the 2.1.0 release line. Resolving it requires git access to
the `nativecampus/native-ui` repository (SSH) at `npm install` time.

### Peer dependencies

`native-ui` peers on Material-UI v7, Emotion, and React 19. The template provides
all of them:

- `@mui/material@^7.3.4`, `@mui/system@^7.3.4`, `@mui/lab@^7.0.0-beta.17`, `@mui/x-date-pickers@^8.12.0`
- `@emotion/react@^11`, `@emotion/styled@^11`
- `react@>=19.0.0`, `react-dom@>=19.0.0`

## Provider and theme

Wrap the app in `NativeProvider` to apply the default Native theme (see
`frontends/_template/src/App.tsx`):

```tsx
import { NativeProvider, Container, Typography } from "native-ui";

<NativeProvider>
  <Container><Typography variant="h1">…</Typography></Container>
</NativeProvider>
```

The Delivery Manager, SU Media Manager, and Advertiser Portal use this default
theme. The Publisher Widget renders each publisher's embed in their own brand
using `createCustomTheme` with per-publisher colours — see
`frontends/_template/src/native-ui-theme-example.tsx`.

## Available components

`native-ui` re-exports a curated set of Material-UI components with the Native
theme applied, plus a few NMM-specific components:

- **Selective MUI re-exports** — layout (`Box`, `Container`, `Grid`, `Stack`),
  inputs (`Button`, `TextField`, `Select`, `Autocomplete`, `Checkbox`, …),
  navigation (`AppBar`, `Drawer`, `Tabs`, `Breadcrumbs`, `Pagination`), data
  display (`Table`, `Typography`, `Card`, `Chip`, `Avatar`, `Badge`), feedback
  (`Alert`, `Dialog`, `Snackbar`, `Progress`), surfaces (`Paper`, `Accordion`),
  lab (`LoadingButton`, `Timeline`, `TreeView`), and the `@mui/x-date-pickers`
  date/time pickers.
- **`DataCard`** — a metric card with title, value, status, and trend.
- **`StatusBadge`** — a status indicator (`success | warning | error | info | neutral`)
  rendered as a badge or chip.
- **`Icon`** — an MDI-path icon (`@mdi/js` paths are re-exported).
- **`NativeProvider`** — the theme provider (alias of `Native`).
- **`createCustomTheme`** — white-label theme factory taking six `WLColors`
  (`bg`, `text`, `primary`, `secondary`, `accent`, `accentText`); auto-detects
  light/dark mode and generates colour variants.

Theme helpers are also exported: `defaultTheme`, `createNativeTheme`,
`extendTheme`, `getCustomColor`, `getCustomSpacing`, `getCustomBorderRadius`,
`getCustomShadow`, and the MUI `ThemeProvider`.

See the [native-ui README](https://github.com/nativecampus/native-ui) and its
Storybook for the complete component list and usage examples.

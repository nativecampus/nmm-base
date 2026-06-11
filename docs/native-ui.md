# native-ui

`native-ui` is the second component-library option, selected per project in place
of `nmm-ui` (the default). It is a React component library built on Material-UI v7
with the Native.fm design system: a curated set of MUI re-exports with the Native
theme applied, plus a few NMM-specific components.

## Status

`native-ui` is not published to the public npm registry. It is consumed as a git
dependency from `nativecampus/native-ui`. The `v2` branch is the 2.1.0 release
line; its built `dist/` is committed, so a git install resolves without a build
step. Resolving it requires git access to the repository (SSH) at `npm install`
time.

```json
"native-ui": "github:nativecampus/native-ui#v2"
```

### Peer dependencies

`native-ui` peers on Material-UI v7, Emotion, and React 19:

- `@mui/material@^7.3.4`, `@mui/system@^7.3.4`, `@mui/lab@^7.0.0-beta.17`, `@mui/x-date-pickers@^8.12.0`
- `@emotion/react@^11`, `@emotion/styled@^11`
- `react@>=19.0.0`, `react-dom@>=19.0.0`

## Switching a project from nmm-ui to native-ui

The default scaffold uses `nmm-ui`. To switch a project:

1. Replace the `nmm-ui` dependency in `frontends/<spa>/package.json` with
   `native-ui` and its MUI/Emotion peers:

   ```json
   "native-ui": "github:nativecampus/native-ui#v2",
   "@mui/material": "^7.3.4",
   "@mui/system": "^7.3.4",
   "@mui/lab": "^7.0.0-beta.17",
   "@mui/x-date-pickers": "^8.12.0",
   "@emotion/react": "^11.13.0",
   "@emotion/styled": "^11.13.0"
   ```

2. In `src/App.tsx`, wrap the app in `NativeProvider` instead of `NmmProvider`.
3. Use `src/native-ui-theme-example.tsx` as the white-label reference in place of
   `nmm-ui-theme-example.tsx`.

```tsx
import { NativeProvider, Container, Typography } from "native-ui";

<NativeProvider>
  <Container><Typography variant="h1">…</Typography></Container>
</NativeProvider>
```

## Provider and theme

- **`NativeProvider`** (alias `Native`) — applies the default Native theme.
- **`createCustomTheme`** — white-label theme factory taking six `WLColors`
  (`bg`, `text`, `primary`, `secondary`, `accent`, `accentText`); auto-detects
  light/dark mode and generates colour variants. See
  `frontends/_template/src/native-ui-theme-example.tsx`.

## Available components

- **Selective MUI re-exports** — layout (`Box`, `Container`, `Grid`, `Stack`),
  inputs (`Button`, `TextField`, `Select`, `Autocomplete`, `Checkbox`, …),
  navigation (`AppBar`, `Drawer`, `Tabs`, `Breadcrumbs`, `Pagination`), data
  display (`Table`, `Typography`, `Card`, `Chip`, `Avatar`, `Badge`), feedback
  (`Alert`, `Dialog`, `Snackbar`, `Progress`), surfaces (`Paper`, `Accordion`),
  lab (`LoadingButton`, `Timeline`, `TreeView`), and the `@mui/x-date-pickers`
  pickers.
- **`DataCard`** — a metric card with title, value, status, and trend.
- **`StatusBadge`** — a status indicator rendered as a badge or chip.
- **`Icon`** — an MDI-path icon (`@mdi/js` paths are re-exported).
- **`NativeProvider`** — the theme provider.
- **`createCustomTheme`** — the white-label theme factory.

See the [native-ui README](https://github.com/nativecampus/native-ui) and its
Storybook for the complete component list.

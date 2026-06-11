// White-label theming with nmm-ui (the second component-library option).
//
// nmm-ui is selected per project in place of native-ui. Unlike native-ui (MUI +
// ThemeProvider), nmm-ui is token-driven: <NmmProvider> injects CSS custom
// properties and accepts white-label overrides directly via its `theme` prop —
// there is no separate ThemeProvider. createNmmTheme builds a fully-resolved
// theme object when you need to read values.
//
// This file is a reference, not wired into the app. The default scaffold uses
// native-ui; see docs/nmm-ui.md to switch a project to nmm-ui.

import { NmmProvider, createNmmTheme, Card, Button, StatusPill, type CustomThemeOptions } from "nmm-ui";

// White-label overrides are deep-merged onto the default NMM theme.
const publisherOverrides: CustomThemeOptions = {
  colors: { brand: "#0EA5E9", brandHover: "#0284C7" },
  radii: { card: "16px" },
};

export function NmmWhiteLabelExample({ overrides = publisherOverrides }: { overrides?: CustomThemeOptions }) {
  // createNmmTheme resolves the overrides if you need the concrete values;
  // NmmProvider also accepts the raw overrides via its `theme` prop.
  const theme = createNmmTheme(overrides);

  return (
    <NmmProvider theme={overrides}>
      <Card pad={24}>
        <StatusPill status="in-progress" />
        <Button variant="primary">Advance stage</Button>
        <span style={{ color: theme.colors.brand }}>Brand-tinted label</span>
      </Card>
    </NmmProvider>
  );
}

// White-label theming with native-ui.
//
// Non-widget SPAs (Delivery Manager, SU Media Manager, Advertiser Portal) use
// the default Native theme via <NativeProvider> — see App.tsx. The Publisher
// Widget renders each publisher's embed in their own brand, so it builds a
// theme per publisher from colours served by the styling endpoint and wraps the
// tree in <ThemeProvider> instead of <NativeProvider>.
//
// This file is a reference, not wired into the app.

import { createCustomTheme, ThemeProvider, Container, Typography, Button, type WLColors } from "native-ui";

// Six core colours define a white-label theme. createCustomTheme detects whether
// the background is light or dark and generates light/dark/contrast variants.
const publisherColors: WLColors = {
  bg: "#FFFFFF",
  text: "#000000",
  primary: "#FF5733",
  secondary: "#33FF57",
  accent: "#FFA500",
  accentText: "#FFFFFF",
};

export function PublisherWidgetExample({ colors = publisherColors }: { colors?: WLColors }) {
  const theme = createCustomTheme(colors);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h1">Publisher-branded widget</Typography>
        <Button variant="contained" color="primary">
          Primary action
        </Button>
        <Button variant="contained" color="secondary">
          Secondary action
        </Button>
      </Container>
    </ThemeProvider>
  );
}

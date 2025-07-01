export const ColorScheme = {
  DARK: "dark",
  LIGHT: "light",
};

export function extendTheme(baseTheme, cssVarsTheme) {
  return {
    ...baseTheme,
    ...cssVarsTheme,
    palette: undefined, // Explicitly omit palette if needed
  };
}

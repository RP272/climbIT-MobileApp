import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const NAV_THEME = {
  light: {
    background: "#cccccc",
    border: "#505050",
    card: "#b0b0b0",
    notification: "#983b3b",
    primary: "#983b3b",
    text: "#1f1f1f",
  },
  dark: {
    background: "#1a1a1a",
    border: "#4a4a4a",
    card: "#2a2a2a",
    notification: "#c25b58",
    primary: "#c25b58",
    text: "#e0e0e0",
  },
} as const;

export const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

export const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

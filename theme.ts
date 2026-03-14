import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const NAV_THEME = {
  light: {
    background: "#f6f1e8",
    border: "#d7ccbd",
    card: "#fffdf9",
    notification: "#a54433",
    primary: "#a54433",
    text: "#1b1713",
  },
  dark: {
    background: "#12100e",
    border: "#3c332c",
    card: "#1d1916",
    notification: "#e07a61",
    primary: "#e07a61",
    text: "#f5efe6",
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

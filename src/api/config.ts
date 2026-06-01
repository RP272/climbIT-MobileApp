const DEFAULT_API_BASE_URL = "https://c859-93-159-49-233.ngrok-free.app/v1";

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(
  /\/$/,
  "",
);

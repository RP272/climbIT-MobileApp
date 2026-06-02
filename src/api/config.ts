const DEFAULT_API_BASE_URL = "https://climbit.manamo101.tech/v1";

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(
  /\/$/,
  "",
);

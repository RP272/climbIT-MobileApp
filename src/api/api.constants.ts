const FALLBACK_API_URL = "https://c859-93-159-49-233.ngrok-free.app/v1";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  FALLBACK_API_URL
).replace(/\/$/, "");

export const DEV_JWT_TOKEN = process.env.EXPO_PUBLIC_DEV_JWT_TOKEN ?? null;

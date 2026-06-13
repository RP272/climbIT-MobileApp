const FALLBACK_API_URL = "https://6fd5-2a02-a317-e098-fe80-f4f4-597f-c036-a93a.ngrok-free.app/v1";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  FALLBACK_API_URL
).replace(/\/$/, "");

export const DEV_JWT_TOKEN = process.env.EXPO_PUBLIC_DEV_JWT_TOKEN ?? null;

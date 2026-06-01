import { ApiError } from "@/src/api/client";

function isAuthorizationMessage(message: string) {
  const normalized = message.trim().toLowerCase();

  return (
    normalized.includes("missing or invalid authorization") ||
    normalized.includes("missing authorization") ||
    normalized.includes("invalid authorization") ||
    normalized.includes("missing user session") ||
    normalized.includes("invalid token") ||
    normalized.includes("unauthorized")
  );
}

export function isAuthError(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.status === 401) {
    return true;
  }

  return isAuthorizationMessage(error.message);
}

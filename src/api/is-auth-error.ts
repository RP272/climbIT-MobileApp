import { ApiError } from "@/src/api/client";

export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

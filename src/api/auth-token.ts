let runtimeAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return runtimeAccessToken ?? process.env.EXPO_PUBLIC_ACCESS_TOKEN ?? null;
}

export function setAccessToken(token: string | null): void {
  runtimeAccessToken = token;
}

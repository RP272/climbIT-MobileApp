import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE_KEY = "climbit.auth.tokens";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

let runtimeAuthTokens: AuthTokens = {
  accessToken: null,
  refreshToken: null,
};

export function getAccessToken(): string | null {
  return runtimeAuthTokens.accessToken;
}

export function getRefreshToken(): string | null {
  return runtimeAuthTokens.refreshToken;
}

export async function loadAuthTokens(): Promise<AuthTokens> {
  const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    runtimeAuthTokens = {
      accessToken: null,
      refreshToken: null,
    };

    return runtimeAuthTokens;
  }

  try {
    const parsedTokens = JSON.parse(storedValue) as AuthTokens;
    runtimeAuthTokens = {
      accessToken: parsedTokens.accessToken ?? null,
      refreshToken: parsedTokens.refreshToken ?? null,
    };
  } catch {
    runtimeAuthTokens = {
      accessToken: null,
      refreshToken: null,
    };
  }

  return runtimeAuthTokens;
}

export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  runtimeAuthTokens = {
    accessToken: tokens.accessToken ?? null,
    refreshToken: tokens.refreshToken ?? null,
  };

  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(runtimeAuthTokens));
}

export async function clearAuthTokens(): Promise<void> {
  runtimeAuthTokens = {
    accessToken: null,
    refreshToken: null,
  };

  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

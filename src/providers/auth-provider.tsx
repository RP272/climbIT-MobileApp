import {
  clearAuthTokens,
  getAccessToken,
  loadAuthTokens,
  setAuthTokens,
} from "@/src/api/auth-token";
import { isAuthError } from "@/src/api/is-auth-error";
import { onSessionInvalidated } from "@/src/api/session-invalidation";
import {
  completeOnboarding as completeOnboardingRequest,
  fetchOnboardingStatus,
} from "@/src/api/onboarding.api";
import { signIn as signInRequest, signUp as signUpRequest } from "@/src/api/auth.api";
import type { OnboardingCompleteRequestDto, OnboardingStatusResponseDto } from "@/src/types/api";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthCredentials = {
  email: string;
  password: string;
};

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  needsOnboarding: boolean;
  onboardingStatusLoaded: boolean;
  onboardingStatus: OnboardingStatusResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshOnboardingStatus: () => Promise<void>;
  completeOnboarding: (payload: OnboardingCompleteRequestDto) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatusResponseDto | null>(
    null,
  );
  const [onboardingStatusLoaded, setOnboardingStatusLoaded] = useState(false);

  const hasValidSession = Boolean(accessToken && getAccessToken());
  const onboardingCompleted = onboardingStatus?.completed === true;
  const needsOnboarding =
    hasValidSession && onboardingStatusLoaded && onboardingStatus?.completed === false;

  useEffect(() => {
    let mounted = true;

    loadAuthTokens()
      .then((tokens) => {
        if (!mounted) {
          return;
        }

        setAccessTokenState(tokens.accessToken);
        setRefreshTokenState(tokens.refreshToken);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setAccessTokenState(null);
        setRefreshTokenState(null);
      })
      .finally(() => {
        if (!mounted) {
          return;
        }

        setIsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      void refreshOnboardingStatus();
      return;
    }

    setOnboardingStatus(null);
    setOnboardingStatusLoaded(true);
  }, [accessToken]);

  useEffect(() => {
    return onSessionInvalidated(() => {
      void clearSession();
    });
  }, []);

  const clearSession = async () => {
    await clearAuthTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
    setOnboardingStatus(null);
    setOnboardingStatusLoaded(true);
  };

  const updateTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
    await setAuthTokens(tokens);
    setAccessTokenState(tokens.accessToken);
    setRefreshTokenState(tokens.refreshToken);
  };

  const signIn = async (credentials: AuthCredentials) => {
    const tokens = await signInRequest(credentials);
    await updateTokens(tokens);
  };

  const signUp = async (credentials: AuthCredentials) => {
    await signUpRequest(credentials);
    await signIn(credentials);
  };

  const signOut = async () => {
    await clearSession();
  };

  const refreshOnboardingStatus = async () => {
    const token = getAccessToken();

    if (!token) {
      setOnboardingStatus(null);
      setOnboardingStatusLoaded(true);
      return;
    }

    setOnboardingStatusLoaded(false);

    try {
      const status = await fetchOnboardingStatus();
      setOnboardingStatus(status);
    } catch (error) {
      setOnboardingStatus(null);

      if (isAuthError(error)) {
        await clearSession();
      }
    } finally {
      setOnboardingStatusLoaded(true);
    }
  };

  const completeOnboarding = async (payload: OnboardingCompleteRequestDto) => {
    if (!getAccessToken()) {
      await clearSession();
      throw new Error("Missing authorization session.");
    }

    try {
      const status = await completeOnboardingRequest(payload);
      setOnboardingStatus(status);
      setOnboardingStatusLoaded(true);
    } catch (error) {
      if (isAuthError(error)) {
        await clearSession();
      }

      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isAuthenticated: hasValidSession,
        onboardingCompleted,
        needsOnboarding,
        onboardingStatusLoaded,
        onboardingStatus,
        accessToken,
        refreshToken,
        signIn,
        signUp,
        signOut,
        refreshOnboardingStatus,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

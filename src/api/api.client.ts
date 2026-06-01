import { API_BASE_URL, DEV_JWT_TOKEN } from "@/src/api/api.constants";
import { clearAuthTokens, getAccessToken } from "@/src/api/auth-token";
import { notifySessionInvalidated } from "@/src/api/session-invalidation";
import { AxiosHeaders, create, isAxiosError } from "axios";
import Toast from "react-native-toast-message";

export const apiClient = create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const requestPath = config.url ?? "";
    const isPublicAuthRequest = requestPath.startsWith("/auth/") || requestPath.includes("/auth/");

    if (!isPublicAuthRequest) {
      const accessToken = getAccessToken() ?? DEV_JWT_TOKEN;

      if (accessToken) {
        const headers = AxiosHeaders.from(config.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);
        config.headers = headers;
      }
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      const headers = AxiosHeaders.from(config.headers);
      headers.delete("Content-Type");
      headers.delete("content-type");
      config.headers = headers;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let errorMessage = "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.";

    if (isAxiosError(error)) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      const status = error.response?.status;
      const message =
        typeof backendMessage === "string" && backendMessage.trim().length > 0
          ? backendMessage
          : error.message;

      const shouldInvalidateSession =
        status === 401 ||
        (typeof message === "string" &&
          message.toLowerCase().includes("missing or invalid authorization"));

      if (shouldInvalidateSession) {
        await clearAuthTokens();
        notifySessionInvalidated();
      }

      if (backendMessage) {
        errorMessage = backendMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    Toast.show({
      type: "error",
      text1: "Błąd serwera",
      text2: errorMessage,
      visibilityTime: 3000,
    });

    return Promise.reject(error);
  },
);

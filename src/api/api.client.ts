import { API_BASE_URL, DEV_JWT_TOKEN } from "@/src/api/api.constants";
import { clearAuthTokens, getAccessToken } from "@/src/api/auth-token";
import { notifySessionInvalidated } from "@/src/api/session-invalidation";
import { AxiosHeaders, create, isAxiosError } from "axios";

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
    let errorMessage = "Wystapil nieoczekiwany blad. Sprobuj ponownie pozniej.";
    let errorContext = "";

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

      const method = error.config?.method?.toUpperCase() ?? "UNKNOWN";
      const requestUrl = error.config?.url ?? "unknown-url";
      const status2 = error.response?.status ?? "NO_STATUS";
      const code = error.code ?? "NO_CODE";
      errorContext = `[${method} ${requestUrl}] status=${status2} code=${code}`;
    }

    console.error("API request failed:", errorMessage, errorContext);

    return Promise.reject(error);
  },
);

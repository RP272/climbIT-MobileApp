import { apiClient } from "@/src/api/api.client";
import { isAxiosError, type AxiosRequestConfig } from "axios";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = Omit<AxiosRequestConfig, "url" | "baseURL" | "method" | "params"> & {
  method?: AxiosRequestConfig["method"];
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number | undefined>;
};

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!isAxiosError(error)) {
    return fallbackMessage;
  }

  const backendMessage = error.response?.data?.message || error.response?.data?.error;

  if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  if (typeof error.message === "string" && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      url: path,
      method: options.method ?? "GET",
      data: options.data,
      params: options.searchParams,
      headers: options.headers,
      signal: options.signal,
      responseType: options.responseType,
      withCredentials: options.withCredentials,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new ApiError(
        error.response?.status ?? 500,
        getApiErrorMessage(error, "Request failed."),
      );
    }

    throw error;
  }
}

export { apiClient };

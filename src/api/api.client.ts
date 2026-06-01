import { API_BASE_URL, DEV_JWT_TOKEN } from "@/src/api/api.constants";
import axios, { isAxiosError } from "axios";
import Toast from "react-native-toast-message";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (DEV_JWT_TOKEN) {
      config.headers.Authorization = `Bearer ${DEV_JWT_TOKEN}`;
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
  (error) => {
    let errorMessage = "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.";

    if (isAxiosError(error)) {
      // tutaj raczej na przyszlosc bo w sumie nie mamy jakiegos ustandaryzowanego sposobu na zwracanie bledów na backednzie
      const backendMessage = error.response?.data?.message || error.response?.data?.error;

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

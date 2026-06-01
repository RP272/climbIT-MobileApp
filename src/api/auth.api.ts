import { apiClient } from "@/src/api/api.client";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function signIn(credentials: AuthCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/signin", credentials);
  return response.data;
}

export async function signUp(credentials: AuthCredentials): Promise<void> {
  await apiClient.post("/auth/signup", credentials);
}

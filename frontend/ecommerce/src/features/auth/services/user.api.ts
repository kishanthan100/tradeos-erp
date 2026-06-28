import apiClient from "@/lib/apiClient";

export interface LoginPayload {
  email: string
  password: string
}


export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<LoginPayload>("/login", payload);
  return data;
}

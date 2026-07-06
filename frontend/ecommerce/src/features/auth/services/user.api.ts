import apiClient from "@/lib/apiClient";

export interface LoginPayload {
  email: string
  password: string
}

export interface CurrentUser {
  user_name: string;
  user_email: string;
  user_role: string;
}



export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<LoginPayload>("/api/login", payload);
  return data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>("/api/users/me/");
  return data;
}


export async function logout(): Promise<void> {
  await apiClient.post("/api/logout");
}


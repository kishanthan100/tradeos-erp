import apiClient from "@/lib/apiClient";

export interface User {
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  
}


export interface CreateUserPayload {
  name: string
  email: string
  role: string
  is_active: boolean
  password: string
}



export async function getUser(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>("/user/get_user");
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post<User>("/user/create_user", payload);
  return data;
}


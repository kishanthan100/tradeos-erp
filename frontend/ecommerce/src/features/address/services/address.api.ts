import apiClient from "@/lib/apiClient";

export interface Address {
  id: string;
  no: string;       
  street: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
}


export interface CreateAddressPayload {
  no: string;
  street: string;
  city: string;
  country: string;
}



export async function getAddress(): Promise<Address[]> {
  const { data } = await apiClient.get<Address[]>("/api/customer/get_address");
  return data;
}

export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  const { data } = await apiClient.post<Address>("/api/customer/create_address", payload);
  return data;
}
import apiClient from "@/lib/apiClient";

export interface Customer {
  name: string
  email: string
  contact_no: string
  is_active: boolean
  created_at: string
}


export interface CreateCustomerPayload {
  name: string
  email: string
  contact_no: string
  is_active: boolean
  address_id: string
}


export interface Address {
  id: string
  created_at: string
  
}



export async function getCustomer(): Promise<Customer[]> {
  const { data } = await apiClient.get<Customer[]>("/api/customer/get_customer");
  return data;
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const { data } = await apiClient.post<Customer>("/api/customer/create_customer", payload);
  return data;
}

export async function getAddress(): Promise<Address[]> {
  const { data } = await apiClient.get<Address[]>("/api/customer/get_address");
  return data;
}

import apiClient from "@/lib/apiClient";

export interface Product {
  name: string
  sku: string
  is_active: boolean;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string
  sku: string
  description: string
  unit_price: number
  quantity_in_stock: number
  is_active: boolean;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/api/stock/get_all_category");
  return data;
}


export async function getProduct(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>("/api/stock/get_all_product");
  return data;
}


export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await apiClient.post<Product>("/api/stock/create_product", payload);
  return data;
}

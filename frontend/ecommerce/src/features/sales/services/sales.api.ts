import apiClient from "@/lib/apiClient";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreateSalesItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateSales {
  amount: number;
  customer_id: string;
  items: CreateSalesItem[];
}


export interface Customer {
  id: string;
  name: string; 
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit_price: number;
  quantity_in_stock: number;
}


export interface Sales {
  id: string;
  name: string;
  amount: number;
  created_at: string;
}



export interface SalesItem {
  sku: string;        // from Product
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SalesDetail {
  name: string;
  amount: number;
  created_at: string;
  items: SalesItem[];
}
// ── API ───────────────────────────────────────────────────────────────────────

export async function createSales(payload: CreateSales): Promise<void> {
  console.log("sending payload:", JSON.stringify(payload, null, 2));
  await apiClient.post("/api/sales/create_sales", payload);
}


export async function getCustomers(): Promise<Customer[]> {
  const { data } = await apiClient.get<Customer[]>("/api/customer/get_customer");
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>("/api/stock/get_all_product");
  console.log("getting products:", JSON.stringify(data, null, 2));
  return data;
}


export async function getSales(): Promise<Sales[]> {
  const { data } = await apiClient.get<Sales[]>("/api/sales/get_all_sales");
  console.log("getting sales:", JSON.stringify(data, null, 2));
  return data;
}


export async function getSalesDetail(sales_id: string): Promise<SalesDetail> {
  const { data } = await apiClient.get<SalesDetail>(`/api/sales/get_sales_detail/${sales_id}`);
  console.log("getting sales detail:", JSON.stringify(data, null, 2));
  return data;
}

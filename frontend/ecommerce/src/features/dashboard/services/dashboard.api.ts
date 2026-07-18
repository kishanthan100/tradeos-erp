import apiClient from "@/lib/apiClient";

export interface SalesByYear {
  day: number;
  total_amount: number;
}

export interface TopCustomerBySales {
  name: string;
  total_amount: number;
}

export interface DashboardData {
  total_sales_amount: number;
  sales_count: number;
  customers_count: number;
  sales_by_year: SalesByYear[];
  top_customers_by_sales: TopCustomerBySales[];
  
}

export async function getDashboardData() {
  const response = await apiClient.get<DashboardData>("/api/dashboard/data");
  console.log("Dashboard data:", response.data.top_customers_by_sales);
  return response.data;
}
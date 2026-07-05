import { useQuery } from "@tanstack/react-query";
import { getSalesDetail } from "../services/sales.api";


export function useSalesDetails(sales_id: string) {
  return useQuery({
    queryKey: ["sales", sales_id],
    queryFn: () => getSalesDetail(sales_id),
  });
}

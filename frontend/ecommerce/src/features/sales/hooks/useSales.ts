import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createSales } from "@/features/sales/services/sales.api";
import { getSales } from "@/features/sales/services/sales.api";
 

export function useCreateSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSales,
    onSuccess: () => {
      // this auto-refreshes the table after create
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}


export function useGetSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });
}

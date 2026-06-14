import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, createProduct } from "../services/stock.api";

export function useProduct() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: getProduct,
  });
}


export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // this auto-refreshes the table after create
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

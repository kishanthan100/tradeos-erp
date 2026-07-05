import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCategories, createCategory } from "../services/stock.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}


export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // this auto-refreshes the table after create
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
}
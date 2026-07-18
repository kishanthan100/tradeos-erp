import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSaleItems } from "../services/sales.api";
import type { SaleUpdateRequest } from "../services/sales.api";

export function useUpdateSaleItems(salesId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaleUpdateRequest) => updateSaleItems(salesId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-detail", salesId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
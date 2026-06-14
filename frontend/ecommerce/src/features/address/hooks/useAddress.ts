import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { getAddress, createAddress } from "../services/address.api";

export function useAddress() {
  return useQuery({
    queryKey: ["address"],
    queryFn: getAddress,
  });
}


export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      // this auto-refreshes the table after create
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });
}
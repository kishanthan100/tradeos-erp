import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomer, createCustomer, getAddress } from "@/features/customers/services/customer.api";

export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: getCustomer,
  });
}


export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      // this auto-refreshes the table after create
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
}


export function useGetAddress() {
  return useQuery({
    queryKey: ["address"],
    queryFn: getAddress,
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, createUser } from "@/features/users/services/user.api.ts";


export function UseUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });
}


export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // this auto-refreshes the table after create
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
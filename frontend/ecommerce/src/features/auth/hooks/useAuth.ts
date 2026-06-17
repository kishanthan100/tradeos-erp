import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { login } from "../services/user.api";


export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

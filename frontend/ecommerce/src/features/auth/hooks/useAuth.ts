import { useMutation,  useQueryClient, useQuery } from "@tanstack/react-query";
import { login, logout , getCurrentUser} from "../services/user.api";


export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}



export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}




export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false, // don't retry on 401
  });
}
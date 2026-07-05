import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/sales.api";

export function useCustomers() {
    return useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });
}
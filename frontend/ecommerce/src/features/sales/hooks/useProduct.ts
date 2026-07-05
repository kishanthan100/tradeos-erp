import { getProducts } from "../services/sales.api";
import { useQuery } from "@tanstack/react-query";

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });
}
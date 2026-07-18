import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/dashboard.api";

export function useDashboard() {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardData,
    });
}



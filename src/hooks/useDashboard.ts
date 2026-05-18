"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { dashboardService } from "@/lib/services/client/dashboardService";

export function useDashboard(yearId?: string) {
  const query = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD(yearId || "none"),
    queryFn: () => dashboardService.getStats(yearId!),
    enabled: !!yearId,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

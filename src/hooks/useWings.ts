"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { wingService } from "@/lib/services/client/wingService";

export function useWings(yearId?: string) {
  const query = useQuery({
    queryKey: QUERY_KEYS.WINGS(yearId || "none"),
    queryFn: () => wingService.getByYear(yearId!),
    enabled: !!yearId,
  });

  return {
    wings: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

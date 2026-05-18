"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { yearService } from "@/lib/services/client/yearService";

export function useYears() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.YEARS],
    queryFn: () => yearService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    years: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

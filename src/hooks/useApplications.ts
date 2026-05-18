"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { applicationService } from "@/lib/services/client/applicationService";

export function useApplications(yearId?: string) {
  const query = useQuery({
    queryKey: QUERY_KEYS.APPLICATIONS(yearId || "none"),
    queryFn: () => applicationService.getByYear(yearId!),
    enabled: !!yearId,
  });

  return {
    applications: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

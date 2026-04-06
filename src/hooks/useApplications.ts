"use client";

import { useQuery } from "@tanstack/react-query";
import { Application } from "@/lib/interfaces/core";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

export function useApplications(yearId?: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS(yearId || "active")],
    queryFn: async () => {
      const url = yearId ? `/api/applications?yearId=${yearId}` : "/api/applications";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch applications");
      const json = await res.json();
      return json.data as Application[];
    },
  });

  return {
    applications: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { AcademicYear } from "@/lib/interfaces/core";
import { auth } from "@/lib/firebase/client";

export function useYears() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.YEARS],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      const token = await user.getIdToken();
      const res = await fetch(API_ENDPOINTS.years.list(), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch years");
      }
      const json = await res.json();
      return json.data as AcademicYear[];
    },
    // Optional: add retry logic or staleTime
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    years: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { AcademicYear } from "@/lib/interfaces/core";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

export function useYear(id: string) {
  const query = useQuery({
    queryKey: ["year", id],
    queryFn: async () => {
      const res = await fetch(`/api/years/${id}`);
      if (!res.ok) throw new Error("Failed to fetch year");
      const json = await res.json();
      return json.data as AcademicYear;
    },
    enabled: !!id,
  });

  return {
    year: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

import { apiClient } from "@/lib/api/apiClient";
import { Wing } from "@/lib/interfaces/core";

/**
 * Client-side service for Wing operations.
 */
export const wingService = {
  getByYear: (yearId: string) =>
    apiClient.get<Wing[]>(`/api/wings?yearId=${yearId}`),

  create: (data: { name: string; headName: string; headEmail: string; headPhone: string; yearId: string }) =>
    apiClient.post<Wing>("/api/wings", data),

  update: (id: string, data: Partial<Wing> & { yearId: string }) =>
    apiClient.put<Wing>(`/api/wings/${id}`, data),
};

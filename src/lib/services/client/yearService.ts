import { apiClient } from "@/lib/api/apiClient";
import { AcademicYear, YearStatus } from "@/lib/interfaces/core";

/**
 * Client-side service for Academic Year operations.
 * All admin pages call this — never authFetch directly.
 */
export const yearService = {
  getAll: () => apiClient.get<AcademicYear[]>("/api/years"),

  getById: (id: string) => apiClient.get<AcademicYear>(`/api/years/${id}`),

  updateStatus: (id: string, status: YearStatus) =>
    apiClient.put<{ id: string; status: YearStatus }>(`/api/years/${id}`, { status }),

  update: (id: string, data: Partial<AcademicYear>) =>
    apiClient.put<{ id: string }>(`/api/years/${id}`, data),

  setup: (data: {
    label: string;
    description: string;
    openDate: string;
    deadline: string;
    wings: Array<{ name: string; headName: string; headEmail: string; headPhone: string }>;
    rubric: Array<{ name: string; weight: number; description: string }>;
  }) => apiClient.post<AcademicYear>("/api/years/setup", data),
};

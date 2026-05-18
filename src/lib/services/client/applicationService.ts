import { apiClient } from "@/lib/api/apiClient";
import { Application, ApplicationStatus } from "@/lib/interfaces/core";

/**
 * Client-side service for Application operations.
 */
export const applicationService = {
  getByYear: (yearId: string) =>
    apiClient.get<Application[]>(`/api/applications?yearId=${yearId}`),

  getById: (id: string) =>
    apiClient.get<{
      application: Application;
      rubric: Array<{ name: string; weight: number; description: string }>;
      isBlind: boolean;
      myScore?: { criteriaScores: Record<string, number>; comments: string };
    }>(`/api/applications/${id}`),

  updateStatus: (id: string, status: ApplicationStatus) =>
    apiClient.put<Application>(`/api/applications/${id}`, { status }),

  submitScore: (id: string, data: { criteriaScores: Record<string, number>; comments: string }) =>
    apiClient.post<void>(`/api/applications/${id}/score`, data),
};

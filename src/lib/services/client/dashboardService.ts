import { apiClient } from "@/lib/api/apiClient";

export interface DashboardStats {
  totalApplications: number;
  pendingEndorsement: number;
  endorsed: number;
  inReview: number;
  shortlisted: number;
  awarded: number;
  totalWings: number;
  activeWings: number;
}

/**
 * Client-side service for Dashboard operations.
 */
export const dashboardService = {
  getStats: (yearId: string) =>
    apiClient.get<DashboardStats>(`/api/dashboard?yearId=${yearId}`),
};

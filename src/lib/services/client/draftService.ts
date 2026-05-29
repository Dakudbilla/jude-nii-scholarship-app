import { publicClient } from "@/lib/api/publicClient";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApplicationDraft } from "@/lib/interfaces/core";

export interface ApplicationStatusResult {
  exists: boolean;
  status?: string;
  yearLabel?: string;
}

export const draftService = {
  /**
   * Initialise or retrieve a draft for the given student/year pair.
   * Creates a new draft if one does not exist yet.
   */
  init: (yearId: string, studentId: string, email: string) =>
    publicClient.post<ApplicationDraft>(API_ENDPOINTS.drafts.save(), {
      yearId,
      studentId,
      email,
    }),

  /**
   * Load the current saved draft.
   */
  load: (yearId: string, studentId: string, email: string) =>
    publicClient.get<ApplicationDraft>(
      `${API_ENDPOINTS.drafts.save()}?yearId=${yearId}&studentId=${studentId}&email=${email}`
    ),

  /**
   * Persist a partial update to the draft (step data or currentStep).
   */
  save: (
    yearId: string,
    studentId: string,
    email: string,
    updateData: Partial<ApplicationDraft>
  ) =>
    publicClient.post<ApplicationDraft>(API_ENDPOINTS.drafts.save(), {
      yearId,
      studentId,
      email,
      updateData,
    }),

  /**
   * Submit the finalised draft as an application.
   */
  submit: (yearId: string, studentId: string, draftPayload: Partial<ApplicationDraft>) =>
    publicClient.post<{ id: string }>(API_ENDPOINTS.applications.submit(), {
      yearId,
      studentId,
      draftPayload,
    }),

  /**
   * Check application status by student ID + email (public lookup).
   */
  checkStatus: (studentId: string, email: string) =>
    publicClient.post<ApplicationStatusResult>(API_ENDPOINTS.applications.status(), {
      studentId,
      email,
    }),
};

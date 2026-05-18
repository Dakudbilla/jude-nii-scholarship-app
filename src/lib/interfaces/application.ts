/**
 * Strong sub-types for Application payload fields.
 * These replace the `any` types previously used in `Application` and `ApplicationDraft`.
 */

export interface PersonalInfo {
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  hometown?: string;
  phoneNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface AcademicInfo {
  programme: string;
  year: string | number;
  indexNumber?: string;
  faculty?: string;
}

export interface FinancialInfo {
  sponsorStatus: string;
  hasOtherScholarship: boolean;
  hardshipEssay: string;
  churchEssay: string;
}

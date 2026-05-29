// Timestamps arrive in different shapes depending on whether you're reading from
// the Admin SDK (serialised JSON: { _seconds, _nanoseconds }) or the Client SDK
// (Timestamp object with .toDate()). We use `unknown` and let lib/utils/date.ts
// normalise them — avoids unsafe `any` while staying compatible with both SDKs.

import type { PersonalInfo, AcademicInfo, FinancialInfo } from "./application";

export type YearStatus = "SETUP" | "OPEN" | "REVIEW" | "CLOSED";

export interface AcademicYear {
  id: string;
  label: string;
  status: YearStatus;
  openDate: unknown;
  deadline: unknown;
  description: string;
  rubric: RubricCriterion[];
  blindReview: boolean;
  messagingTemplates?: Record<string, string>;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface RubricCriterion {
  name: string;
  weight: number;
  description: string;
}

export interface Wing {
  id: string;
  yearId: string;
  name: string;
  isActive: boolean;
  headName: string;
  headPhone: string;
  headEmail: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  adminId: string;
  adminName: string;
  previousValue?: unknown;
  newValue?: unknown;
  timestamp: unknown;
}

export interface ApplicationDraft {
  id: string;           // yearId_studentId
  yearId: string;
  studentId: string;
  email: string;
  currentStep: number;  // 1-4
  personalInfo?: Partial<PersonalInfo>;
  academicInfo?: Partial<AcademicInfo>;
  financialInfo?: Partial<FinancialInfo>;
  wingSelection?: string;
  updatedAt: unknown;
}

export type ApplicationStatus =
  | "PENDING_ENDORSEMENT"
  | "ENDORSED"
  | "REJECTED_BY_WING"
  | "IN_REVIEW"
  | "INTERVIEW"
  | "REJECTED"
  | "AWARDED";

export interface Application {
  id: string;
  yearId: string;
  studentId: string;
  email: string;
  status: ApplicationStatus;

  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo & { cwa?: number };
  financialInfo: FinancialInfo;
  wingId: string;

  endorsementToken: string;
  endorsementTokenExpiresAt: unknown;

  wingHeadComments?: string;

  blindId?: string;
  reviewScore?: number;

  createdAt: unknown;
  updatedAt: unknown;
}

// ── Repository contracts ──────────────────────────────────────────────────────

export interface IYearRepository {
  getById(id: string): Promise<AcademicYear | null>;
  getAll(): Promise<AcademicYear[]>;
  getActiveYear(): Promise<AcademicYear | null>;
  create(data: Omit<AcademicYear, "id" | "createdAt" | "updatedAt">): Promise<AcademicYear>;
  update(id: string, data: Partial<AcademicYear>): Promise<void>;
}

export interface IWingRepository {
  getByYearId(yearId: string): Promise<Wing[]>;
  create(yearId: string, data: Omit<Wing, "id" | "yearId">): Promise<Wing>;
  update(id: string, yearId: string, data: Partial<Wing>): Promise<void>;
  createBatch(yearId: string, wings: Omit<Wing, "id" | "yearId">[]): Promise<void>;
}

export interface IAuditLogRepository {
  createAdminLog(data: Omit<AuditLog, "id" | "timestamp">): Promise<void>;
  getLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
}

export interface IDraftRepository {
  getDraft(yearId: string, studentId: string): Promise<ApplicationDraft | null>;
  saveDraft(yearId: string, studentId: string, email: string, data: Partial<ApplicationDraft>): Promise<void>;
  deleteDraft(yearId: string, studentId: string): Promise<void>;
}

export interface IApplicationRepository {
  getById(id: string): Promise<Application | null>;
  getByYear(yearId: string): Promise<Application[]>;
  getByStudent(yearId: string, studentId: string): Promise<Application[]>;
  create(data: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application>;
  updateStatus(id: string, status: ApplicationStatus): Promise<void>;
}

export interface IEndorsementRepository {
  getApplicationByToken(token: string): Promise<Application | null>;
  endorseApplication(id: string, decision: "ENDORSED" | "REJECTED_BY_WING", comments?: string): Promise<void>;
}

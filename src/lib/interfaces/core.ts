// We use 'any' or 'Date' for timestamps to avoid strict union clashes between client SDK (firebase/firestore) and Admin SDK (firebase-admin)

export type YearStatus = "SETUP" | "OPEN" | "REVIEW" | "CLOSED";

export interface AcademicYear {
  id: string;
  label: string;
  status: YearStatus;
  openDate: any;
  deadline: any;
  description: string;
  rubric: RubricCriterion[];
  blindReview: boolean;
  messagingTemplates?: any;
  createdAt: any;
  updatedAt: any;
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
  previousValue?: any;
  newValue?: any;
  timestamp: any;
}

export interface ApplicationDraft {
  id: string;             // yearId_studentId
  yearId: string;
  studentId: string;      // typically matriculation/reference number
  email: string;
  currentStep: number;    // 1-4
  personalInfo?: any;
  academicInfo?: any;
  financialInfo?: any;
  wingSelection?: string;
  updatedAt: any;
}

export type ApplicationStatus = "PENDING_ENDORSEMENT" | "ENDORSED" | "REJECTED_BY_WING" | "IN_REVIEW" | "INTERVIEW" | "REJECTED" | "AWARDED";

export interface Application {
  id: string;             // Auto-generated Firestore ID
  yearId: string;
  studentId: string;
  email: string;
  status: ApplicationStatus;
  
  // Payload from draft
  personalInfo: any;
  academicInfo: any;
  financialInfo: any;
  wingId: string;
  
  // Generated on submission
  endorsementToken: string;
  endorsementTokenExpiresAt: any;
  
  // Endorsement
  wingHeadComments?: string;

  // Assessment
  blindId?: string;       // Anonymized ID generated on submission
  reviewScore?: number;
  
  createdAt: any;
  updatedAt: any;
}

// Repositories

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

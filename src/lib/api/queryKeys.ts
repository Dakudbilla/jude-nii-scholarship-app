/**
 * Single source of truth for all React Query cache keys.
 * Every hook MUST use these — no hardcoded strings in page files.
 */
export const QUERY_KEYS = {
  YEARS: "years",
  ACTIVE_YEAR: "activeYear",
  WINGS: (yearId: string) => ["wings", yearId],
  DRAFT: (studentId: string | undefined) => ["draft", studentId],
  APPLICATIONS: (yearId: string) => ["applications", yearId],
  APPLICATION: (appId: string) => ["application", appId],
  DASHBOARD: (yearId: string) => ["dashboard", yearId],
  AUDIT_LOGS: (entityId: string) => ["auditLogs", entityId],
} as const;

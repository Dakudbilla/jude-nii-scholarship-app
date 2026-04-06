export const QUERY_KEYS = {
  YEARS: "years",
  ACTIVE_YEAR: "activeYear",
  WINGS: (yearId: string) => ["wings", yearId],
  DRAFT: (studentId: string | undefined) => ["draft", studentId],
  APPLICATIONS: (yearId: string) => ["applications", yearId],
  APPLICATION: (appId: string) => ["application", appId],
  AUDIT_LOGS: (entityId: string) => ["auditLogs", entityId]
} as const;

import { auditLogRepository } from "../repositories/AuditLogRepository";
import { AuthContext } from "../auth/middleware";

export class AuditLogService {
  /**
   * Logs an administrative action in the system.
   * Required to be called on every status change, config change, or score save.
   */
  static async record(
    admin: AuthContext,
    entityType: "AcademicYear" | "Application" | "Wing" | "ReviewScore" | "Award",
    entityId: string,
    action: string,
    previousValue?: unknown,
    newValue?: unknown
  ): Promise<void> {
    try {
      await auditLogRepository.createAdminLog({
        entityType,
        entityId,
        action,
        adminId: admin.uid,
        adminName: admin.email, // Best effort since we don't store admin full names yet
        previousValue,
        newValue
      });
    } catch (error) {
      // We don't want audit log failures to crash the main transaction, 
      // but we must log them explicitly.
      console.error("[CRITICAL] Failed to write audit log:", { entityType, entityId, action, error });
    }
  }
}

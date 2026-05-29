import { withAdminAuth } from "@/lib/auth/middleware";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AwardService } from "@/lib/services/AwardService";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { auditLogRepository } from "@/lib/repositories/AuditLogRepository";

export const POST = withAdminAuth(async (req, _context, authContext) => {
  try {
    const body = await req.json();
    const { yearId } = body as { yearId: string };

    if (!yearId) {
      return apiError("yearId is required", 400);
    }

    const year = await yearRepository.getById(yearId);
    if (!year) {
      return apiError("Academic year not found", 404);
    }

    if (year.status !== "REVIEW") {
      return apiError(
        `Awards can only be published when the cycle is in REVIEW status. Current status: ${year.status}`,
        409
      );
    }

    const result = await AwardService.publishAwards(yearId, authContext.uid);

    await auditLogRepository.createAdminLog({
      entityType: "academicYear",
      entityId: yearId,
      action: "AWARDS_PUBLISHED",
      adminId: authContext.uid,
      adminName: authContext.email,
      newValue: { awardCount: result.count, publishedAt: result.publishedAt },
    });

    // Close the cycle after publishing awards
    await yearRepository.update(yearId, { status: "CLOSED" });

    return apiSuccess({ ...result, yearStatus: "CLOSED" });
  } catch (error) {
    console.error("Failed to publish awards:", error);
    return apiError("Internal Server Error", 500);
  }
});

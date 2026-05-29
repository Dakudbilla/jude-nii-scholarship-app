import { withAdminAuth } from "@/lib/auth/middleware";
import { apiError, apiSuccess } from "@/lib/api/response";
import { wingRepository } from "@/lib/repositories/WingRepository";
import { AuditLogService } from "@/lib/services/AuditLogService";

// PUT /api/wings/[id] — update wing details (headName, headEmail, headPhone, isActive)
export const PUT = withAdminAuth(async (req, context, authContext) => {
  try {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id: wingId } = await params;

    const body = await req.json();
    const { yearId, headName, headEmail, headPhone, isActive, name } = body;

    if (!yearId) {
      return apiError("yearId is required to locate the wing", 400);
    }

    const updates: Partial<import("@/lib/interfaces/core").Wing> = {};
    if (headName !== undefined) updates.headName = headName;
    if (headEmail !== undefined) updates.headEmail = headEmail;
    if (headPhone !== undefined) updates.headPhone = headPhone;
    if (isActive !== undefined) updates.isActive = isActive;
    if (name !== undefined) updates.name = name;

    if (Object.keys(updates).length === 0) {
      return apiError("No valid fields provided for update", 400);
    }

    await wingRepository.update(wingId, yearId, updates);

    // Record audit log
    await AuditLogService.record(
      authContext,
      "Wing",
      wingId,
      "UPDATE_WING",
      null,
      updates
    );

    return apiSuccess({ id: wingId, ...updates });
  } catch (error) {
    console.error("Failed to update wing:", error);
    return apiError("Internal Server Error", 500);
  }
});

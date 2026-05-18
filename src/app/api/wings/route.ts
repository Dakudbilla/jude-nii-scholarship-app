import { wingRepository } from "@/lib/repositories/WingRepository";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";
import { withAdminAuth } from "@/lib/auth/middleware";
import { AuditLogService } from "@/lib/services/AuditLogService";

// GET /api/wings?yearId=
// Public route — returns active wings for a given academic year.
// Used by the application form so applicants can select their wing.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const yearId = searchParams.get("yearId");

    if (!yearId) {
      return apiError("yearId query param is required", 400);
    }

    const year = await yearRepository.getById(yearId);
    if (!year) {
      return apiError("Academic year not found", 404);
    }

    const wings = await wingRepository.getByYearId(yearId);
    const activeWings = wings.filter((w) => w.isActive);

    return apiSuccess(activeWings);
  } catch (error) {
    console.error("Failed to fetch wings:", error);
    return apiError("Internal Server Error", 500);
  }
}

// POST /api/wings — create a new wing manually
export const POST = withAdminAuth(async (req, context, authContext) => {
  try {
    const body = await req.json();
    const { name, headName, headPhone, headEmail, yearId } = body;

    if (!yearId || !name || !headEmail) {
      return apiError("yearId, name, and headEmail are required", 400);
    }

    const wingData = {
      name,
      headName: headName || "",
      headPhone: headPhone || "",
      headEmail,
      isActive: true,
    };

    const newWing = await wingRepository.create(yearId, wingData);

    await AuditLogService.record(
      authContext,
      "Wing",
      newWing.id,
      "CREATE_WING",
      null,
      wingData
    );

    return apiSuccess(newWing);
  } catch (error) {
    console.error("Failed to create wing:", error);
    return apiError("Internal Server Error", 500);
  }
});

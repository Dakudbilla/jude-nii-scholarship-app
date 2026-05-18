import { withAdminAuth } from "@/lib/auth/middleware";
import { apiError, apiSuccess } from "@/lib/api/response";
import { applicationRepository } from "@/lib/repositories/ApplicationRepository";
import { wingRepository } from "@/lib/repositories/WingRepository";

export const GET = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const yearId = searchParams.get("yearId");

    if (!yearId) {
      return apiError("yearId is required", 400);
    }

    const applications = await applicationRepository.getByYear(yearId);
    const wings = await wingRepository.getByYearId(yearId);

    const stats = {
      totalApplications: applications.length,
      pendingEndorsement: applications.filter(a => a.status === "PENDING_ENDORSEMENT").length,
      endorsed: applications.filter(a => a.status === "ENDORSED").length,
      inReview: applications.filter(a => a.status === "IN_REVIEW").length,
      shortlisted: applications.filter(a => a.status === "INTERVIEW").length,
      awarded: applications.filter(a => a.status === "AWARDED").length,
      totalWings: wings.length,
      activeWings: wings.filter(w => w.isActive).length,
    };

    return apiSuccess(stats);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return apiError("Internal Server Error", 500);
  }
});

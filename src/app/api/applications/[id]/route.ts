import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";
import { applicationRepository } from "@/lib/repositories/ApplicationRepository";
import { reviewScoreRepository } from "@/lib/repositories/ReviewScoreRepository";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

export const GET = withAdminAuth(async (req, context, authContext) => {
  try {
    const { params } = context as { params: { id: string } };
    const appId = await params.id;
    
    const application = await applicationRepository.getById(appId);
    if (!application) {
      return apiError("Application not found", 404);
    }
    
    // Also fetch the review scores tied to this application
    const scores = await reviewScoreRepository.getByApplication(appId);
    
    // Check if the current admin has a score
    const myScore = scores.find(s => s.adminId === authContext.uid) || null;

    // Fetch year context for scoring rubric and blind setting
    const year = await yearRepository.getById(application.yearId);

    return apiSuccess({
      application,
      rubric: year?.rubric || [],
      isBlind: year?.blindReview ?? false,
      scores,
      myScore
    });
  } catch (error) {
    console.error("Failed to load application:", error);
    return apiError("Internal Server Error", 500);
  }
});

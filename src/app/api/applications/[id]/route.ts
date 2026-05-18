import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";
import { applicationRepository } from "@/lib/repositories/ApplicationRepository";
import { reviewScoreRepository } from "@/lib/repositories/ReviewScoreRepository";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";
import { ApplicationStatus } from "@/lib/interfaces/core";

// GET /api/applications/[id]
export const GET = withAdminAuth(async (req, context, authContext) => {
  try {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id: appId } = await params;

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

// PUT /api/applications/[id] — update application status
const VALID_STATUSES: ApplicationStatus[] = [
  "PENDING_ENDORSEMENT", "ENDORSED", "REJECTED_BY_WING",
  "IN_REVIEW", "INTERVIEW", "REJECTED", "AWARDED",
];

export const PUT = withAdminAuth(async (req, context, authContext) => {
  try {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id: appId } = await params;

    const body = await req.json();
    const { status } = body as { status: ApplicationStatus };

    if (!status || !VALID_STATUSES.includes(status)) {
      return apiError(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    const application = await applicationRepository.getById(appId);
    if (!application) {
      return apiError("Application not found", 404);
    }

    await applicationRepository.updateStatus(appId, status);

    return apiSuccess({ id: appId, status });
  } catch (error) {
    console.error("Failed to update application status:", error);
    return apiError("Internal Server Error", 500);
  }
});

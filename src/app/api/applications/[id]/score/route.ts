import { withAdminAuth } from "@/lib/auth/middleware";
import { reviewScoreRepository } from "@/lib/repositories/ReviewScoreRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

export const POST = withAdminAuth(async (req, context, authContext) => {
  try {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id: appId } = await params;
    
    const body = await req.json();
    const { criteriaScores, comments } = body;
    
    if (!criteriaScores) {
      return apiError("Scoring criteria required", 400);
    }
    
    // Calculate total score based on the values
    // In a real implementation we would validate against weights, but here we just sum
    const totalScore = Object.values(criteriaScores as Record<string, number>).reduce((acc, val) => acc + val, 0);

    await reviewScoreRepository.saveScore(appId, authContext.uid, authContext.email || "Admin", {
      criteriaScores,
      comments,
      totalScore,
    });

    return apiSuccess({ success: true, totalScore });
  } catch (error) {
    console.error("Failed to save score:", error);
    return apiError("Internal Server Error", 500);
  }
});

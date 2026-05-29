import { ApplicationService } from "@/lib/services/ApplicationService";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

// POST /api/applications/submit
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { yearId, studentId, draftPayload } = payload;
    
    if (!yearId || !studentId || !draftPayload) {
      return apiError("Required parameters missing", 400);
    }
    
    // Verify active year
    const year = await yearRepository.getById(yearId);
    if (!year || year.status !== "OPEN") {
      return apiError("Applications are not currently open", 403);
    }
    
    // Idempotent Transactional Submission (Checks draft, deletes it, creates App)
    const application = await ApplicationService.submit(yearId, studentId, draftPayload);
    
    return apiSuccess({ 
      applicationId: application.id, 
      status: application.status 
    });
  } catch (error) {
    console.error("Submission failed:", error);
    const message = error instanceof Error ? error.message : "Failed to submit application";
    return apiError(message, 500);
  }
}

import { NextResponse } from "next/server";
import { endorsementRepository } from "@/lib/repositories/EndorsementRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

export async function GET(req: Request, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params;

    const application = await endorsementRepository.getApplicationByToken(token);
    if (!application) {
      return apiError("Invalid, expired, or already processed endorsement link.", 404);
    }
    
    // We don't expose full docs, just the information needed to endorse
    return apiSuccess({
      id: application.id,
      studentName: application.personalInfo?.fullName,
      studentId: application.studentId,
      programme: application.academicInfo?.programme,
      churchEssay: application.financialInfo?.churchEssay,
      status: application.status,
    });
  } catch (error) {
    console.error("Failed to load endorsement:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function POST(req: Request, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params;
    const body = await req.json();
    const { decision, comments } = body;
    
    if (decision !== "ENDORSED" && decision !== "REJECTED_BY_WING") {
      return apiError("Invalid decision type.", 400);
    }

    const application = await endorsementRepository.getApplicationByToken(token);
    if (!application) {
      return apiError("Invalid or expired endorsement link.", 404);
    }
    
    await endorsementRepository.endorseApplication(application.id, decision, comments);
    
    return apiSuccess({ success: true });
  } catch (error) {
    console.error("Failed to submit endorsement:", error);
    return apiError("Internal Server Error", 500);
  }
}

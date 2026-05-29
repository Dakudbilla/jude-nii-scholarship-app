import { draftRepository } from "@/lib/repositories/DraftRepository";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

// GET /api/drafts?yearId=&studentId=&email=
// Fetches or initialises a draft for the applicant. Safe to use in useQuery.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const yearId = searchParams.get("yearId");
    const studentId = searchParams.get("studentId");
    const email = searchParams.get("email");

    if (!yearId || !studentId || !email) {
      return apiError("Year, Student ID, and Email query params are required", 400);
    }

    const year = await yearRepository.getById(yearId);
    if (!year || year.status !== "OPEN") {
      return apiError("Applications are not currently open for this cycle", 403);
    }

    let draft = await draftRepository.getDraft(yearId, studentId);

    if (!draft) {
      draft = {
        id: `${yearId}_${studentId}`,
        yearId,
        studentId,
        email,
        currentStep: 1,
        personalInfo: {},
        academicInfo: {},
        financialInfo: {},
        wingSelection: "",
        updatedAt: new Date(),
      };
      await draftRepository.saveDraft(yearId, studentId, email, draft);
    } else {
      if (draft.email.toLowerCase() !== email.toLowerCase()) {
        return apiError("Student ID already associated with a different email", 403);
      }
    }

    return apiSuccess(draft);
  } catch (error) {
    console.error("Draft GET failed:", error);
    return apiError("Internal Server Error", 500);
  }
}

// POST /api/drafts
// Saves (updates) an existing draft OR initialises one (legacy path used by ApplicantLogin).
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { yearId, studentId, email, updateData } = payload;
    
    if (!yearId || !studentId || !email) {
      return apiError("Year, Student ID, and Email are required", 400);
    }

    // Verify year is actually receiving applications
    const year = await yearRepository.getById(yearId);
    if (!year || year.status !== "OPEN") {
      return apiError("Applications are not currently open for this cycle", 403);
    }
    
    if (updateData) {
      // It's a save operation
      await draftRepository.saveDraft(yearId, studentId, email, updateData);
      return apiSuccess({ success: true });
    } else {
      // It's a load/init operation
      let draft = await draftRepository.getDraft(yearId, studentId);
      
      if (!draft) {
        // Initialize empty draft
        draft = {
          id: `${yearId}_${studentId}`,
          yearId,
          studentId,
          email,
          currentStep: 1,
          personalInfo: {},
          academicInfo: {},
          financialInfo: {},
          wingSelection: "",
          updatedAt: new Date()
        };
        await draftRepository.saveDraft(yearId, studentId, email, draft);
      } else {
        // Security check: Make sure email matches to prevent easy guessing
        if (draft.email.toLowerCase() !== email.toLowerCase()) {
          return apiError("Student ID already associated with a different email", 403);
        }
      }
      
      return apiSuccess(draft);
    }

  } catch (error) {
    console.error("Draft operation failed:", error);
    return apiError("Internal Server Error", 500);
  }
}

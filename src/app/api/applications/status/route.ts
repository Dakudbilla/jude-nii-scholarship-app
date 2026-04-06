import { applicationRepository } from "@/lib/repositories/ApplicationRepository";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { studentId, email } = payload;
    
    if (!studentId || !email) {
      return apiError("Student ID and Email are required", 400);
    }

    const activeYear = await yearRepository.getActiveYear();
    if (!activeYear) {
      return apiError("No active academic year found", 404);
    }
    
    // Attempt to locate an application
    const applications = await applicationRepository.getByStudent(activeYear.id, studentId);
    
    if (applications.length === 0) {
      return apiSuccess({ exists: false });
    }
    
    const app = applications[0];
    if (!app) {
      return apiSuccess({ exists: false });
    }
    
    if (app.email.toLowerCase() !== email.toLowerCase()) {
      return apiError("Invalid credentials for this application", 403);
    }
    
    // Strip sensitive backend info (like token docs)
    return apiSuccess({
      exists: true,
      id: app.id,
      status: app.status,
      yearLabel: activeYear.label,
      updatedAt: app.updatedAt,
    });

  } catch (error) {
    console.error("Status check failed:", error);
    return apiError("Internal Server Error", 500);
  }
}

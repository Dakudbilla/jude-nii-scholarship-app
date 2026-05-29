import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

// GET /api/years/active
export async function GET() {
  try {
    const activeYear = await yearRepository.getActiveYear();
    if (!activeYear) {
      return apiSuccess({ status: "NONE" });
    }
    
    // We only return safe, public fields to unauthenticated users
    return apiSuccess({
      id: activeYear.id,
      label: activeYear.label,
      status: activeYear.status,
      description: activeYear.description,
      openDate: activeYear.openDate,
      deadline: activeYear.deadline,
    });
  } catch (error) {
    console.error("Failed to fetch active year:", error);
    return apiError("Internal Server Error", 500);
  }
}

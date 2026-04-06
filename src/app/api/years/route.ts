import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

// GET /api/years (List all years)
export const GET = withAuth(async (req, context, authContext) => {
  try {
    const years = await yearRepository.getAll();
    return apiSuccess(years);
  } catch (error) {
    console.error("Failed to fetch years:", error);
    return apiError("Internal Server Error", 500);
  }
});

import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";
import { applicationRepository } from "@/lib/repositories/ApplicationRepository";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";

export const GET = withAdminAuth(async (req, context, authContext) => {
  try {
    const { searchParams } = new URL(req.url);
    let yearId = searchParams.get("yearId");
    
    // If no year specified, fallback to active year
    if (!yearId) {
      const activeYear = await yearRepository.getActiveYear();
      if (!activeYear) return apiSuccess([]);
      yearId = activeYear.id;
    }

    const applications = await applicationRepository.getByYear(yearId);
    
    // We don't blind review in the list view typically, but we should strip secure tokens
    const safeApps = applications.map(app => {
      const { endorsementToken, endorsementTokenExpiresAt, ...safeApp } = app as any;
      return safeApp;
    });

    return apiSuccess(safeApps);
  } catch (error) {
    console.error("Failed to load applications:", error);
    return apiError("Internal Server Error", 500);
  }
});

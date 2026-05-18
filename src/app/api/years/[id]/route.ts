import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/middleware";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { apiError, apiSuccess } from "@/lib/api/response";
import { YearStatus } from "@/lib/interfaces/core";

const VALID_STATUSES: YearStatus[] = ["SETUP", "OPEN", "REVIEW", "CLOSED"];

// PUT /api/years/[id]
export const PUT = withAdminAuth(async (req, context, authContext) => {
  try {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id: yearId } = await params;

    const body = await req.json();
    const { status, label, description, blindReview } = body;

    const year = await yearRepository.getById(yearId);
    if (!year) {
      return apiError("Academic year not found", 404);
    }

    const updates: any = {};
    if (status) {
      if (!VALID_STATUSES.includes(status as YearStatus)) {
        return apiError(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400);
      }
      updates.status = status;

      if (status !== "CLOSED") {
        const allYears = await yearRepository.getAll();
        const otherActiveYears = allYears.filter(y => y.id !== yearId && y.status !== "CLOSED");
        for (const oy of otherActiveYears) {
          await yearRepository.update(oy.id, { status: "CLOSED" });
        }
      }
    }
    
    if (label !== undefined) updates.label = label;
    if (description !== undefined) updates.description = description;
    if (blindReview !== undefined) updates.blindReview = blindReview;

    await yearRepository.update(yearId, updates);

    return apiSuccess({ id: yearId, ...updates });
  } catch (error) {
    console.error("Failed to update academic year:", error);
    return apiError("Internal Server Error", 500);
  }
});

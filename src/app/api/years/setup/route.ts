import { withAdminAuth } from "@/lib/auth/middleware";
import { apiError, apiSuccess } from "@/lib/api/response";
import { yearRepository } from "@/lib/repositories/YearRepository";
import { wingRepository } from "@/lib/repositories/WingRepository";
import { AuditLogService } from "@/lib/services/AuditLogService";
import { Timestamp } from "firebase-admin/firestore";

export const POST = withAdminAuth(async (req, context, authContext) => {
  try {
    const payload = await req.json();
    
    const { basics, wings, rubric, templates, status } = payload;
    
    if (!basics || !wings || !rubric) {
      return apiError("Missing required sections", 400);
    }
    
    // 1. Convert string dates to Timestamps for Firestore
    const openDate = Timestamp.fromDate(new Date(basics.openDate));
    const deadline = Timestamp.fromDate(new Date(basics.deadline));
    
    // 2. Create the Academic Year document
    const yearData = {
      label: basics.label,
      openDate,
      deadline,
      description: basics.description,
      status: status || "SETUP",
      rubric,
      blindReview: true, // Default to true per PM requirements
      // messagingTemplates can be stored in the document or a separate settings doc
      messagingTemplates: templates || {},
    };
    
    const year = await yearRepository.create(yearData);
    
    // 3. Batch create wings under the new Academic Year subcollection
    const wingsData = wings.map((w: any) => ({
      name: w.name,
      isActive: true, // Always active upon creation
      headName: w.headName,
      headPhone: w.headPhone,
      headEmail: w.headEmail,
    }));
    
    await wingRepository.createBatch(year.id, wingsData);
    
    // 4. Record Audit Log
    await AuditLogService.record(
      authContext,
      "AcademicYear",
      year.id,
      "CREATE_YEAR_SETUP",
      null,
      { label: basics.label, status: year.status }
    );
    
    return apiSuccess(year);
  } catch (error: any) {
    console.error("Year setup error:", error);
    return apiError(error.message || "Failed to setup academic year", 500);
  }
});

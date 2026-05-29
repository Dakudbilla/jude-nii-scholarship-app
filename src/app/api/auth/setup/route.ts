import { adminAuth } from "@/lib/firebase/admin";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api/response";

const setupSchema = z.object({
  email: z.string().email(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "VIEWER"]),
  secret: z.string(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = setupSchema.safeParse(json);
    
    if (!result.success) {
      return apiError(result.error.issues?.[0]?.message || "Invalid payload", 400);
    }

    if (result.data.secret !== process.env.CRON_SECRET) {
      return apiError("Unauthorized", 401);
    }

    const { email, role } = result.data;
    
    // Get user by email
    const user = await adminAuth.getUserByEmail(email);
    
    // Set custom claims
    await adminAuth.setCustomUserClaims(user.uid, { role });
    
    return apiSuccess({ message: `Successfully assigned role ${role} to ${email}`, uid: user.uid });
  } catch (error) {
    console.error("Setup error:", error);
    const message = error instanceof Error ? error.message : "Failed to setup claims";
    return apiError(message, 500);
  }
}

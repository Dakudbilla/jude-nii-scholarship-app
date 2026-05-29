import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export type AuthContext = {
  uid: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "VIEWER" | "USER";
};

// The `context` parameter shape varies by route (some have params, some don't),
// so we intentionally use a loose type here and let each handler cast it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (req: Request, context: any, authContext: AuthContext) => Promise<NextResponse>;

export function withAuth(handler: Handler): (req: Request, context: unknown) => Promise<NextResponse> {
  return async (req: Request, context: unknown) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: { message: "Missing or invalid authorization header" } }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: { message: "Token not found" } }, { status: 401 });
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const authContext: AuthContext = {
        uid: decodedToken.uid,
        email: decodedToken.email ?? "",
        role: (decodedToken.role as AuthContext["role"]) ?? "USER",
      };

      return handler(req, context, authContext);
    } catch {
      return NextResponse.json({ error: { message: "Invalid token" } }, { status: 401 });
    }
  };
}

export function withAdminAuth(handler: Handler): (req: Request, context: unknown) => Promise<NextResponse> {
  return withAuth(async (req, context, authContext) => {
    if (authContext.role !== "SUPER_ADMIN" && authContext.role !== "ADMIN") {
      return NextResponse.json({ error: { message: "Forbidden: Admin access required" } }, { status: 403 });
    }
    return handler(req, context, authContext);
  });
}

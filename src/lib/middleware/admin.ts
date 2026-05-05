import { NextRequest, NextResponse } from "next/server";
import { withAuth, type AuthRequest } from "@/lib/middleware/auth";

export function withAdmin(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  // Wrap withAuth first so we have req.user populated
  return withAuth(async (req: NextRequest, ...args: any[]) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: User info missing" },
        { status: 401 }
      );
    }

    if (authReq.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    return handler(req, ...args);
  });
}
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, type AuthRequest } from "@/lib/middleware/auth";

export type SessionUser = {
  userId: string;
  email: string;
  role: string;
};

export async function requireAuth(
  req: NextRequest,
): Promise<SessionUser | NextResponse> {
  try {
    await authMiddleware(req);
    const user = (req as AuthRequest).user;
    if (!user?.userId) {
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });
    }
    return user;
  } catch {
    return NextResponse.json(
      { message: "وارد حساب کاربری خود شوید" },
      { status: 401 },
    );
  }
}

export function isSessionUser(
  result: SessionUser | NextResponse,
): result is SessionUser {
  return !(result instanceof NextResponse);
}

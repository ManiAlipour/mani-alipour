import { NextRequest, NextResponse } from "next/server";

export type AuthRequest = NextRequest & {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
};

export async function authMiddleware(req: NextRequest): Promise<AuthRequest> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const { verifyJWT } = await import("@/utils/jwt");
  const user = await verifyJWT(token);

  if (!user) {
    throw new Error("Unauthorized: Invalid or expired token");
  }

  (req as AuthRequest).user = user;

  return req as AuthRequest;
}

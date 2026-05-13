import { NextRequest } from "next/server";

export type AuthRequest = NextRequest & {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
};

export async function authMiddleware(req: NextRequest): Promise<AuthRequest> {
  // Expect HttpOnly cookie "token" to be present
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);

  if (!tokenMatch) {
    throw new Error("Unauthorized: No token cookie provided");
  }

  const token = decodeURIComponent(tokenMatch[1]);

  const { verifyJWT } = await import("@/utils/jwt");
  const user = await verifyJWT(token);

  if (!user) {
    throw new Error("Unauthorized: Invalid or expired token (cookie)");
  }

  (req as AuthRequest).user = user;

  return req as AuthRequest;
}

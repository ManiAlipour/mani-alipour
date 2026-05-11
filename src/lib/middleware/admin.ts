import { NextRequest } from "next/server";
import { authMiddleware, type AuthRequest } from "@/lib/middleware/auth";

export async function isAdmin(req: NextRequest) {
  await authMiddleware(req);
  const user = (req as NextRequest & AuthRequest).user;
  return !!(user && user.role === "admin");
}

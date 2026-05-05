import { NextRequest, NextResponse } from "next/server";


export type AuthRequest = {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
} & NextRequest;

export async function withAuth(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async function (req: NextRequest, ...args: any[]) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
      const { verifyJWT } = await import("@/utils/jwt");
      const user = await verifyJWT(token);

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Unauthorized: Invalid token" },
          { status: 401 }
        );
      }

      (req as AuthRequest).user = user;

      return handler(req, ...args);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}
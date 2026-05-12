import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import User from "@/models/User";
import { verifyJWT } from "@/utils/jwt";

export async function GET() {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = verifyJWT(token);
    } catch (e) {
      return NextResponse.json(
        { message: "توکن نامعتبر است. لطفا دوباره وارد شوید." },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "کاربر یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطای سرور رخ داد" },
      { status: 500 }
    );
  }
}
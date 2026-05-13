import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const adminCheck = await isAdmin(req);
    if (!adminCheck)
      return NextResponse.json(
        {
          messsage: "دسترسی مجاز نیست",
        },
        { status: 401 },
      );

    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const adminCount = await User.countDocuments({ role: "admin" });
    const userCount = await User.countDocuments({ role: "user" });

    const monthlyStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const latestUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("email name role createdAt isActive");

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminCount,
        userCount,
        monthlyStats,
        latestUsers,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ? error.message : "خطای سرور " },
      { status: 500 },
    );
  }
};

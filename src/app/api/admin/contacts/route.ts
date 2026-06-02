import { isAdmin } from "@/lib/middleware/admin";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck) {
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );
    const status = searchParams.get("status");

    const filter: Record<string, string> = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [contacts, totalItems, statusBreakdown] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter),
      Contact.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    const stats = {
      new: 0,
      read: 0,
      replied: 0,
      archived: 0,
      total: 0,
    };
    for (const row of statusBreakdown) {
      const key = row._id as "new" | "read" | "replied" | "archived";
      if (key in stats) {
        stats[key] = row.count;
        stats.total += row.count;
      }
    }

    return NextResponse.json({
      message: "لیست پیام‌ها با موفقیت دریافت شد",
      data: contacts,
      stats,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}

import { isAdmin } from "@/lib/middleware/admin";
import { connectDB } from "@/lib/mongodb";
import SiteSettings, { SETTINGS_KEY } from "@/models/SiteSettings";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SETTINGS = {
  siteName: "مانی علی‌پور",
  siteDescription: "وبلاگ و پورتفولیو شخصی",
  contactEmail: "",
  maintenanceMode: false,
  allowComments: true,
  allowRegistration: true,
  postsPerPage: 10,
  notifyNewContact: true,
  notifyNewComment: true,
};

async function getOrCreateSettings() {
  return SiteSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { key: SETTINGS_KEY, ...DEFAULT_SETTINGS } },
    { upsert: true, new: true },
  );
}

export async function GET(req: NextRequest) {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck) {
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });
    }

    await connectDB();
    const settings = await getOrCreateSettings();

    return NextResponse.json({
      message: "تنظیمات با موفقیت دریافت شد",
      data: settings,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck) {
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const allowedFields = [
      "siteName",
      "siteDescription",
      "contactEmail",
      "maintenanceMode",
      "allowComments",
      "allowRegistration",
      "postsPerPage",
      "notifyNewContact",
      "notifyNewComment",
    ] as const;

    const update: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    if (typeof update.postsPerPage === "number") {
      update.postsPerPage = Math.min(50, Math.max(5, update.postsPerPage));
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: update, $setOnInsert: { key: SETTINGS_KEY, ...DEFAULT_SETTINGS } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({
      message: "تنظیمات با موفقیت ذخیره شد",
      data: settings,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}

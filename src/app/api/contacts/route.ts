import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { addContactSchema } from "@/lib/validators/contact.validator";
import { createContact, getContacts } from "@/services/contact.service";

// GET: لیست کانتکت‌ها با قابلیت فیلتر و صفحه‌بندی
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // پارامترهای اختیاری
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = Number(searchParams.get("offset")) || 0;
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "-createdAt";

    const filter: any = {};
    if (status) filter.status = status;

    const sortObj: any = {};
    if (sort.startsWith("-")) {
      sortObj[sort.slice(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }

    const { contacts, total } = await getContacts({
      filter,
      limit,
      offset,
      sort: sortObj,
    });

    return NextResponse.json({
      message: "لیست پیام‌ها با موفقیت دریافت شد.",
      data: contacts,
      total,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "خطا در دریافت پیام‌ها",
        error: error.message || error,
      },
      { status: 500 },
    );
  }
};

// POST: افزودن پیام جدید
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();

    const validated = await addContactSchema.validate(body, {
      abortEarly: false,
    });

    const contact = await createContact({
      ...validated,
      message: body.message,
    });

    return NextResponse.json(
      {
        message: "پیام با موفقیت ثبت شد.",
        data: contact,
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === "ValidationError" && error.errors) {
      return NextResponse.json(
        {
          message: "اعتبارسنجی انجام نشد.",
          errors: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        message: "خطا در ثبت پیام",
        error: error.message || error,
      },
      { status: 500 },
    );
  }
};

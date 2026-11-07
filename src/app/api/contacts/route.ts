import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { addContactSchema } from "@/lib/validators/contact.validator";
import { createContact } from "@/services/contact.service";

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

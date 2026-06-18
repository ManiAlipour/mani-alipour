import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { s3Client } from "@/lib/S3Client";

export const runtime = "nodejs";
export const preferredRegion = "fra1";

const BUCKET = process.env.S3_BUCKET_NAME;
const PUBLIC_PATH = "/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;

    const key = `blog/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const url = `${PUBLIC_PATH}/${key}`;

    return NextResponse.json({
      success: true,
      url,
      key,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}

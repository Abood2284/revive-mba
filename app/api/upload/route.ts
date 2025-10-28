import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string | null) ?? undefined;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder,
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (error) {
    console.error("[UPLOAD] Cloudinary upload failed", error);
    const message =
      error instanceof Error ? error.message : "Unable to upload file";
    return NextResponse.json({ message }, { status: 500 });
  }
}

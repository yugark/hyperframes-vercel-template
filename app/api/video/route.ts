import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");
  if (!pathname || !/^renders\/render(?:-[a-zA-Z0-9]+)?\.mp4$/.test(pathname)) {
    return NextResponse.json({ error: "Invalid video" }, { status: 400 });
  }
  try {
    const blob = await get(pathname, { access: "private" });
    if (!blob || blob.statusCode !== 200) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="yugark-promo.mp4"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Video retrieval failed", error);
    return NextResponse.json({ error: "Unable to retrieve video" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export const runtime = "edge";

const isValidDriveId = (id: string) => /^[A-Za-z0-9_-]{10,}$/.test(id);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidDriveId(id)) {
    return new NextResponse("Invalid image id", { status: 400 });
  }

  const upstreamUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  const upstream = await fetch(upstreamUrl, { redirect: "follow" });

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";

  const headers = new Headers();
  headers.set("content-type", contentType);
  headers.set(
    "cache-control",
    "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
  );

  return new NextResponse(upstream.body, { status: 200, headers });
}

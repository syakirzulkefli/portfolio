import { NextResponse } from "next/server";

import { getAdminSession } from "../../../../notes/admin/supabase.server";

export const runtime = "edge";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const normalizeEnvValue = (value: string | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const unwrapped = trimmed.slice(1, -1).trim();
    return unwrapped || null;
  }
  return trimmed;
};

const storageBucket = () =>
  normalizeEnvValue(process.env.NOTES_STORAGE_BUCKET) ?? "notes-media";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    const status =
      session.reason === "missing_config"
        ? 500
        : session.reason === "unauthenticated"
          ? 401
          : 403;
    return NextResponse.json({ ok: false, error: session.reason }, { status });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_form_data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "missing_file" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: "unsupported_file_type" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "file_too_large" },
      { status: 413 }
    );
  }

  const extension = EXT_BY_TYPE[file.type] ?? "bin";
  const today = new Date().toISOString().slice(0, 10);
  const objectPath = `${today}/${crypto.randomUUID()}.${extension}`;
  const bucket = storageBucket();

  const uploadUrl = `${session.config.supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`;

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "content-type": file.type,
        apikey: session.config.anonKey,
        authorization: `Bearer ${session.accessToken}`,
      },
      body: await file.arrayBuffer(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "upload_failed" },
      { status: 500 }
    );
  }

  if (!uploadResponse.ok) {
    const details = (await uploadResponse.text()).slice(0, 500);
    return NextResponse.json(
      { ok: false, error: "upload_failed", details },
      { status: uploadResponse.status }
    );
  }

  const publicUrl = `${session.config.supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;

  return NextResponse.json({
    ok: true,
    url: publicUrl,
    path: objectPath,
    contentType: file.type,
    size: file.size,
  });
}

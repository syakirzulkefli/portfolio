import Link from "next/link";
import { redirect } from "next/navigation";

import AdminNotesClient from "./AdminNotesClient";
import { getAdminSession } from "./supabase.server";

export const runtime = "edge";

export default async function NotesAdminPage() {
  const session = await getAdminSession();

  if (!session.ok) {
    if (session.reason === "unauthenticated") {
      redirect("/login?next=/notes/admin");
    }

    if (session.reason === "forbidden") {
      return (
        <main className="min-h-screen bg-black px-6 py-16 text-white">
          <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl">
            <h1 className="text-2xl font-semibold">Notes admin access denied</h1>
            <p className="mt-3 text-sm text-white/70">
              Only the owner account can access notes admin.
            </p>
            <p className="mt-3 text-xs text-white/50">
              Make sure the owner email is allowed and the account exists in `public.admins`.
            </p>
            <div className="mt-6">
              <Link
                href="/notes"
                className="inline-flex rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
              >
                Back to notes
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl">
          <h1 className="text-2xl font-semibold">Notes admin unavailable</h1>
          <p className="mt-3 text-sm text-white/70">
            Supabase configuration is missing. Set `NEXT_PUBLIC_SUPABASE_URL`
            and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
          </p>
        </div>
      </main>
    );
  }

  return (
    <AdminNotesClient
      adminEmail={session.user.email || session.user.id}
      adminUserId={session.user.id}
    />
  );
}

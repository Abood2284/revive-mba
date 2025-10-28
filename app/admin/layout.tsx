import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await requireAdmin();

    return (
      <div className="min-h-screen grid grid-cols-[auto_1fr] bg-[var(--surface-base)]">
        <AdminSidebar session={session} />
        <main className="relative flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-10">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute -top-28 left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_32%,transparent)_0%,transparent_70%)] opacity-60" />
            <div className="absolute right-[-120px] top-[45%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-tertiary)_18%,transparent)_0%,transparent_72%)] opacity-55" />
            <div className="absolute inset-x-0 top-32 h-px bg-[linear-gradient(90deg,transparent,rgba(16,19,26,0.18),transparent)]" />
          </div>
          <div className="relative z-10 space-y-12">{children}</div>
          <Toaster />
        </main>
      </div>
    );
  } catch {
    // Redirect to global login page if not authenticated
    redirect("/login");
  }
}

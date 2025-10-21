import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await requireAdmin();

    return (
      <div className="min-h-screen bg-[var(--surface-base)] grid grid-cols-[auto_1fr]">
        <AdminSidebar session={session} />
        <main className="p-8">{children}</main>
      </div>
    );
  } catch {
    // Redirect to global login page if not authenticated
    redirect("/login");
  }
}

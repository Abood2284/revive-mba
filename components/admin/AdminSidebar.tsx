"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { AdminSession } from "@/lib/auth";
import { logoutAdmin } from "@/app/actions/auth";

interface AdminSidebarProps {
  session: AdminSession;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: Array<NavItem> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/programs", label: "Programs", icon: GraduationCap },
  { href: "/admin/institutions", label: "Institutions", icon: Building2 },
  { href: "/admin/leads", label: "Leads", icon: Users },
];

export function AdminSidebar({ session }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href) ?? false;
  }

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <aside
      className={`${sidebarWidth} h-screen sticky top-0 border-r border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-[color:var(--color-secondary)]" />
            {!isCollapsed && (
              <span className="text-sm font-bold tracking-wide text-[color:var(--color-secondary)]">
                Revive Admin
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsCollapsed((v) => !v)}
            className="inline-flex items-center justify-center rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] p-1 text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-1 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 rounded-md border border-transparent px-2 py-2 text-sm font-semibold transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--surface-subtle)_88%,white_12%)] ${
                  active
                    ? "bg-[color:color-mix(in_srgb,var(--surface-subtle)_86%,white_14%)] text-[color:var(--color-secondary)] border-[color:color-mix(in_srgb,var(--color-secondary)_24%,transparent)]"
                    : "text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] text-[color:var(--color-secondary)] font-bold">
              {session.name?.[0]?.toUpperCase() ||
                session.email[0]?.toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[color:var(--color-secondary)]">
                  {session.name || session.email}
                </p>
                <span className="pill text-[10px] uppercase">
                  {session.role}
                </span>
              </div>
            )}
          </div>
          <form action={logoutAdmin} className="mt-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] px-3 py-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_80%,white_20%)] hover:text-[color:var(--color-secondary)]"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

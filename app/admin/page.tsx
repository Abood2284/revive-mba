import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { db } from "@/db";
import { institutions, leads, programs } from "@/db/schema";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  ExternalLink,
  GraduationCap,
  PlusCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { sql } from "drizzle-orm";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

async function getStats() {
  const [programCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(programs);

  const [institutionCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(institutions);

  const [leadCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads);

  return {
    programs: programCount.count,
    institutions: institutionCount.count,
    leads: leadCount.count,
  };
}

interface OverviewCard {
  href: string;
  label: string;
  metric: string;
  helper: string;
  icon: IconType;
}

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: IconType;
  external?: boolean;
}

const numberFormatter = new Intl.NumberFormat("en-IN");

export default async function AdminDashboard() {
  const stats = await getStats();

  const programCount = numberFormatter.format(stats.programs);
  const institutionCount = numberFormatter.format(stats.institutions);
  const leadCount = numberFormatter.format(stats.leads);

  const overviewCards: Array<OverviewCard> = [
    {
      href: "/admin/programs",
      label: "Programs",
      metric: programCount,
      helper: "Active listings in your catalog",
      icon: GraduationCap,
    },
    {
      href: "/admin/institutions",
      label: "Institutions",
      metric: institutionCount,
      helper: "Partner universities onboarding",
      icon: Building2,
    },
    {
      href: "/admin/leads",
      label: "Leads",
      metric: leadCount,
      helper: "Prospects captured via Revive MBA",
      icon: Users,
    },
  ];

  const quickActions: Array<QuickAction> = [
    {
      href: "/admin/programs?new=1",
      label: "Add program",
      description: "Launch a new MBA or PGDM listing.",
      icon: PlusCircle,
    },
    {
      href: "/admin/institutions?new=1",
      label: "Add institution",
      description: "Onboard a new university partner.",
      icon: Building2,
    },
    {
      href: "/admin/leads",
      label: "Review leads",
      description: "Prioritize follow-ups and status updates.",
      icon: BarChart3,
    },
    {
      href: "/",
      label: "Preview site",
      description: "Open the marketing site in a new tab.",
      icon: ExternalLink,
      external: true,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Track key platform metrics and jump into the workflows that keep Revive MBA moving."
        stats={[
          {
            label: "Programs",
            value: programCount,
            helper: "Active in catalog",
          },
          {
            label: "Institutions",
            value: institutionCount,
            helper: "Partnered with Revive",
          },
          {
            label: "Leads",
            value: leadCount,
            helper: "Submissions captured",
          },
        ]}
      />

      <section className="section-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.25fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                Manage catalog
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {overviewCards.map(({ href, label, metric, helper, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group relative overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_15%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] p-6 shadow-[0_28px_72px_-48px_rgba(16,19,26,0.52)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_80px_-44px_rgba(16,19,26,0.55)]"
                  >
                    <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_28%,transparent)_0%,transparent_72%)]" />
                    </div>
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-accent)_16%,transparent)] text-[color:var(--color-accent)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in_srgb,var(--color-secondary)_58%,white_42%)]">
                          {label}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)] transition group-hover:text-[color:var(--color-accent)]" />
                    </div>
                    <div className="relative mt-6 text-4xl font-bold text-[color:var(--color-secondary)]">
                      {metric}
                    </div>
                    <p className="relative mt-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                      {helper}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                Quick actions
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map(({ href, label, description, icon: Icon, external }) => {
                  const linkProps = external
                    ? ({ target: "_blank", rel: "noreferrer" } as const)
                    : {};
                  return (
                    <Link
                      key={label}
                      href={href}
                      className="group relative overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] p-5 shadow-[0_24px_60px_-48px_rgba(16,19,26,0.48)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_72px_-44px_rgba(16,19,26,0.52)]"
                      {...linkProps}
                    >
                      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                        <div className="absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-tertiary)_22%,transparent)_0%,transparent_75%)] opacity-80" />
                      </div>
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] text-[color:var(--color-secondary)]">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--color-secondary)]">
                              {label}
                            </p>
                            <p className="mt-1 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_62%,white_38%)]">
                              {description}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)] transition group-hover:translate-x-1 group-hover:text-[color:var(--color-accent)]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="surface-card flex h-full flex-col justify-between gap-6 p-6 lg:p-8">
            <div>
              <span className="pill text-[10px] uppercase">Heads up</span>
              <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-secondary)]">
                Admin dashboard is in preview
              </h3>
              <p className="mt-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                This shell gives you quick navigation and high-level metrics.
                Full CRUD flows for catalog and lead operations are in progress.
                Until then, use Drizzle Studio for direct database edits.
              </p>
            </div>
            <div className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_85%,white_15%)] px-4 py-3 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_68%,white_32%)]">
              Run{" "}
              <code className="rounded bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] px-1.5 py-0.5 font-mono text-xs text-[color:var(--color-secondary)]">
                npm run db:studio
              </code>{" "}
              to open Drizzle Studio locally for manual updates.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

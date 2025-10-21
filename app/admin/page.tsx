import { db } from "@/db";
import { programs, institutions, leads } from "@/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

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

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <section className="bg-[var(--surface-base)] py-4">
      <div className="section-container">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--color-secondary)]">
            Dashboard
          </h1>
          <p className="mt-2 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
            Overview of your Revive MBA platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/programs"
            className="surface-card p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Programs
            </p>
            <p className="mt-2 text-4xl font-bold text-[color:var(--color-secondary)]">
              {stats.programs}
            </p>
            <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Active programs in catalog
            </p>
          </Link>

          <Link
            href="/admin/institutions"
            className="surface-card p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Institutions
            </p>
            <p className="mt-2 text-4xl font-bold text-[color:var(--color-secondary)]">
              {stats.institutions}
            </p>
            <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Partner institutions
            </p>
          </Link>

          <Link
            href="/admin/leads"
            className="surface-card p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Leads
            </p>
            <p className="mt-2 text-4xl font-bold text-[color:var(--color-secondary)]">
              {stats.leads}
            </p>
            <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Total submissions
            </p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
            Quick actions
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/programs?new=1"
              className="surface-card p-6 text-center transition hover:shadow-lg"
            >
              <span className="text-2xl">➕</span>
              <p className="mt-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                Add program
              </p>
            </Link>
            <Link
              href="/admin/institutions?new=1"
              className="surface-card p-6 text-center transition hover:shadow-lg"
            >
              <span className="text-2xl">🏛️</span>
              <p className="mt-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                Add institution
              </p>
            </Link>
            <Link
              href="/admin/leads"
              className="surface-card p-6 text-center transition hover:shadow-lg"
            >
              <span className="text-2xl">📊</span>
              <p className="mt-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                View leads
              </p>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="surface-card p-6 text-center transition hover:shadow-lg"
            >
              <span className="text-2xl">👁️</span>
              <p className="mt-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                Preview site
              </p>
            </Link>
          </div>
        </div>

        {/* Notice */}
        <div className="surface-card mt-12 p-6">
          <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
            Admin Dashboard (Placeholder)
          </h3>
          <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
            This is a minimal admin shell. Full CRUD interfaces for programs,
            institutions, and lead management will be implemented in future
            iterations. For now, use Drizzle Studio (
            <code className="rounded bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] px-1 py-0.5 font-mono text-xs">
              npm run db:studio
            </code>
            ) to manage data directly.
          </p>
        </div>
      </div>
    </section>
  );
}

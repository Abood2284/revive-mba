import { db } from "@/db";
import { institutions, programs } from "@/db/schema";
import { eq, sql, and, gte, lte } from "drizzle-orm";
import Link from "next/link";

interface ProgramsPageProps {
  searchParams: Promise<{
    degreeType?: string;
    mode?: string;
    minFee?: string;
    maxFee?: string;
    institution?: string;
  }>;
}

async function getPrograms(filters: {
  degreeType?: string;
  mode?: string;
  minFee?: string;
  maxFee?: string;
  institution?: string;
}) {
  const conditions = [];

  if (filters.degreeType) {
    conditions.push(eq(programs.degreeType, filters.degreeType));
  }

  if (filters.mode && isDeliveryMode(filters.mode)) {
    conditions.push(eq(programs.deliveryMode, filters.mode));
  }

  if (filters.minFee) {
    const minFee = parseInt(filters.minFee, 10);
    if (!isNaN(minFee)) {
      conditions.push(gte(programs.totalFee, minFee));
    }
  }

  if (filters.maxFee) {
    const maxFee = parseInt(filters.maxFee, 10);
    if (!isNaN(maxFee)) {
      conditions.push(lte(programs.totalFee, maxFee));
    }
  }

  if (filters.institution) {
    const institutionId = parseInt(filters.institution, 10);
    if (!isNaN(institutionId)) {
      conditions.push(eq(programs.institutionId, institutionId));
    }
  }

  const query = db
    .select({
      id: programs.id,
      degreeType: programs.degreeType,
      title: programs.title,
      durationMonths: programs.durationMonths,
      deliveryMode: programs.deliveryMode,
      totalFee: programs.totalFee,
      applicationFee: programs.applicationFee,
      emiAvailable: programs.emiAvailable,
      highlights: programs.highlights,
      heroImage: programs.heroImage,
      isFeatured: programs.isFeatured,
      institution: {
        id: institutions.id,
        name: institutions.name,
        slug: institutions.slug,
        location: institutions.location,
        logoUrl: institutions.logoUrl,
      },
    })
    .from(programs)
    .leftJoin(institutions, eq(programs.institutionId, institutions.id))
    .orderBy(sql`${programs.isFeatured} DESC, ${programs.totalFee} ASC`);

  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }

  return query;
}

async function getInstitutions() {
  return db
    .select({
      id: institutions.id,
      name: institutions.name,
      slug: institutions.slug,
    })
    .from(institutions)
    .orderBy(institutions.name);
}

async function getUniqueDegreeTypes() {
  const result = await db
    .selectDistinct({ degreeType: programs.degreeType })
    .from(programs);
  return result.map((r) => r.degreeType);
}

const deliveryModes = ["online", "blended", "weekend", "on-campus"] as const;

function isDeliveryMode(
  value: string
): value is (typeof deliveryModes)[number] {
  return (deliveryModes as readonly string[]).includes(value);
}

function formatCurrency(amount: number | null) {
  if (!amount) return "Fee not disclosed";
  const lakhs = amount / 100000;
  return `₹${lakhs.toFixed(2)}L`;
}

export default async function ProgramsPage({
  searchParams,
}: ProgramsPageProps) {
  const params = await searchParams;
  const [programList, institutionList, degreeTypes] = await Promise.all([
    getPrograms(params),
    getInstitutions(),
    getUniqueDegreeTypes(),
  ]);

  const featuredPrograms = programList.filter((p) => p.isFeatured);
  const regularPrograms = programList.filter((p) => !p.isFeatured);

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* Hero */}
      <section className="bg-[var(--surface-subtle)] pb-16 pt-28">
        <div className="section-container">
          <span className="eyebrow">Program catalog</span>
          <h1 className="mt-4 text-4xl font-bold text-[color:var(--color-secondary)] sm:text-5xl">
            Discover MBA & PGDM programs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
            Compare accredited online and executive programs from 45+ partner
            institutions. Filter by delivery mode, fee range, and specialisation
            to find your best fit.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-base)] py-6">
        <div className="section-container">
          <form method="get" className="flex flex-wrap items-center gap-4">
            {/* Degree Type */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="degreeType"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]"
              >
                Degree
              </label>
              <select
                name="degreeType"
                id="degreeType"
                defaultValue={params.degreeType || ""}
                className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2 text-sm text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              >
                <option value="">All degrees</option>
                {degreeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Mode */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="mode"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]"
              >
                Mode
              </label>
              <select
                name="mode"
                id="mode"
                defaultValue={params.mode || ""}
                className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2 text-sm text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              >
                <option value="">All modes</option>
                {deliveryModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Fee */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="minFee"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]"
              >
                Min fee
              </label>
              <input
                type="number"
                name="minFee"
                id="minFee"
                placeholder="₹ 0"
                defaultValue={params.minFee || ""}
                className="w-32 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2 text-sm text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              />
            </div>

            {/* Max Fee */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="maxFee"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]"
              >
                Max fee
              </label>
              <input
                type="number"
                name="maxFee"
                id="maxFee"
                placeholder="₹ 500000"
                defaultValue={params.maxFee || ""}
                className="w-32 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2 text-sm text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              />
            </div>

            {/* Institution */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="institution"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]"
              >
                Institution
              </label>
              <select
                name="institution"
                id="institution"
                defaultValue={params.institution || ""}
                className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2 text-sm text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              >
                <option value="">All institutions</option>
                {institutionList.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-auto inline-flex items-center justify-center rounded-lg bg-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
            >
              Apply filters
            </button>

            {(params.degreeType ||
              params.mode ||
              params.minFee ||
              params.maxFee ||
              params.institution) && (
              <Link
                href="/programs"
                className="mt-auto inline-flex items-center justify-center rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_40%,transparent)]"
              >
                Clear filters
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="bg-[var(--surface-base)] py-16">
        <div className="section-container">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
              {programList.length}{" "}
              {programList.length === 1 ? "program" : "programs"} found
            </p>
          </div>

          {featuredPrograms.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-[color:var(--color-secondary)]">
                Featured programs
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          )}

          {regularPrograms.length > 0 && (
            <div>
              {featuredPrograms.length > 0 && (
                <h2 className="mb-6 text-2xl font-bold text-[color:var(--color-secondary)]">
                  All programs
                </h2>
              )}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          )}

          {programList.length === 0 && (
            <div className="surface-card p-12 text-center">
              <p className="text-lg font-semibold text-[color:var(--color-secondary)]">
                No programs found
              </p>
              <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                Try adjusting your filters or{" "}
                <Link
                  href="/programs"
                  className="font-semibold text-[color:var(--color-accent)] underline"
                >
                  clear all filters
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ProgramCardProps {
  program: {
    id: number;
    degreeType: string;
    title: string;
    durationMonths: number | null;
    deliveryMode: "online" | "blended" | "weekend" | "on-campus" | null;
    totalFee: number | null;
    applicationFee: number | null;
    emiAvailable: boolean | null;
    highlights: string | null;
    heroImage: string | null;
    isFeatured: boolean | null;
    institution: {
      id: number;
      name: string;
      slug: string;
      location: string | null;
      logoUrl: string | null;
    } | null;
  };
}

function ProgramCard({ program }: ProgramCardProps) {
  return (
    <article className="surface-card p-6 transition hover:-translate-y-1 hover:shadow-xl">
      {program.isFeatured && <span className="metric-chip mb-4">Featured</span>}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            {program.degreeType}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[color:var(--color-secondary)]">
            {program.title}
          </h3>
          {program.institution && (
            <p className="mt-1 text-sm font-medium text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
              {program.institution.name}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] pt-4">
        {program.durationMonths && (
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
              Duration
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[color:var(--color-secondary)]">
              {program.durationMonths} months
            </dd>
          </div>
        )}
        {program.deliveryMode && (
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
              Mode
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[color:var(--color-secondary)]">
              {program.deliveryMode.charAt(0).toUpperCase() +
                program.deliveryMode.slice(1)}
            </dd>
          </div>
        )}
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
            Total fee
          </dt>
          <dd className="mt-1 flex items-baseline gap-2 text-base font-semibold text-[color:var(--color-secondary)]">
            {formatCurrency(program.totalFee)}
            {program.emiAvailable && (
              <span className="pill text-xs">EMI available</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/programs/${program.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
        >
          View details
        </Link>
        <Link
          href="/#lead-form"
          className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_40%,transparent)]"
        >
          Apply now
        </Link>
      </div>
    </article>
  );
}

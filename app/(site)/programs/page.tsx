import { db } from "@/db";
import { institutions, programs, programSpecialisations } from "@/db/schema";
import { eq, sql, and, gte, lte, ilike, or } from "drizzle-orm";
import Link from "next/link";
import type { CSSProperties } from "react";

interface ProgramsPageProps {
  searchParams: Promise<{
    degreeType?: string;
    category?: string;
    mode?: string;
    minFee?: string;
    maxFee?: string;
    minDuration?: string;
    maxDuration?: string;
    specialization?: string;
    institution?: string;
  }>;
}

function isMastersDegree(degreeType: string): boolean {
  const normalized = degreeType.toLowerCase().trim();
  return (
    normalized.includes("mba") ||
    normalized.includes("master") ||
    normalized.includes("m.com") ||
    normalized.includes("mcom") ||
    normalized.includes("m.sc") ||
    normalized.includes("msc") ||
    normalized.includes("mca") ||
    normalized === "ma" ||
    normalized.startsWith("ma ") ||
    normalized.includes("pgdm")
  );
}

function isBachelorsDegree(degreeType: string): boolean {
  const normalized = degreeType.toLowerCase().trim();
  return (
    normalized.includes("bachelor") ||
    normalized.includes("bba") ||
    normalized.includes("bbm") ||
    normalized.includes("b.a") ||
    normalized === "b.a." ||
    normalized.includes("ba ") ||
    normalized.includes("bca") ||
    normalized.includes("b.com") ||
    normalized.includes("bcom") ||
    normalized.includes("b.sc") ||
    normalized.includes("bsc")
  );
}

async function getPrograms(filters: {
  degreeType?: string;
  category?: string;
  mode?: string;
  minFee?: string;
  maxFee?: string;
  minDuration?: string;
  maxDuration?: string;
  specialization?: string;
  institution?: string;
}) {
  const conditions = [];

  if (filters.degreeType) {
    conditions.push(eq(programs.degreeType, filters.degreeType));
  }

  // Handle category filter (masters or bachelors)
  if (filters.category === "masters" || filters.category === "bachelors") {
    // Get all unique degree types to filter by category
    const allDegreeTypes = await db
      .selectDistinct({ degreeType: programs.degreeType })
      .from(programs);

    const matchingDegreeTypes = allDegreeTypes
      .filter((dt) => dt.degreeType !== null)
      .map((dt) => dt.degreeType!)
      .filter((dt) => {
        if (filters.category === "masters") {
          return isMastersDegree(dt);
        } else {
          return isBachelorsDegree(dt);
        }
      });

    if (matchingDegreeTypes.length > 0) {
      conditions.push(
        or(...matchingDegreeTypes.map((dt) => eq(programs.degreeType, dt)))
      );
    } else {
      // If no matching degree types found, return empty result
      conditions.push(eq(programs.id, -1));
    }
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

  if (filters.minDuration) {
    const minDuration = parseInt(filters.minDuration, 10);
    if (!isNaN(minDuration)) {
      conditions.push(gte(programs.durationMonths, minDuration));
    }
  }

  if (filters.maxDuration) {
    const maxDuration = parseInt(filters.maxDuration, 10);
    if (!isNaN(maxDuration)) {
      conditions.push(lte(programs.durationMonths, maxDuration));
    }
  }

  if (filters.institution) {
    const institutionId = parseInt(filters.institution, 10);
    if (!isNaN(institutionId)) {
      // Filter by institution ID
      conditions.push(eq(programs.institutionId, institutionId));
    } else {
      // Filter by institution slug or name (case-insensitive)
      const institutionNameOrSlug = filters.institution.toLowerCase().trim();
      conditions.push(
        or(
          ilike(institutions.slug, `%${institutionNameOrSlug}%`),
          ilike(institutions.name, `%${institutionNameOrSlug}%`)
        )
      );
    }
  }

  if (filters.specialization) {
    conditions.push(
      ilike(programSpecialisations.name, `%${filters.specialization}%`)
    );
  }

  const baseQuery = db
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
    .leftJoin(institutions, eq(programs.institutionId, institutions.id));

  // Add specialization join if filtering by specialization
  const query = filters.specialization
    ? baseQuery
        .leftJoin(
          programSpecialisations,
          eq(programs.id, programSpecialisations.programId)
        )
        .orderBy(sql`${programs.isFeatured} DESC, ${programs.totalFee} ASC`)
    : baseQuery.orderBy(
        sql`${programs.isFeatured} DESC, ${programs.totalFee} ASC`
      );

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

function sortDegreeTypes(degreeTypes: (string | null)[]): string[] {
  const normalized = degreeTypes.filter(
    (type): type is string => type !== null
  );

  const categorize = (type: string): number => {
    const lower = type.toLowerCase().trim();

    // Combo degrees (priority 2) - check first to avoid misclassification
    if (lower.includes("combo") || lower.includes("+")) {
      return 2;
    }

    // Masters degrees (priority 0)
    if (
      lower.startsWith("m") &&
      (lower.includes("mba") ||
        lower.includes("m.com") ||
        lower.includes("mcom") ||
        lower.includes("m.sc") ||
        lower.includes("msc") ||
        lower.includes("mca") ||
        lower === "ma" ||
        lower.startsWith("ma ") ||
        lower.includes("master"))
    ) {
      return 0;
    }

    // Bachelors degrees (priority 1)
    if (
      lower.startsWith("b") &&
      (lower.includes("bba") ||
        lower.includes("b.a") ||
        lower === "b.a." ||
        lower.includes("ba ") ||
        lower.includes("bca") ||
        lower.includes("b.com") ||
        lower.includes("bcom") ||
        lower.includes("b.sc") ||
        lower.includes("bsc") ||
        lower.includes("bachelor"))
    ) {
      return 1;
    }

    // Certificate (priority 3)
    if (lower.includes("certificate")) {
      return 3;
    }

    // Other (priority 4)
    return 4;
  };

  return normalized.sort((a, b) => {
    const categoryA = categorize(a);
    const categoryB = categorize(b);

    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }

    return a.localeCompare(b);
  });
}

const deliveryModes = ["online", "blended", "weekend", "on-campus"] as const;

function isDeliveryMode(
  value: string
): value is (typeof deliveryModes)[number] {
  return (deliveryModes as readonly string[]).includes(value);
}

function comparePrograms(
  a: Awaited<ReturnType<typeof getPrograms>>[number],
  b: Awaited<ReturnType<typeof getPrograms>>[number]
) {
  const degreeRankDiff =
    rankDegreeType(a.degreeType) - rankDegreeType(b.degreeType);
  if (degreeRankDiff !== 0) return degreeRankDiff;

  const feeA = a.totalFee ?? Number.POSITIVE_INFINITY;
  const feeB = b.totalFee ?? Number.POSITIVE_INFINITY;
  if (feeA !== feeB) return feeA - feeB;

  return a.title.localeCompare(b.title);
}

function rankDegreeType(value: string | null) {
  if (!value) return 6;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return 6;

  if (
    normalized.includes("master") ||
    normalized.includes("mba") ||
    normalized.includes("pgdm")
  )
    return 0;

  if (
    normalized.includes("bachelor") ||
    normalized.includes("bba") ||
    normalized.includes("bbm")
  )
    return 1;

  if (
    normalized.includes("postgraduate diploma") ||
    normalized.includes("pg diploma") ||
    normalized.includes("post graduate program") ||
    normalized.includes("post graduate programme")
  )
    return 2;

  if (normalized.includes("diploma")) return 3;

  if (normalized.includes("executive")) return 4;

  if (normalized.includes("certificate")) return 5;

  return 4;
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

  // If category is set, ensure degreeType dropdown reflects it
  const categoryDegreeTypes =
    params.category === "masters" || params.category === "bachelors"
      ? await db
          .selectDistinct({ degreeType: programs.degreeType })
          .from(programs)
          .then((types) =>
            types
              .filter((t) => t.degreeType !== null)
              .map((t) => t.degreeType!)
              .filter((dt) =>
                params.category === "masters"
                  ? isMastersDegree(dt)
                  : isBachelorsDegree(dt)
              )
          )
      : [];
  const [programList, institutionList, degreeTypes] = await Promise.all([
    getPrograms(params),
    getInstitutions(),
    getUniqueDegreeTypes(),
  ]);

  // Deduplicate programs by ID (can happen when filtering by specialization)
  const uniquePrograms = Array.from(
    new Map(programList.map((program) => [program.id, program])).values()
  );

  const sortedDegreeTypes = sortDegreeTypes(degreeTypes);
  const sortedPrograms = [...uniquePrograms].sort(comparePrograms);

  const featuredPrograms = sortedPrograms.filter((p) => p.isFeatured);
  const regularPrograms = sortedPrograms.filter((p) => !p.isFeatured);

  const heroStats = [
    {
      value: `${uniquePrograms.length || 0}`,
      label: "Accredited programs listed",
    },
    {
      value: "2.1K+",
      label: "Students enrolled",
    },
    {
      value: `${institutionList.length || 0}`,
      label: "Partner institutions",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#3D38B8] pb-16 pt-24 text-white">
        <div className="section-container relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-5xl">
              Masters and Bachelors Programs
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Compare accredited programs by fees, duration, and delivery mode.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative -mt-16 pb-14">
        <div className="section-container">
          <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] p-6 shadow-[0_28px_48px_-32px_rgba(16,19,26,0.32)] md:p-8">
            <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[color:var(--color-secondary)]">
                  Filter programs
                </h2>
              </div>
              <Link
                href="/lead-form"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_15%,transparent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
              >
                Need help?
                <span aria-hidden>→</span>
              </Link>
            </div>
            <form
              method="get"
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            >
              {/* Degree Type */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="degreeType"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]"
                >
                  Degree
                </label>
                <select
                  name="degreeType"
                  id="degreeType"
                  defaultValue={params.degreeType || ""}
                  className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
                >
                  <option value="">All degrees</option>
                  {(params.category && categoryDegreeTypes.length > 0
                    ? categoryDegreeTypes
                    : sortedDegreeTypes
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {params.category && (
                  <input
                    type="hidden"
                    name="category"
                    value={params.category}
                  />
                )}
              </div>

              {/* Delivery Mode */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="mode"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]"
                >
                  Mode
                </label>
                <select
                  name="mode"
                  id="mode"
                  defaultValue={params.mode || ""}
                  className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
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
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]"
                >
                  Min fee
                </label>
                <input
                  type="number"
                  name="minFee"
                  id="minFee"
                  placeholder="₹ 0"
                  defaultValue={params.minFee || ""}
                  className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
                />
              </div>

              {/* Max Fee */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="maxFee"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]"
                >
                  Max fee
                </label>
                <input
                  type="number"
                  name="maxFee"
                  id="maxFee"
                  placeholder="₹ 500000"
                  defaultValue={params.maxFee || ""}
                  className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
                />
              </div>

              {/* Institution */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="institution"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]"
                >
                  Institution
                </label>
                <select
                  name="institution"
                  id="institution"
                  defaultValue={params.institution || ""}
                  className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
                >
                  <option value="">All institutions</option>
                  {institutionList.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
                >
                  Apply filters
                </button>
              </div>
              {(params.degreeType ||
                params.category ||
                params.mode ||
                params.minFee ||
                params.maxFee ||
                params.institution) && (
                <div className="flex items-end">
                  <Link
                    href="/programs"
                    className="inline-flex w-full items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-6 py-3 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
                  >
                    Clear filters
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Results */}
      <section
        id="program-results"
        className="bg-[var(--surface-base)] pb-20 pt-10"
      >
        <div className="section-container">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                Programs
              </h2>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white px-5 py-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--color-accent)]" />
              {uniquePrograms.length}{" "}
              {uniquePrograms.length === 1 ? "program" : "programs"} found
            </div>
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

          {uniquePrograms.length === 0 && (
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
  const heroStyle: CSSProperties = program.heroImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(16,19,26,0.08) 0%, rgba(16,19,26,0.6) 100%), url(${program.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundImage:
          "linear-gradient(135deg, rgba(61,56,184,0.75) 0%, rgba(237,28,36,0.65) 100%)",
      };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white shadow-[0_20px_36px_-24px_rgba(16,19,26,0.24)] transition-transform hover:-translate-y-[2px] hover:shadow-[0_28px_48px_-28px_rgba(16,19,26,0.28)]">
      <div className="relative h-40 w-full">
        <div
          className="absolute inset-0"
          style={heroStyle}
          aria-hidden={!program.heroImage}
        />
        {!program.heroImage && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/80">
            Add program visual
          </div>
        )}
        <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_-14px_rgba(16,19,26,0.6)]">
          {program.degreeType}
        </div>
        {program.deliveryMode && (
          <div className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/90">
            {program.deliveryMode}
          </div>
        )}
        {program.isFeatured && (
          <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[color:var(--color-secondary)] shadow-[0_10px_24px_-16px_rgba(16,19,26,0.4)]">
            <span aria-hidden>★</span>
            Featured by Revive
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
            {program.title}
          </h3>
          {program.institution && (
            <div className="text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)]">
              {program.institution.name}
            </div>
          )}
        </div>

        <dl className="grid gap-3 rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] p-3 sm:grid-cols-2">
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
          {program.applicationFee && (
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                Application fee
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[color:var(--color-secondary)]">
                {formatCurrency(program.applicationFee)}
              </dd>
            </div>
          )}
          {program.deliveryMode && (
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                Delivery
              </dt>
              <dd className="mt-1 text-sm font-semibold capitalize text-[color:var(--color-secondary)]">
                {program.deliveryMode}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
              Total fee
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-[color:var(--color-secondary)]">
              {formatCurrency(program.totalFee)}
              {program.emiAvailable && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] px-3 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-accent)_88%,black_12%)]">
                  EMI ready
                </span>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2.5">
          <Link
            href={`/programs/${program.id}`}
            className="inline-flex min-w-[9rem] flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
          >
            View details
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/#lead-form"
            className="inline-flex min-w-[8rem] items-center justify-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
          >
            Apply now
          </Link>
        </div>
      </div>
    </article>
  );
}

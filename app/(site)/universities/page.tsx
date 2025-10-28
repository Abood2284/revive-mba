import Link from "next/link";
import Image from "next/image";

import { db } from "@/db";
import { institutions, programs } from "@/db/schema";

function formatDuration(durationMonths: number | null) {
  if (!durationMonths) {
    return null;
  }
  if (durationMonths % 12 === 0) {
    const years = durationMonths / 12;
    return years === 1 ? "1 year" : `${years} years`;
  }
  return `${durationMonths} months`;
}

function formatCurrencyLakhs(amount: number | null) {
  if (!amount) return null;
  const lakhs = amount / 100000;
  return `₹${lakhs.toFixed(1)}L`;
}

export default async function UniversitiesPage() {
  const [institutionRows, programRows] = await Promise.all([
    db
      .select({
        id: institutions.id,
        name: institutions.name,
        slug: institutions.slug,
        location: institutions.location,
        accreditation: institutions.accreditation,
        logoUrl: institutions.logoUrl,
        shortDescription: institutions.shortDescription,
        heroImage: institutions.heroImage,
        website: institutions.website,
      })
      .from(institutions)
      .orderBy(institutions.name),
    db
      .select({
        id: programs.id,
        institutionId: programs.institutionId,
        title: programs.title,
        degreeType: programs.degreeType,
        durationMonths: programs.durationMonths,
        deliveryMode: programs.deliveryMode,
        totalFee: programs.totalFee,
        isFeatured: programs.isFeatured,
      })
      .from(programs),
  ]);

  type ProgramResult = (typeof programRows)[number];

  const programGroups = new Map<number, ProgramResult[]>();
  const degreeSet = new Set<string>();

  for (const program of programRows) {
    degreeSet.add(program.degreeType);
    const group = programGroups.get(program.institutionId) ?? [];
    group.push(program);
    programGroups.set(program.institutionId, group);
  }

  const universityCards = institutionRows.map((institution) => {
    const programsForInstitution = programGroups.get(institution.id) ?? [];
    const programCount = programsForInstitution.length;
    const sortedPrograms = [...programsForInstitution].sort((a, b) => {
      const featuredDiff =
        (Number(b.isFeatured ?? false) as number) -
        (Number(a.isFeatured ?? false) as number);
      if (featuredDiff !== 0) return featuredDiff;
      const feeA = a.totalFee ?? Number.POSITIVE_INFINITY;
      const feeB = b.totalFee ?? Number.POSITIVE_INFINITY;
      return feeA - feeB;
    });
    const topPrograms = sortedPrograms.slice(0, 3).map((program) => ({
      id: program.id,
      title: program.title,
      degreeType: program.degreeType,
      duration: formatDuration(program.durationMonths),
      mode: program.deliveryMode
        ? program.deliveryMode.replace("-", " ")
        : null,
      fee: formatCurrencyLakhs(program.totalFee),
      isFeatured: Boolean(program.isFeatured),
    }));

    return {
      institution,
      programCount,
      topPrograms,
    };
  });

  const stats = {
    totalUniversities: institutionRows.length,
    totalPrograms: programRows.length,
    distinctDegrees: degreeSet.size,
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[color:var(--color-secondary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] bg-gradient-to-br from-[var(--surface-subtle)] via-[color:color-mix(in_srgb,var(--surface-subtle)_95%,white_5%)] to-[var(--surface-subtle)] py-20">
        <div className="section-container">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <span className="eyebrow">University network</span>
              <h1 className="hero-headline mt-6">
                Accredited institutions partnering with Revive MBA
              </h1>
              <p className="hero-subheadline mt-6 max-w-2xl">
                Browse the universities we collaborate with for online, blended,
                and executive MBA pathways. Every listing is verified, program
                mapped, and supported by our counsellor network.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatBadge label="Universities" value={stats.totalUniversities} />
              <StatBadge
                label="MBA & PG programs"
                value={stats.totalPrograms}
              />
              <StatBadge label="Degree formats" value={stats.distinctDegrees} />
            </div>
          </div>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {universityCards.map(
              ({ institution, topPrograms, programCount }) => (
                <article
                  key={institution.id}
                  className="group surface-card overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_64px_-12px_rgba(16,19,26,0.25)]"
                >
                  {/* University Logo */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {institution.logoUrl ? (
                      <Image
                        src={institution.logoUrl}
                        alt={`${institution.name} logo`}
                        fill
                        className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:color-mix(in_srgb,var(--color-accent)_15%,white_85%)] to-[color:color-mix(in_srgb,var(--color-accent)_8%,white_92%)]">
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_20%,white_80%)]">
                            <svg
                              className="h-8 w-8 text-[color:var(--color-accent)]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-[color:color-mix(in_srgb,var(--color-accent)_70%,white_30%)]">
                            University Logo
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* University Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="h2 mb-2">{institution.name}</h2>
                      {institution.location && (
                        <p className="body-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                          📍 {institution.location}
                        </p>
                      )}
                    </div>

                    {/* Program Count & Actions */}
                    <div className="flex items-center justify-between border-t border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] pt-4">
                      <div className="flex items-center gap-2">
                        <span className="pill">
                          {programCount}{" "}
                          {programCount === 1 ? "program" : "programs"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/programs?institution=${institution.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-accent-foreground)] transition-all hover:scale-105 hover:shadow-lg"
                        >
                          View Programs
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-card p-6 text-center transition-all hover:scale-105 hover:shadow-lg">
      <p className="stat-value">{value}</p>
      <p className="label mt-2">{label}</p>
    </div>
  );
}

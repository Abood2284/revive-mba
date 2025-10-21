import { db } from "@/db";
import {
  institutions,
  programs,
  programSpecialisations,
  programFees,
  programFaqs,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getProgram(id: number) {
  const [program] = await db
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
      outcomes: programs.outcomes,
      eligibility: programs.eligibility,
      curriculum: programs.curriculum,
      workExperienceMinYears: programs.workExperienceMinYears,
      heroImage: programs.heroImage,
      brochureUrl: programs.brochureUrl,
      applyUrl: programs.applyUrl,
      applicationDeadline: programs.applicationDeadline,
      isFeatured: programs.isFeatured,
      institution: {
        id: institutions.id,
        name: institutions.name,
        slug: institutions.slug,
        location: institutions.location,
        accreditation: institutions.accreditation,
        website: institutions.website,
        logoUrl: institutions.logoUrl,
        heroImage: institutions.heroImage,
        establishedYear: institutions.establishedYear,
        shortDescription: institutions.shortDescription,
      },
    })
    .from(programs)
    .leftJoin(institutions, eq(programs.institutionId, institutions.id))
    .where(eq(programs.id, id));

  if (!program) return null;

  const [specialisations, fees, faqs] = await Promise.all([
    db
      .select()
      .from(programSpecialisations)
      .where(eq(programSpecialisations.programId, id)),
    db.select().from(programFees).where(eq(programFees.programId, id)),
    db.select().from(programFaqs).where(eq(programFaqs.programId, id)),
  ]);

  return {
    ...program,
    specialisations,
    fees,
    faqs,
  };
}

function formatCurrency(amount: number | null) {
  if (!amount) return "Fee not disclosed";
  const lakhs = amount / 100000;
  return `₹${lakhs.toFixed(2)}L`;
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const { id } = await params;
  const programId = parseInt(id, 10);

  if (isNaN(programId)) {
    notFound();
  }

  const program = await getProgram(programId);

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* Breadcrumbs */}
      <section className="bg-[var(--surface-base)] pb-4 pt-24">
        <div className="section-container">
          <nav className="flex items-center gap-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            <Link href="/" className="hover:text-[color:var(--color-accent)]">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/programs"
              className="hover:text-[color:var(--color-accent)]"
            >
              Programs
            </Link>
            <span>/</span>
            <span className="text-[color:var(--color-secondary)]">
              {program.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[var(--surface-subtle)] py-12">
        <div className="section-container">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="eyebrow">{program.degreeType}</span>
                {program.isFeatured && (
                  <span className="metric-chip">Featured</span>
                )}
              </div>
              <h1 className="mt-4 text-4xl font-bold text-[color:var(--color-secondary)] sm:text-5xl">
                {program.title}
              </h1>
              {program.institution && (
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-xl font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)]">
                    {program.institution.name}
                  </p>
                  {program.institution.location && (
                    <span className="pill">{program.institution.location}</span>
                  )}
                </div>
              )}
              {program.institution?.shortDescription && (
                <p className="mt-3 max-w-2xl text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                  {program.institution.shortDescription}
                </p>
              )}
            </div>
            <div className="surface-card p-6">
              <dl className="grid gap-4">
                {program.durationMonths && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      Duration
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-[color:var(--color-secondary)]">
                      {program.durationMonths} months
                    </dd>
                  </div>
                )}
                {program.deliveryMode && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      Delivery mode
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-[color:var(--color-secondary)]">
                      {program.deliveryMode.charAt(0).toUpperCase() +
                        program.deliveryMode.slice(1)}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                    Total fee
                  </dt>
                  <dd className="mt-1 text-xl font-bold text-[color:var(--color-secondary)]">
                    {formatCurrency(program.totalFee)}
                  </dd>
                  {program.emiAvailable && (
                    <p className="mt-1 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      EMI options available
                    </p>
                  )}
                </div>
                {program.applicationDeadline && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      Application deadline
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[color:var(--color-tertiary)]">
                      {formatDate(new Date(program.applicationDeadline))}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-6 flex flex-col gap-3">
                {program.applyUrl ? (
                  <a
                    href={program.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
                  >
                    Apply now
                  </a>
                ) : (
                  <Link
                    href="/#lead-form"
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
                  >
                    Express interest
                  </Link>
                )}
                {program.brochureUrl && (
                  <a
                    href={program.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_40%,transparent)]"
                  >
                    Download brochure
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[var(--surface-base)] py-16">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
            {/* Main Content */}
            <div className="space-y-12">
              {/* Specialisations */}
              {program.specialisations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                    Specialisations
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {program.specialisations.map((spec) => (
                      <div key={spec.id} className="surface-card p-4">
                        <p className="font-semibold text-[color:var(--color-secondary)]">
                          {spec.name}
                        </p>
                        {spec.description && (
                          <p className="mt-1 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                            {spec.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {program.highlights && (
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                    Program highlights
                  </h2>
                  <div className="surface-card mt-4 p-6">
                    <div
                      className="prose prose-sm max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                      dangerouslySetInnerHTML={{ __html: program.highlights }}
                    />
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {program.curriculum && (
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                    Curriculum
                  </h2>
                  <div className="surface-card mt-4 p-6">
                    <div
                      className="prose prose-sm max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                      dangerouslySetInnerHTML={{ __html: program.curriculum }}
                    />
                  </div>
                </div>
              )}

              {/* Outcomes */}
              {program.outcomes && (
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                    Career outcomes
                  </h2>
                  <div className="surface-card mt-4 p-6">
                    <div
                      className="prose prose-sm max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                      dangerouslySetInnerHTML={{ __html: program.outcomes }}
                    />
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {program.eligibility && (
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                    Eligibility criteria
                  </h2>
                  <div className="surface-card mt-4 p-6">
                    <div
                      className="prose prose-sm max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                      dangerouslySetInnerHTML={{ __html: program.eligibility }}
                    />
                  </div>
                  {program.workExperienceMinYears !== null && (
                    <p className="mt-4 text-sm font-semibold text-[color:var(--color-secondary)]">
                      Minimum work experience: {program.workExperienceMinYears}{" "}
                      years
                    </p>
                  )}
                </div>
              )}

              {/* FAQs */}
              {program.faqs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-secondary)]">
                    Frequently asked questions
                  </h2>
                  <div className="mt-4 space-y-4">
                    {program.faqs.map((faq) => (
                      <details
                        key={faq.id}
                        className="surface-card p-6 [&[open]>summary]:text-[color:var(--color-accent)]"
                      >
                        <summary className="cursor-pointer font-semibold text-[color:var(--color-secondary)]">
                          {faq.question}
                        </summary>
                        <div
                          className="prose prose-sm mt-3 max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]"
                          dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                        />
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Fee Breakdown */}
              {program.fees.length > 0 && (
                <div className="surface-card p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                    Fee breakdown
                  </h3>
                  <dl className="mt-4 space-y-3">
                    {program.fees.map((fee) => (
                      <div
                        key={fee.id}
                        className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] pb-2"
                      >
                        <dt className="text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                          {fee.label}
                        </dt>
                        <dd className="text-sm font-semibold text-[color:var(--color-secondary)]">
                          {formatCurrency(fee.amount)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Institution Info */}
              {program.institution && (
                <div className="surface-card p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                    About {program.institution.name}
                  </h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    {program.institution.accreditation && (
                      <div>
                        <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                          Accreditation
                        </dt>
                        <dd className="mt-1 font-semibold text-[color:var(--color-secondary)]">
                          {program.institution.accreditation}
                        </dd>
                      </div>
                    )}
                    {program.institution.establishedYear && (
                      <div>
                        <dt className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                          Established
                        </dt>
                        <dd className="mt-1 font-semibold text-[color:var(--color-secondary)]">
                          {program.institution.establishedYear}
                        </dd>
                      </div>
                    )}
                    {program.institution.website && (
                      <div>
                        <a
                          href={program.institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
                        >
                          Visit institution website
                          <span aria-hidden>→</span>
                        </a>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* CTA */}
              <div className="surface-card bg-gradient-to-br from-[color:color-mix(in_srgb,var(--color-accent)_80%,white_20%)] via-[color:color-mix(in_srgb,var(--color-accent)_65%,white_35%)] to-[color:color-mix(in_srgb,var(--color-accent)_45%,transparent)] p-6 text-[var(--color-accent-foreground)]">
                <h3 className="text-lg font-semibold">
                  Get personalized recommendations
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  Let our AI counselor suggest the best programs based on your
                  profile, goals, and budget in under 2 minutes.
                </p>
                <Link
                  href="/#lead-form"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--color-accent-foreground)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:opacity-90"
                >
                  Start now
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

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
import Image from "next/image";
import { ReactNode } from "react";

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
  if (amount === null || amount === undefined) return "Fee not disclosed";
  if (amount === 0) return "₹0";

  const absAmount = Math.abs(amount);
  const toFixed = (value: number) =>
    value >= 10 ? value.toFixed(1) : value.toFixed(2);

  if (absAmount >= 10_000_000) {
    const crores = amount / 10_000_000;
    return `₹${toFixed(crores)}Cr`;
  }

  if (absAmount >= 100_000) {
    const lakhs = amount / 100_000;
    return `₹${toFixed(lakhs)}L`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: absAmount >= 10_000 ? 0 : 2,
  }).format(amount);
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function parseCurriculum(content: string) {
  const matches = [...content.matchAll(/(SEM\s*\d+\s*:)/gi)];
  if (matches.length === 0) return [];

  return matches
    .map((match, index) => {
      const label = match[1];
      const startIndex = (match.index ?? 0) + label.length;
      const endIndex =
        index + 1 < matches.length
          ? matches[index + 1].index ?? content.length
          : content.length;
      const body = content.slice(startIndex, endIndex).trim();
      const cleaned = body.replace(/^[;,\-\s]+/, "");
      const subjects = cleaned
        .split(/;|\n|•/g)
        .map((item) => item.trim())
        .filter(Boolean);

      if (subjects.length === 0) return null;

      return {
        title: label.replace(":", "").trim().replace(/\s+/g, " "),
        subjects,
      };
    })
    .filter(Boolean) as Array<{ title: string; subjects: string[] }>;
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

  const quickFacts = [
    program.durationMonths
      ? { label: "Duration", value: `${program.durationMonths} months` }
      : null,
    program.deliveryMode
      ? {
          label: "Mode",
          value:
            program.deliveryMode.charAt(0).toUpperCase() +
            program.deliveryMode.slice(1),
        }
      : null,
    program.totalFee
      ? { label: "Total Fee", value: formatCurrency(program.totalFee) }
      : null,
    program.applicationDeadline
      ? {
          label: "Deadline",
          value: formatDate(new Date(program.applicationDeadline)) ?? "",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const curriculumSemesters = program.curriculum
    ? parseCurriculum(program.curriculum)
    : [];

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
      <section className="relative overflow-hidden bg-[color-mix(in_srgb,var(--color-accent)_8%,white_92%)] py-12">
        {program.heroImage && (
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <Image
              src={program.heroImage}
              alt={`${program.title} promotional background`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="section-container relative">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">{program.degreeType}</span>
                {program.isFeatured && (
                  <span className="metric-chip">Featured</span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-[color:var(--color-secondary)] sm:text-5xl">
                {program.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                {program.institution?.logoUrl && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-white">
                    <Image
                      src={program.institution.logoUrl}
                      alt={`${program.institution.name} logo`}
                      fill
                      sizes="48px"
                      className="object-contain p-1.5"
                    />
                  </div>
                )}
                {program.institution && (
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)]">
                      {program.institution.name}
                    </p>
                    {program.institution.location && (
                      <span className="pill font-semibold">
                        {program.institution.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {program.institution?.shortDescription && (
                <p className="max-w-2xl text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                  {program.institution.shortDescription}
                </p>
              )}
              {quickFacts.length > 0 && (
                <dl className="surface-card-muted mt-6 grid gap-6 rounded-2xl p-6 sm:grid-cols-2 md:grid-cols-4">
                  {quickFacts.map((fact) => (
                    <div key={fact.label} className="space-y-1">
                      <dt className="text-[10px] uppercase tracking-[0.25em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                        {fact.label}
                      </dt>
                      <dd className="text-base font-semibold text-[color:var(--color-secondary)]">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="surface-card border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] p-6 shadow-lg">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[color:color-mix(in_srgb,var(--color-secondary)_50%,white_50%)]">
                    Investment
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[color:var(--color-secondary)]">
                    {formatCurrency(program.totalFee)}
                  </p>
                  {program.emiAvailable && (
                    <p className="mt-1 text-xs font-medium text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      EMI plans available
                    </p>
                  )}
                </div>
                {program.applicationDeadline && (
                  <div className="rounded-2xl bg-[color:color-mix(in_srgb,var(--color-accent)_10%,white_90%)] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      Next application deadline
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[color:var(--color-tertiary)]">
                      {formatDate(new Date(program.applicationDeadline))}
                    </p>
                  </div>
                )}
                <div className="grid gap-3">
                  {program.applyUrl ? (
                    <a
                      href={program.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]"
                    >
                      Apply now
                    </a>
                  ) : (
                    <Link
                      href="/#lead-form"
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]"
                    >
                      Express interest
                    </Link>
                  )}
                  {program.brochureUrl && (
                    <a
                      href={program.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-6 py-3 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
                    >
                      Download brochure
                    </a>
                  )}
                </div>
                {program.heroImage && (
                  <div className="relative mt-2 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)]">
                    <Image
                      src={program.heroImage}
                      alt={`${program.title} campus experience`}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[var(--surface-base)] py-16">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Main Content */}
            <div className="space-y-12">
              {program.specialisations.length > 0 && (
                <div className="space-y-6">
                  <span className="eyebrow">Specialisations</span>
                  <h2 className="text-3xl font-semibold text-[color:var(--color-secondary)]">
                    Tailor the MBA to match your ambitions
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {program.specialisations.map((spec) => (
                      <li
                        key={spec.id}
                        className="surface-card-muted rounded-2xl p-5 transition hover:-translate-y-1 hover:[box-shadow:var(--shadow-soft)]"
                      >
                        <p className="text-base font-semibold text-[color:var(--color-secondary)]">
                          {spec.name}
                        </p>
                        {spec.description && (
                          <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                            {spec.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.highlights && (
                <RichContentBlock
                  eyebrow="Program highlights"
                  title="What makes this MBA stand out"
                  html={program.highlights}
                />
              )}

              {program.curriculum && (
                <RichContentBlock
                  eyebrow="Curriculum"
                  title="Learning journey and curriculum snapshot"
                  html={
                    curriculumSemesters.length === 0
                      ? program.curriculum
                      : undefined
                  }
                >
                  {curriculumSemesters.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {curriculumSemesters.map((semester, index) => (
                        <div
                          key={`${semester.title}-${index}`}
                          className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] p-5"
                        >
                          <p className="text-xs uppercase tracking-[0.3em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                            {semester.title}
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                            {semester.subjects.map((subject, index) => (
                              <li
                                key={`${semester.title}-${index}`}
                                className="relative pl-4"
                              >
                                <span className="absolute left-0 top-2 block h-1 w-1 rounded-full bg-[color:var(--color-accent)]" />
                                {subject}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </RichContentBlock>
              )}

              {program.outcomes && (
                <RichContentBlock
                  eyebrow="Career outcomes"
                  title="Where graduates typically go next"
                  html={program.outcomes}
                />
              )}

              {program.eligibility && (
                <RichContentBlock
                  eyebrow="Eligibility"
                  title="Who should apply"
                  html={program.eligibility}
                >
                  {program.workExperienceMinYears !== null && (
                    <p className="mt-4 rounded-xl border border-dashed border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--color-accent)_10%,white_90%)] px-4 py-3 text-sm font-semibold text-[color:var(--color-secondary)]">
                      Minimum work experience: {program.workExperienceMinYears}{" "}
                      {program.workExperienceMinYears === 1 ? "year" : "years"}
                    </p>
                  )}
                </RichContentBlock>
              )}

              {program.faqs.length > 0 && (
                <div className="space-y-6">
                  <span className="eyebrow">Frequently asked</span>
                  <h2 className="text-3xl font-semibold text-[color:var(--color-secondary)]">
                    Answers before you apply
                  </h2>
                  <div className="space-y-4">
                    {program.faqs.map((faq) => (
                      <details
                        key={faq.id}
                        className="group rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] p-6 transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)]"
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-[color:var(--color-secondary)]">
                          <span>{faq.question}</span>
                          <span className="text-xl text-[color:color-mix(in_srgb,var(--color-secondary)_45%,white_55%)] transition group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <div
                          className="prose prose-sm mt-3 max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)] group-open:animate-fade-in"
                          dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                        />
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              {program.fees.length > 0 && (
                <div className="surface-card p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                    Investment breakdown
                  </h3>
                  <dl className="mt-4 divide-y divide-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)]">
                    {program.fees.map((fee) => (
                      <div
                        key={fee.id}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
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

              {program.institution && (
                <div className="surface-card p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                    About {program.institution.name}
                  </h3>
                  <dl className="mt-4 space-y-4 text-sm">
                    {program.institution.accreditation && (
                      <div>
                        <dt className="text-xs uppercase tracking-[0.25em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                          Accreditation
                        </dt>
                        <dd className="mt-1 font-semibold text-[color:var(--color-secondary)]">
                          {program.institution.accreditation}
                        </dd>
                      </div>
                    )}
                    {program.institution.establishedYear && (
                      <div>
                        <dt className="text-xs uppercase tracking-[0.25em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
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
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:underline"
                        >
                          Visit institution website
                          <span aria-hidden>→</span>
                        </a>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              <div className="surface-card bg-gradient-to-br from-[color:color-mix(in_srgb,var(--color-accent)_80%,white_20%)] via-[color:color-mix(in_srgb,var(--color-accent)_65%,white_35%)] to-[color:color-mix(in_srgb,var(--color-accent)_45%,transparent)] p-6 text-[var(--color-accent-foreground)]">
                <h3 className="text-lg font-semibold">
                  Get personalised recommendations
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  Let our AI counselor shortlist programs aligned with your
                  goals, budget, and experience in under two minutes.
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

function RichContentBlock({
  eyebrow,
  title,
  html,
  children,
}: {
  eyebrow?: string;
  title: string;
  html?: string;
  children?: ReactNode;
}) {
  const showHtml = typeof html === "string" && html.trim().length > 0;

  return (
    <section className="space-y-6">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl font-semibold text-[color:var(--color-secondary)]">
        {title}
      </h2>
      <div className="surface-card p-6">
        {showHtml && (
          <div
            className="prose prose-sm max-w-none text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)] prose-headings:text-[color:var(--color-secondary)] prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: html! }}
          />
        )}
        {children}
      </div>
    </section>
  );
}

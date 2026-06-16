import { db } from "@/db";
import {
  institutions,
  programs,
  programSpecialisations,
  programFees,
  programFaqs,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";
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
    db
      .select()
      .from(programFees)
      .where(eq(programFees.programId, id))
      .orderBy(asc(programFees.id)),
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

function parseCurriculum({
  content,
}: {
  content: string;
}): ParseCurriculumResult {
  const matches = [
    ...content.matchAll(/(SEM(?:ESTER)?\s*\d+)\s*(?:[:\-•]|$)/gi),
  ];

  if (matches.length > 0) {
    const semesters = matches
      .map((match, index) => {
        const label = match[1];
        const startIndex = (match.index ?? 0) + match[0].length;
        const endIndex =
          index + 1 < matches.length
            ? matches[index + 1].index ?? content.length
            : content.length;
        const body = content.slice(startIndex, endIndex).trim();
        const cleaned = body.replace(/^[;,\-\s•:]+/, "");
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

    if (semesters.length > 0) {
      return { semesters, modules: null, rawHtml: null };
    }
  }

  const firstBulletIndex = content.indexOf("•");
  if (firstBulletIndex !== -1) {
    const prefix = content.slice(0, firstBulletIndex).trim();
    const colonIndex = prefix.lastIndexOf(":");
    const titleCandidate =
      colonIndex !== -1
        ? prefix.slice(0, colonIndex).trim()
        : prefix.length > 0
        ? prefix
        : null;

    const items = content
      .slice(firstBulletIndex)
      .split("•")
      .map((item) => item.replace(/^[\s:;\-\u2022]+/, "").trim())
      .filter(Boolean);

    if (items.length > 0) {
      return {
        semesters: [],
        modules: {
          title: titleCandidate,
          items,
        },
        rawHtml: null,
      };
    }
  }

  return { semesters: [], modules: null, rawHtml: content };
}

function parseHighlights({
  content,
}: {
  content: string;
}): ParseHighlightsResult {
  if (!content || content.trim().length === 0) {
    return { entries: [], rawHtml: null };
  }

  const withNormalizedBreaks = content
    .replace(/\r\n|\r/g, "\n")
    .replace(/[\u2022•·]/g, "\n")
    .replace(/\s[-–—]\s/g, "\n")
    .replace(/(\.)(\s+)/g, "$1\n");

  const segments = withNormalizedBreaks
    .split("\n")
    .flatMap((segment) => segment.split(";"))
    .map((segment) => segment.trim())
    .map((segment) => segment.replace(/^[\-–—•\u2022]+/, "").trim())
    .filter(Boolean);

  const entries: HighlightEntry[] = [];

  segments.forEach((segment, index) => {
    const cleaned = segment
      .replace(/\s+/g, " ")
      .replace(/[.,;]+$/, "")
      .trim();
    if (!cleaned) return;

    const colonIndex = cleaned.indexOf(":");
    if (colonIndex > 0 && colonIndex < cleaned.length - 1) {
      const label = cleaned.slice(0, colonIndex).trim();
      const value = cleaned.slice(colonIndex + 1).trim();
      if (value.length === 0) {
        entries.push({
          id: buildHighlightId({ value: label, fallback: index }),
          value: label,
        });
        return;
      }
      entries.push({
        id: buildHighlightId({ label, value, fallback: index }),
        label,
        value,
      });
      return;
    }

    entries.push({
      id: buildHighlightId({ value: cleaned, fallback: index }),
      value: cleaned,
    });
  });

  if (entries.length === 0) {
    return { entries: [], rawHtml: content };
  }

  return { entries, rawHtml: null };
}

function buildHighlightId({
  label,
  value,
  fallback,
}: {
  label?: string;
  value: string;
  fallback: number;
}) {
  const source = label ? `${label}-${value}` : value;
  const normalized = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (normalized.length > 0) return `highlight-${normalized}`;
  return `highlight-${fallback}`;
}

function parseEligibility({
  content,
}: {
  content: string;
}): ParseHighlightsResult {
  return parseHighlights({ content });
}

function getFeeBreakdown({
  fees,
}: {
  fees: ProgramFeeRow[];
}): FeeBreakdownResult {
  if (!Array.isArray(fees) || fees.length === 0) {
    return { groups: [], others: [], totals: [] };
  }

  const groupsByYear = new Map<number, FeeGroupAccumulator>();
  const totals: FeeEntry[] = [];
  const others: FeeEntry[] = [];

  fees.forEach((fee) => {
    const label = typeof fee.label === "string" ? fee.label.trim() : "";
    if (!label) return;

    if (isTotalLabel({ label })) {
      totals.push({ id: fee.id, label, amount: fee.amount });
      return;
    }

    const yearNumber = extractYear({ label });
    const semesterNumber = extractSemester({ label });

    if (yearNumber !== undefined && semesterNumber === undefined) {
      const group =
        groupsByYear.get(yearNumber) ?? createYearGroup({ year: yearNumber });
      group.title = label;
      group.amount = fee.amount;
      group.hasCustomTitle = true;
      groupsByYear.set(yearNumber, group);
      return;
    }

    if (semesterNumber !== undefined) {
      const inferredYear =
        yearNumber !== undefined
          ? yearNumber
          : Math.max(1, Math.ceil(semesterNumber / 2));
      const group =
        groupsByYear.get(inferredYear) ??
        createYearGroup({ year: inferredYear });
      group.semesters.push({
        id: fee.id,
        label,
        amount: fee.amount,
        order: semesterNumber,
      });
      groupsByYear.set(inferredYear, group);
      return;
    }

    others.push({ id: fee.id, label, amount: fee.amount });
  });

  const groups = Array.from(groupsByYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([, group]) => ({
      key: group.key,
      title: group.title,
      amount: group.amount,
      semesters: group.semesters
        .sort((a, b) => a.order - b.order)
        .map(({ order, ...rest }) => rest),
    }))
    .filter(
      (group) => group.amount !== undefined || group.semesters.length > 0
    );

  others.sort((a, b) => a.label.localeCompare(b.label));
  totals.sort((a, b) => a.label.localeCompare(b.label));

  return { groups, others, totals };
}

function isTotalLabel({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  return normalized.includes("total");
}

function extractYear({ label }: { label: string }) {
  const match = label.match(/year\s+([ivx]+|\d+)/i);
  if (!match) return undefined;
  const token = match[1];
  if (/^\d+$/.test(token)) {
    const numeric = parseInt(token, 10);
    return Number.isFinite(numeric) ? numeric : undefined;
  }
  return romanToNumber({ roman: token });
}

function extractSemester({ label }: { label: string }) {
  const ordinalMatch = label.match(/(\d+)(?:st|nd|rd|th)\s+semester/i);
  if (ordinalMatch) {
    const numeric = parseInt(ordinalMatch[1], 10);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  const shorthandMatch = label.match(/sem(?:ester)?\s*(\d+)/i);
  if (shorthandMatch) {
    const numeric = parseInt(shorthandMatch[1], 10);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  return undefined;
}

function createYearGroup({ year }: { year: number }): FeeGroupAccumulator {
  return {
    key: `year-${year}`,
    title: buildDefaultYearTitle({ year }),
    amount: undefined,
    semesters: [],
    hasCustomTitle: false,
  };
}

function buildDefaultYearTitle({ year }: { year: number }) {
  const start = Math.max(1, year * 2 - 1);
  const end = Math.max(start, year * 2);
  return `Year ${toRoman({ value: year })} (Sem ${start}–${end})`;
}

function toRoman({ value }: { value: number }) {
  if (!Number.isFinite(value) || value <= 0) return String(value);
  const numerals = [
    "",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];
  if (value < numerals.length) return numerals[value];
  return String(value);
}

function romanToNumber({ roman }: { roman: string }) {
  const lookup: Record<string, number> = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
    ix: 9,
    x: 10,
  };
  const normalized = roman.toLowerCase();
  return lookup[normalized];
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

  const curriculumContent = program.curriculum
    ? parseCurriculum({ content: program.curriculum })
    : { semesters: [], modules: null, rawHtml: null };
  const feeBreakdown = getFeeBreakdown({ fees: program.fees });
  const highlightContent = program.highlights
    ? parseHighlights({ content: program.highlights })
    : { entries: [], rawHtml: null };
  const highlightPairs = highlightContent.entries.filter(
    (entry) => entry.label
  );
  const highlightBullets = highlightContent.entries.filter(
    (entry) => !entry.label
  );
  const eligibilityContent = program.eligibility
    ? parseEligibility({ content: program.eligibility })
    : { entries: [], rawHtml: null };
  const eligibilityPairs = eligibilityContent.entries.filter(
    (entry) => entry.label
  );
  const eligibilityBullets = eligibilityContent.entries.filter(
    (entry) => !entry.label
  );

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
                    Tailored to your ambitions
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
                  title="What makes this program stand out"
                  html={highlightContent.rawHtml ?? undefined}
                >
                  {(highlightPairs.length > 0 ||
                    highlightBullets.length > 0) && (
                    <div className="space-y-4">
                      {highlightPairs.length > 0 && (
                        <dl className="grid gap-3 sm:grid-cols-2">
                          {highlightPairs.map((entry) => (
                            <div
                              key={entry.id}
                              className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_96%,white_4%)] p-4"
                            >
                              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                                {entry.label}
                              </dt>
                              <dd className="mt-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                                {entry.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {highlightBullets.length > 0 && (
                        <ul className="grid gap-2">
                          {highlightBullets.map((entry) => (
                            <li
                              key={entry.id}
                              className="flex items-start gap-3 rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-white px-4 py-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                            >
                              <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                              <span>{entry.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </RichContentBlock>
              )}

              {program.curriculum && (
                <RichContentBlock
                  eyebrow="Curriculum"
                  title="Learning journey and curriculum snapshot"
                  html={
                    curriculumContent.semesters.length === 0
                      ? curriculumContent.rawHtml ?? program.curriculum
                      : undefined
                  }
                >
                  {curriculumContent.semesters.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)]">
                      <table className="w-full border-collapse text-left">
                        <tbody>
                          {curriculumContent.semesters.map(
                            (semester, index) => (
                              <tr
                                key={`${semester.title}-${index}`}
                                className="border-b border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] last:border-none"
                              >
                                <th
                                  scope="row"
                                  className="align-top bg-[color:color-mix(in_srgb,var(--surface-subtle)_90%,white_10%)] px-4 py-4 text-xs uppercase tracking-[0.3em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)] sm:w-40 md:w-48"
                                >
                                  {semester.title}
                                </th>
                                <td className="px-4 py-4">
                                  <ul className="space-y-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                                    {semester.subjects.map(
                                      (subject, subjectIndex) => (
                                        <li
                                          key={`${semester.title}-${subjectIndex}`}
                                          className="flex items-start gap-2"
                                        >
                                          <span className="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                                          <span>{subject}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
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
                  html={
                    eligibilityContent.entries.length === 0
                      ? eligibilityContent.rawHtml ?? program.eligibility
                      : undefined
                  }
                >
                  {(eligibilityPairs.length > 0 ||
                    eligibilityBullets.length > 0) && (
                    <div className="space-y-4">
                      {eligibilityPairs.length > 0 && (
                        <dl className="grid gap-3 sm:grid-cols-2">
                          {eligibilityPairs.map((entry) => (
                            <div
                              key={entry.id}
                              className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_96%,white_4%)] p-4"
                            >
                              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                                {entry.label}
                              </dt>
                              <dd className="mt-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                                {entry.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {eligibilityBullets.length > 0 && (
                        <ul className="grid gap-2">
                          {eligibilityBullets.map((entry) => (
                            <li
                              key={entry.id}
                              className="flex items-start gap-3 rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-white px-4 py-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]"
                            >
                              <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                              <span>{entry.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

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
              {(feeBreakdown.groups.length > 0 ||
                feeBreakdown.others.length > 0 ||
                feeBreakdown.totals.length > 0) && (
                <div className="surface-card p-6">
                  <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                    Investment breakdown
                  </h3>
                  <div className="mt-4 space-y-4">
                    {feeBreakdown.groups.map((group) => (
                      <div
                        key={group.key}
                        className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-[color:var(--color-secondary)]">
                            {group.title}
                          </span>
                          {typeof group.amount === "number" && (
                            <span className="text-sm font-semibold text-[color:var(--color-secondary)]">
                              {formatCurrency(group.amount)}
                            </span>
                          )}
                        </div>
                        {group.semesters.length > 0 && (
                          <dl className="mt-3 divide-y divide-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)]">
                            {group.semesters.map((semester) => (
                              <div
                                key={semester.id}
                                className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                              >
                                <dt className="text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                                  {semester.label}
                                </dt>
                                <dd className="text-sm font-semibold text-[color:var(--color-secondary)]">
                                  {formatCurrency(semester.amount)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                    ))}

                    {feeBreakdown.others.length > 0 && (
                      <dl className="divide-y divide-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white">
                        {feeBreakdown.others.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 px-4 py-3 first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            <dt className="text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                              {item.label}
                            </dt>
                            <dd className="text-sm font-semibold text-[color:var(--color-secondary)]">
                              {formatCurrency(item.amount)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {feeBreakdown.totals.length > 0 && (
                      <div className="rounded-2xl bg-[color:color-mix(in_srgb,var(--color-accent)_14%,white_86%)] p-4">
                        <dl className="space-y-2">
                          {feeBreakdown.totals.map((total) => (
                            <div
                              key={total.id}
                              className="flex items-center justify-between gap-3"
                            >
                              <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                                {total.label}
                              </dt>
                              <dd className="text-base font-bold text-[color:var(--color-tertiary)]">
                                {formatCurrency(total.amount)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>
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

              <div className="surface-card bg-gradient-to-br from-[color:color-mix(in_srgb,var(--color-accent)_80%,white_20%)] via-[color:color-mix(in_srgb,var(--color-accent)_65%,white_35%)] to-[color:color-mix(in_srgb,var(--color-accent)_45%,transparent)] p-6 text-black">
                <h3 className="text-lg font-semibold">
                  Get personalised recommendations
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  Let our AI counselor shortlist programs aligned with your
                  goals, budget, and experience in under two minutes.
                </p>
                <Link
                  href="/#lead-form"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--color-accent-foreground)] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
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

interface ParseCurriculumResult {
  semesters: Array<{ title: string; subjects: string[] }>;
  modules: { title: string | null; items: string[] } | null;
  rawHtml: string | null;
}

interface ParseHighlightsResult {
  entries: HighlightEntry[];
  rawHtml: string | null;
}

interface HighlightEntry {
  id: string;
  label?: string;
  value: string;
}

interface ProgramFeeRow {
  id: number;
  label: string;
  amount: number;
}

interface FeeEntry {
  id: number;
  label: string;
  amount: number;
}

interface FeeEntryWithOrder extends FeeEntry {
  order: number;
}

interface FeeBreakdownGroup {
  key: string;
  title: string;
  amount?: number;
  semesters: FeeEntry[];
}

interface FeeBreakdownResult {
  groups: FeeBreakdownGroup[];
  others: FeeEntry[];
  totals: FeeEntry[];
}

interface FeeGroupAccumulator {
  key: string;
  title: string;
  amount?: number;
  semesters: FeeEntryWithOrder[];
  hasCustomTitle: boolean;
}

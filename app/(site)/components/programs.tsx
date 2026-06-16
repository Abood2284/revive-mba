// components/sections/programs.tsx
"use client";
import * as React from "react";
import Link from "next/link";

export type Program = {
  id: string;
  title: string;
  university: string;
  specialization: string;
  mode: "online" | "blended" | "distance";
  durationMonths: number;
  totalFeeINR: number;
  nextIntake?: string;
  badges?: string[];
  heroImage?: string;
  degreeType?: string;
};

type Props = {
  initial?: {
    maxFee?: number;
    specialization?: string;
    q?: string;
  };
};

export function ProgramsSection({ initial }: Props) {
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [maxFee, setMaxFee] = React.useState<number>(initial?.maxFee ?? 600000);
  const [spec, setSpec] = React.useState<string>(initial?.specialization ?? "");
  const [sort, setSort] = React.useState<string>("relevance");
  const [search, setSearch] = React.useState<string>(initial?.q ?? "");
  const [showAll, setShowAll] = React.useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    React.useState<boolean>(false);

  const fetchPrograms = React.useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/programs", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load programs: ${response.statusText}`);
      }
      const body = await response.json();
      const programs = (body as { programs: Program[] }).programs;
      if (mountedRef.current) {
        setPrograms(programs.map(normalizeProgram));
      }
    } catch (err) {
      console.error("Failed to load programs", err);
      if (mountedRef.current) {
        setError("We couldn't load programs right now. Please try again.");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Ensure programs are loaded when component mounts
  React.useEffect(() => {
    if (programs.length === 0 && !loading && !error) {
      fetchPrograms();
    }
  }, [programs.length, loading, error, fetchPrograms]);

  // Reset state when component remounts (navigation back to page)
  React.useEffect(() => {
    const hasPrograms = programs.length > 0;
    if (!hasPrograms && !loading && !error) {
      setLoading(true);
      fetchPrograms();
    }
  }, []);

  React.useEffect(() => {
    setShowAll(false);
  }, [programs]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileFiltersOpen]);

  const filtered = React.useMemo(() => {
    const filteredPrograms = programs.filter((p) => {
      const feeOk = p.totalFeeINR <= maxFee;
      const specOk = !spec || p.specialization === spec;
      const queryOk =
        !search ||
        (p.title + " " + p.university + " " + p.specialization)
          .toLowerCase()
          .includes(search.toLowerCase());
      return feeOk && specOk && queryOk;
    });

    // If user hasn't changed sort from default "relevance", maintain API order
    // Otherwise apply user's selected sort
    if (sort === "relevance") {
      return filteredPrograms;
    }
    return filteredPrograms.sort(sorter(sort));
  }, [programs, maxFee, spec, search, sort]);

  const topSlice = 6;
  const visiblePrograms = React.useMemo(() => {
    if (showAll) return filtered;
    return filtered.slice(0, topSlice);
  }, [filtered, showAll]);

  const filteredCount = filtered.length;

  const renderFilters = (
    variant: "desktop" | "mobile",
    options: { onClose?: () => void } = {}
  ) => {
    const { onClose } = options;
    const isDesktop = variant === "desktop";

    if (isDesktop) {
      const gridClasses =
        "grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
      const actionsClasses =
        "mt-6 flex flex-wrap items-center justify-between gap-2";
      const resetButtonClasses =
        "inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]";
      const livePillClasses =
        "inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]";
      const countPillClasses =
        "inline-flex items-center gap-1 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]";

      return (
        <>
          <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[color:var(--color-secondary)]">
                Filter programs
              </h3>
              <p className="mt-1 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                Tune the catalog to surface the most relevant options for you.
              </p>
            </div>
            <Link
              href="/lead-form"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_15%,transparent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
            >
              Need help?
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className={gridClasses}>
            <Field label="Search" className="xl:col-span-2">
              <input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Try NMIMS, Finance, Analytics…"
                className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              />
            </Field>

            {/* Mode and Duration filters removed */}

            <Field label="Specialisation" className="xl:col-span-2">
              <select
                id="spec"
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              >
                <option value="">All specialisations</option>
                <option value="general">General</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="business-analytics">Business Analytics</option>
                <option value="hr">Human Resources</option>
                <option value="operations">Operations</option>
                <option value="it">IT & Systems</option>
                <option value="healthcare">Healthcare</option>
              </select>
            </Field>

            <Field label="Max total fee (₹)" className="xl:col-span-2">
              <div className="flex flex-col gap-3">
                <input
                  id="fee"
                  type="range"
                  min={50000}
                  max={600000}
                  step={10000}
                  value={maxFee}
                  onChange={(e) => setMaxFee(parseInt(e.target.value, 10))}
                  style={{ accentColor: "#ED1C24" }}
                  className="h-2 w-full rounded-full bg-[#d9dce6]"
                />
                <div className="flex items-center justify-between rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                  <span>Up to</span>
                  <span className="tabular-nums">₹{formatINR(maxFee)}</span>
                </div>
              </div>
            </Field>

            <Field label="Sort by">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.25)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              >
                <option value="relevance">Relevance</option>
                <option value="fee-asc">Lowest fee</option>
                <option value="duration-asc">Shortest duration</option>
                <option value="deadline-soon">Soonest intake</option>
              </select>
            </Field>
          </div>

          <div className={actionsClasses}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setMaxFee(600000);
                  setSpec("");
                  setSort("relevance");
                }}
                className={resetButtonClasses}
              >
                Reset filters
              </button>
              <div className={livePillClasses}>
                <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
                Live updated
              </div>
              <div className={countPillClasses}>
                {loading
                  ? "Loading…"
                  : `${filteredCount} ${
                      filteredCount === 1 ? "program" : "programs"
                    }`}
              </div>
            </div>
            <a
              href="#programs-list"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ED1C24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b8161b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED1C24]"
            >
              Show Programs
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="-mr-1"
              >
                <path
                  d="M13 5l7 7-7 7M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </>
      );
    }

    const showLabel = loading
      ? "Show results"
      : `Show ${filteredCount} ${filteredCount === 1 ? "program" : "programs"}`;

    return (
      <>
        <div className="flex items-center justify-end pb-2">
          <Link
            href="/lead-form"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]"
          >
            Need help?
          </Link>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white text-[color:var(--color-secondary)] shadow-[0_12px_24px_-16px_rgba(16,19,26,0.28)]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="space-y-3">
          <Field label="Search">
            <input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try NMIMS, Finance, Analytics…"
              className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-secondary)] shadow-[0_10px_18px_-16px_rgba(16,19,26,0.2)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
            />
          </Field>

          <div className="flex flex-wrap gap-3">
            <Field label="Sort by" className="flex-1 min-w-[140px]">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2 text-sm text-[color:var(--color-secondary)] shadow-[0_10px_18px_-16px_rgba(16,19,26,0.2)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              >
                <option value="relevance">Relevance</option>
                <option value="fee-asc">Lowest fee</option>
                <option value="duration-asc">Shortest duration</option>
                <option value="deadline-soon">Soonest intake</option>
              </select>
            </Field>
          </div>

          <Field label="Specialisation">
            <select
              id="spec"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="w-full rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-white px-4 py-2 text-sm text-[color:var(--color-secondary)] shadow-[0_10px_18px_-16px_rgba(16,19,26,0.2)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
            >
              <option value="">All specialisations</option>
              <option value="general">General</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="business-analytics">Business Analytics</option>
              <option value="hr">Human Resources</option>
              <option value="operations">Operations</option>
              <option value="it">IT & Systems</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setMaxFee(600000);
              setSpec("");
              setSort("relevance");
            }}
            className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
          >
            Reset
          </button>
          <div className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
            Live
          </div>
          <div className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-1 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
            {loading
              ? "…"
              : `${filteredCount} ${
                  filteredCount === 1 ? "program" : "programs"
                }`}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
            >
              {showLabel}
            </button>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <section className="w-full bg-[#f5f6fa] text-[#10131a]">
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex min-h-[100dvh] md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-[#10131a]/45 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full min-h-[100dvh] w-full max-w-md flex-col overflow-y-auto rounded-l-3xl bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] px-6 pb-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 shadow-[0_28px_48px_-24px_rgba(16,19,26,0.4)]">
            {renderFilters("mobile", {
              onClose: () => setMobileFiltersOpen(false),
            })}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <header className="mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#514EA1]">
            <span
              aria-hidden
              className="inline-flex h-1.5 w-1.5 rounded-full bg-[#3D38B8]"
            />
            Program catalog
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            Explore over 100 online universities & Compare on 30+ factors
          </h2>
        </header>

        <div className="space-y-4">
          <div className="hidden rounded-3xl border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] p-6 shadow-[0_28px_48px_-32px_rgba(16,19,26,0.32)] md:block md:p-8">
            {renderFilters("desktop")}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              aria-label={`Open filters${
                loading
                  ? ""
                  : ` (${filteredCount} ${
                      filteredCount === 1 ? "program" : "programs"
                    })`
              }`}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--color-secondary)] shadow-[0_12px_24px_-18px_rgba(16,19,26,0.3)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_28%,transparent)]"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M7 12h10M10 18h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Filters</span>
              <span className="rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                {loading ? "…" : `${filteredCount}`}
              </span>
            </button>
          </div>

          <div id="programs-list">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchPrograms} />
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {visiblePrograms.map((p) => (
                    <li key={p.id}>
                      <ProgramCard program={p} />
                    </li>
                  ))}
                </ul>

                {filteredCount > topSlice && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAll((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-6 py-2.5 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)]"
                      aria-expanded={showAll}
                    >
                      {showAll ? "Show fewer programs" : "View all programs"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={`transition ${showAll ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const {
    id,
    title,
    university,
    mode,
    durationMonths,
    totalFeeINR,
    heroImage,
  } = program;

  const facts: Array<{
    label: string;
    value: string;
    hideOnMobile?: boolean;
  }> = [
    { label: "Mode", value: capital(mode), hideOnMobile: true },
    { label: "Duration", value: `${durationMonths} mo` },
    { label: "Fee", value: `₹${formatINR(totalFeeINR)}` },
  ];

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-[#d9dce6] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#3D38B8] hover:shadow-lg">
      {heroImage ? (
        <div className="relative -mx-1 -mt-1 mb-6 hidden overflow-hidden rounded-2xl border border-[#eceef4] bg-[#f5f6fa] md:block">
          <img
            src={heroImage}
            alt={`${title} hero`}
            loading="lazy"
            className="h-40 w-full object-cover transition duration-300 ease-out group-hover:scale-105"
          />
        </div>
      ) : null}

      <h3 className="text-xl font-semibold leading-snug text-[#10131a]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#5a6072]">{university}</p>

      <div className="mt-auto border-t border-[#eceef4] pt-6">
        <div className="flex items-center gap-3">
          <a
            href={`/programs/${id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#3D38B8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            View details
          </a>
          <a
            href={`/compare?ids=${id}`}
            aria-label="Add to compare"
            className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] px-5 py-3 text-sm font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Compare
          </a>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.2em] text-[#9197ad] sm:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className={`space-y-1 ${
                fact.hideOnMobile ? "hidden md:block" : ""
              }`}
            >
              <dt>{fact.label}</dt>
              <dd className="text-[11px] font-medium tracking-normal text-[#5a6072]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[1.8rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-white/60 p-8 shadow-[0_28px_48px_-32px_rgba(16,19,26,0.18)]"
        >
          <div className="mb-6 h-40 w-full rounded-2xl bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)]" />
          <div className="mb-3 h-5 w-3/4 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)]" />
          <div className="mb-5 h-4 w-1/2 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)]" />
          <div className="mt-5 flex gap-3">
            <div className="h-9 flex-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)]" />
            <div className="h-9 w-24 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#edb1b3] bg-[#fdecee] p-10 text-center text-sm text-[#b3161b]">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-[#ED1C24] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b8161b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED1C24]"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-[#d9dce6] bg-[#f5f6fa] p-12 text-center">
      <p className="text-sm text-[#5a6072]">
        No programs match your filters yet. Adjust the fee cap or choose “Any”.
      </p>
      <a
        href="/counseling"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
      >
        Get a personalised shortlist
      </a>
    </div>
  );
}

function parseRange(dur: string | null | string): [number, number] {
  if (!dur) return [0, 10_000];
  const [a, b] = String(dur)
    .split("-")
    .map((x) => parseInt(x, 10));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return [0, 10_000];
  return [a, b];
}

function sorter(key: string) {
  switch (key) {
    case "fee-asc":
      return (a: Program, b: Program) => a.totalFeeINR - b.totalFeeINR;
    case "duration-asc":
      return (a: Program, b: Program) => a.durationMonths - b.durationMonths;
    case "deadline-soon":
      return (a: Program, b: Program) =>
        (rankIntake(a.nextIntake) ?? 9e9) - (rankIntake(b.nextIntake) ?? 9e9);
    default:
      return (_a: Program, _b: Program) => 0;
  }
}

function rankIntake(monYear?: string) {
  if (!monYear) return undefined;
  const [mon, yearStr] = monYear.split(" ");
  const year = parseInt(yearStr, 10);
  const monthIndex =
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(mon) + 1;
  if (!year || monthIndex < 1) return undefined;
  return year * 100 + monthIndex;
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeProgram(input: unknown): Program {
  const value = input as Record<string, unknown>;

  const validModes = new Set<Program["mode"]>([
    "online",
    "blended",
    "distance",
  ]);
  const validSpecs = new Set([
    "general",
    "finance",
    "marketing",
    "business-analytics",
    "hr",
    "operations",
    "it",
    "healthcare",
  ]);

  const specializationRaw = value?.specialization;
  const specialization =
    typeof specializationRaw === "string" && validSpecs.has(specializationRaw)
      ? specializationRaw
      : "general";

  const modeRaw = value?.mode;
  const mode =
    typeof modeRaw === "string" && validModes.has(modeRaw as Program["mode"])
      ? (modeRaw as Program["mode"])
      : "online";

  const durationRaw = value?.durationMonths;
  const duration =
    typeof durationRaw === "number" && Number.isFinite(durationRaw)
      ? durationRaw
      : 24;

  const feeRaw = value?.totalFeeINR;
  const fee =
    typeof feeRaw === "number" && Number.isFinite(feeRaw) ? feeRaw : 0;

  const badgesRaw = value?.badges;
  const badges =
    Array.isArray(badgesRaw) && badgesRaw.length > 0
      ? Array.from(
          new Set(
            badgesRaw
              .flatMap((badge) =>
                typeof badge === "string"
                  ? badge
                      .split(";")
                      .map((segment) => segment.trim())
                      .filter(Boolean)
                  : []
              )
              .map((badge) =>
                badge
                  .replace(/\s*\([^)]*\)/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              )
              .filter((badge) => {
                if (!badge) return false;
                const lower = badge.toLowerCase();
                if (
                  lower === "usa/uk/canada recognitions as shown in brochure"
                ) {
                  return false;
                }
                return true;
              })
          )
        ).slice(0, 3)
      : undefined;
  const heroImageRaw = value?.heroImage;
  const heroImage =
    typeof heroImageRaw === "string" && heroImageRaw.trim().length > 0
      ? heroImageRaw
      : undefined;

  const degreeTypeRaw = value?.degreeType;
  const degreeType =
    typeof degreeTypeRaw === "string" && degreeTypeRaw.trim().length > 0
      ? degreeTypeRaw
      : undefined;

  return {
    id:
      typeof value?.id === "string"
        ? value.id
        : String(value?.id ?? crypto.randomUUID()),
    title:
      typeof value?.title === "string" && value.title.trim().length > 0
        ? value.title
        : "Program coming soon",
    university:
      typeof value?.university === "string" &&
      value.university.trim().length > 0
        ? value.university
        : "Partner university",
    specialization,
    mode,
    durationMonths: duration,
    totalFeeINR: fee,
    nextIntake:
      typeof value?.nextIntake === "string" &&
      value.nextIntake.trim().length > 0
        ? value.nextIntake
        : undefined,
    badges,
    heroImage,
    degreeType,
  };
}

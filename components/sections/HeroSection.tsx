"use client";
import Link from "next/link";
// import LiveStudentCounter from "@/components/hero/LiveStudentCounter";

const heroBanner = {
  text: "Limited-time offer: ₹0 today & join our founding advisor circle (ends 10/24)",
};

type HeroMetricIcon = "star" | "graduation" | "users" | "spark";

const metricIcons: Record<HeroMetricIcon, React.ReactNode> = {
  star: (
    <svg
      aria-hidden
      focusable="false"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3.1 2.2 4.7 5.2.6-3.8 3.6 1 5.4L12 14.9l-4.6 2.5 1-5.4-3.8-3.6 5.2-.6L12 3.1Z" />
    </svg>
  ),
  graduation: (
    <svg
      aria-hidden
      focusable="false"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 8 9-4 9 4-9 4-9-4Z" />
      <path d="M12 12v7" />
      <path d="m7 10.5-.5 2.5a4 4 0 0 0 4 4h3a4 4 0 0 0 4-4l-.5-2.5" />
    </svg>
  ),
  users: (
    <svg
      aria-hidden
      focusable="false"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 14a4.5 4.5 0 1 1 9 0" />
      <path d="M3 20.5a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6" />
      <path d="M12 5a3 3 0 0 1 6 0" />
      <path d="M2 11a3 3 0 0 1 6 0" />
    </svg>
  ),
  spark: (
    <svg
      aria-hidden
      focusable="false"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m6.2 6.2 2.8 2.8" />
      <path d="M2 12h4" />
      <path d="m6.2 17.8 2.8-2.8" />
      <path d="M12 18v4" />
      <path d="m15 15 2.8 2.8" />
      <path d="M18 12h4" />
      <path d="m15 9 2.8-2.8" />
    </svg>
  ),
};

const heroMetrics = [
  {
    icon: "star",
    value: "4.9",
    label: "Student rating",
  },
  {
    icon: "graduation",
    value: "45+",
    label: "Partner universities",
  },
  {
    icon: "users",
    value: "27K+",
    label: "Students guided",
  },
] as const;

const heroPartners = [
  "Manipal",
  "NMIMS Global",
  "Symbiosis SCE",
  "Amity Online",
] as const;

const heroInsights = [
  {
    title: "Online MBA Growth Stories",
    description:
      "Swipe-ready creative sequences that highlight industry-specific outcomes in under 15 seconds.",
    metric: "Avg. 32% uplift in lead-to-application",
  },
  {
    title: "AI counsellor scripts",
    description:
      "Deploy adaptive call flows with programmatic objection handling for every intake window.",
    metric: "Cuts handling time to 4m 18s",
  },
  {
    title: "Fee & EMI message tests",
    description:
      "Position tuition clarity and financing options with confidence using Revive split-test data.",
    metric: "41% higher click-to-counsellor rate",
  },
  {
    title: "Faculty credibility blocks",
    description:
      "Pair dean introductions with alumni quotes to reinforce domain authority across funnels.",
    metric: "Keeps bounce under 18%",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface-subtle)] pb-24 pt-20">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-12 px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_88%,white_12%)] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_82%,white_18%)]">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[10px] font-bold text-[color:var(--color-accent-foreground)]">
                ✓
              </span>
              {heroBanner.text}
            </div>
            <h1 className="mt-6 text-balance !text-[5rem] !font-black !leading-[1.1] tracking-tight text-[color:var(--color-secondary)]">
              The MBA Growth Studio
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--color-secondary)_72%,white_28%)]">
              The complete MBA growth platform for institutions. Build
              campaigns, optimize conversions, and scale enrollments with
              data-driven insights.
            </p>

            <div className="mt-8 rounded-[1.6rem] border-2 border-[color:color-mix(in_srgb,var(--color-accent)_24%,transparent)] bg-white p-7 shadow-[0_32px_64px_-16px_rgba(50,34,72,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] ring-1 ring-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-bold text-[color:var(--color-secondary)]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-xs font-bold text-white">
                    ★
                  </span>
                  Find Your Perfect MBA Match
                </span>
                <span className="rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[color:var(--color-accent)]">
                  Free Counseling
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {["Your Background", "Career Goals", "MBA Recommendations"].map(
                  (stage, idx) => (
                    <span
                      key={stage}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_85%,white_15%)] px-4 py-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_82%,white_18%)]"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_22%,transparent)] text-[0.7rem] font-bold text-[color:var(--color-accent)]">
                        {idx + 1}
                      </span>
                      {stage}
                    </span>
                  )
                )}
              </div>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-[color:color-mix(in_srgb,var(--color-secondary)_68%,white_32%)]">
                Share your work experience and salary goals. Get matched with
                MBA programs that fit your budget, timeline, and career
                ambitions—plus scholarship and EMI options.
              </p>
              <Link
                href="/lead-form"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-3.5 text-[0.9375rem] font-bold text-white shadow-[0_8px_24px_-6px_rgba(244,195,194,0.6)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_32px_-8px_rgba(244,195,194,0.7)] active:scale-[0.98]"
              >
                Get Your MBA Shortlist
                <span
                  aria-hidden
                  className="text-lg transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_80%,white_20%)]">
              {heroMetrics.map((metric) => (
                <span
                  key={metric.label}
                  className="flex items-center gap-2 text-[color:var(--color-secondary)]"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_94%,white_6%)] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                    {metricIcons[metric.icon]}
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                    {metric.value}
                  </span>
                  <span className="text-xs uppercase tracking-[0.22em] text-[color:color-mix(in_srgb,var(--color-secondary)_58%,white_42%)]">
                    {metric.label}
                  </span>
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 text-2xl font-extrabold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_82%,white_18%)]">
              {heroPartners.map((partner) => (
                <span key={partner} className="font-black">
                  {partner}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[1fr]">
            {heroInsights.map((insight) => (
              <div
                key={insight.title}
                className="flex h-full flex-col justify-between rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_96%,white_4%)] p-5 shadow-[0_8px_16px_-12px_rgba(63,46,84,0.12)]"
              >
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_88%,white_12%)]">
                    {insight.title}
                  </h3>
                  <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-[color:color-mix(in_srgb,var(--color-secondary)_58%,white_42%)]">
                    {insight.description}
                  </p>
                </div>
                <p className="mt-5 text-[0.8125rem] font-semibold text-[color:color-mix(in_srgb,var(--color-accent)_85%,white_15%)]">
                  {insight.metric}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

// components/sections/testimonials.tsx
"use client";
import * as React from "react";

/**
 * Brand tokens — tune to exact logo hexes later:
 * --rev-blue-800: deep heading blue
 * --rev-blue-700: primary button/links
 * --rev-blue-100/50: soft tints for BG and borders
 * --rev-red-600: shield red accent
 * --rev-red-100/50: red tints for subtle highlights
 */
export type Testimonial = {
  id: string;
  name: string;
  role: string; // e.g., "Senior Analyst @ Deloitte"
  quote: string;
  outcome?: string; // e.g., "53% salary jump"
  avatarUrl?: string;
  initials?: string; // used if no avatar
};

const DEFAULT_ITEMS: Testimonial[] = [
  {
    id: "t1",
    name: "Ritika Sharma",
    role: "Product Manager @ Fintech",
    quote:
      "The counseling was blunt and fair. I stopped chasing shiny brands and picked a program that fit my work schedule and budget.",
    outcome: "Role switch to Product in 6 months",
    initials: "RS",
  },
  {
    id: "t2",
    name: "Aman Verma",
    role: "Senior Analyst @ Consulting",
    quote:
      "The fee breakup and EMI math were crystal—no hidden charges. I applied on time because their deadline alerts kept me honest.",
    outcome: "53% salary jump",
    initials: "AV",
  },
  {
    id: "t3",
    name: "Farah Khan",
    role: "Marketing Lead @ D2C",
    quote:
      "Curriculum mapping helped me shortlist fast. Live + recorded format worked with my travel-heavy calendar.",
    outcome: "Promotion within 4 months",
    initials: "FK",
  },
];

export function TestimonialsSection({
  items = DEFAULT_ITEMS,
  title = "What students say",
  subtitle = "Real, specific outcomes—no exaggerated placement promises.",
}: {
  items?: Testimonial[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      className="w-full bg-white"
      style={
        {
          ["--rev-blue-800" as any]: "#2E3699",
          ["--rev-blue-700" as any]: "#3F49B7",
          ["--rev-blue-100" as any]: "#E8EBFB",
          ["--rev-blue-50" as any]: "#F4F6FE",
          ["--rev-red-600" as any]: "#D6463A",
          ["--rev-red-100" as any]: "#FCE8E6",
          ["--rev-red-50" as any]: "#FEF4F3",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium text-neutral-800 md:gap-2 md:px-3 md:py-1 md:text-xs"
            style={{
              borderColor: "var(--rev-blue-100)",
              background: "var(--rev-blue-50)",
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--rev-blue-700)" }}
            />
            Student outcomes
          </span>
          <h2 className="mt-2 text-xl font-semibold leading-snug text-neutral-900 md:mt-3 md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-xs text-neutral-600 md:text-base">
            {subtitle}
          </p>
        </header>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-10 md:gap-6">
          {items.map((t) => (
            <li key={t.id}>
              <article
                className="h-full rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md md:p-6"
                style={{ borderColor: "var(--rev-blue-100)" }}
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <Avatar
                    name={t.name}
                    url={t.avatarUrl}
                    initials={t.initials}
                  />
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900 md:text-sm">
                      {t.name}
                    </h3>
                    <p className="text-[10px] text-neutral-600 md:text-xs">
                      {t.role}
                    </p>
                  </div>
                </div>

                <blockquote
                  className="mt-2 border-l-4 pl-3 text-xs leading-snug text-neutral-800 md:mt-4 md:pl-4 md:text-sm md:leading-relaxed"
                  style={{ borderColor: "var(--rev-blue-700)" }}
                >
                  “{t.quote}”
                </blockquote>

                {t.outcome && (
                  <div
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[10px] font-medium md:mt-4 md:gap-2 md:px-2.5 md:py-1.5 md:text-xs"
                    style={{
                      color: "var(--rev-red-600)",
                      backgroundColor: "var(--rev-red-50)",
                      borderColor: "var(--rev-red-100)",
                    }}
                  >
                    <StarIcon />
                    {t.outcome}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>

        {/* CTA row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4">
          <a
            href="/counseling"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 md:px-5 md:py-3"
            style={{ backgroundColor: "var(--rev-blue-700)" }}
          >
            Get a personalized shortlist
          </a>
          <a
            href="/resources"
            className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 md:px-5 md:py-3"
            style={{ borderColor: "var(--rev-blue-100)" }}
          >
            Read student guides
          </a>
        </div>
      </div>
    </section>
  );
}

/* ——— atoms ——— */
function Avatar({
  name,
  url,
  initials,
}: {
  name: string;
  url?: string;
  initials?: string;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={`${name} avatar`}
        className="h-9 w-9 rounded-full border object-cover md:h-10 md:w-10"
        style={{ borderColor: "var(--rev-blue-100)" }}
      />
    );
  }
  const inits =
    initials ||
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return (
    <div
      aria-label={`${name} avatar`}
      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white md:h-10 md:w-10 md:text-sm"
      style={{
        background:
          "linear-gradient(180deg, var(--rev-blue-700), var(--rev-blue-800))",
      }}
    >
      {inits}
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="m12 17.27 6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z" />
    </svg>
  );
}

// components/sections/program-detail-header.tsx
"use client";
import * as React from "react";

/**
 * Brand tokens (tweak these to the exact logo hexes once sampled):
 * - Blues: deep → mid → soft for headings, chips, subtle backgrounds.
 * - Reds: accent for highlights/pills/CTA emphasis—use sparingly.
 *
 * Example mapping (adjust to taste):
 *   --rev-blue-800:  #2E3699  (deep royal)
 *   --rev-blue-700:  #3F49B7  (logo-like)
 *   --rev-blue-600:  #4E5AD6
 *   --rev-blue-100:  #E8EBFB
 *   --rev-blue-50:   #F4F6FE
 *   --rev-red-600:   #D6463A  (shield red)
 *   --rev-red-500:   #E1564B
 *   --rev-red-100:   #FCE8E6
 *   --rev-red-50:    #FEF4F3
 */
export type ProgramHeaderProps = {
  title: string;
  university: string;
  mode: "Online" | "Blended" | "Distance";
  durationMonths: number;
  totalFeeINR: number;
  nextIntake?: string;
  approvals?: string[]; // e.g., ["UGC-DEB","NAAC A+","NIRF #42"]
  brochureUrl?: string;
  applyHref?: string;
  enquireHref?: string;
};

export function ProgramDetailHeader({
  title,
  university,
  mode,
  durationMonths,
  totalFeeINR,
  nextIntake,
  approvals = [],
  brochureUrl = "#",
  applyHref = "#",
  enquireHref = "/counseling",
}: ProgramHeaderProps) {
  return (
    <section
      className="w-full bg-white"
      style={
        {
          ["--rev-blue-800" as any]: "#2E3699",
          ["--rev-blue-700" as any]: "#3F49B7",
          ["--rev-blue-600" as any]: "#4E5AD6",
          ["--rev-blue-100" as any]: "#E8EBFB",
          ["--rev-blue-50" as any]: "#F4F6FE",
          ["--rev-red-600" as any]: "#D6463A",
          ["--rev-red-500" as any]: "#E1564B",
          ["--rev-red-100" as any]: "#FCE8E6",
          ["--rev-red-50" as any]: "#FEF4F3",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-6 md:pt-14 md:pb-8">
        {/* Breadcrumb (optional) */}
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/programs" className="hover:text-neutral-900">
                Programs
              </a>
            </li>
            <li aria-hidden>›</li>
            <li className="text-neutral-900">{university}</li>
          </ol>
        </nav>

        {/* Heading block */}
        <div className="mt-4 flex flex-col-reverse gap-6 md:mt-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className="text-3xl font-semibold leading-tight md:text-4xl"
              style={{ color: "var(--rev-blue-800)" }}
            >
              {title}
            </h1>
            <p className="mt-2 text-neutral-700">{university}</p>

            {/* Approvals */}
            {approvals.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {approvals.map((a) => (
                  <span
                    key={a}
                    className="rounded-md px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "var(--rev-blue-50)",
                      color: "var(--rev-blue-700)",
                      border: "1px solid var(--rev-blue-100)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sticky CTA bar on desktop */}
          <div className="w-full md:w-auto">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
              <a
                href={applyHref}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--rev-blue-700)",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
                }}
              >
                Apply / Start process
              </a>
              <a
                href={enquireHref}
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2"
                style={{
                  borderColor: "var(--rev-blue-100)",
                  color: "var(--rev-blue-700)",
                  backgroundColor: "white",
                }}
              >
                Talk to a counselor
              </a>
              <a
                href={brochureUrl}
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2"
                style={{
                  borderColor: "var(--rev-red-100)",
                  color: "var(--rev-red-600)",
                  backgroundColor: "var(--rev-red-50)",
                }}
              >
                Download brochure
              </a>
            </div>
          </div>
        </div>

        {/* Key facts row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FactCard
            label="Mode"
            value={mode}
            accent="blue"
            note="Live + recorded as per university"
          />
          <FactCard
            label="Duration"
            value={`${durationMonths} months`}
            accent="blue"
            note="Includes exams; immersion varies"
          />
          <FactCard
            label="Total fee"
            value={`₹${formatINR(totalFeeINR)}`}
            accent="red"
            note="Tuition + exam + application"
          />
          <FactCard
            label="Next intake"
            value={nextIntake || "TBA"}
            accent="blue"
            note="Apply before deadline"
          />
        </div>

        {/* Subtle info bar */}
        <div
          className="mt-6 rounded-xl border p-4 text-sm"
          style={{
            borderColor: "var(--rev-blue-100)",
            background:
              "linear-gradient(180deg, var(--rev-blue-50), rgba(255,255,255,0.8))",
          }}
        >
          <span
            className="font-semibold"
            style={{ color: "var(--rev-blue-800)" }}
          >
            Transparent fees:
          </span>{" "}
          We list official components only. No hidden charges. EMI options are
          lender-dependent.
        </div>
      </div>

      {/* Light divider */}
      <hr className="mx-auto max-w-7xl border-t border-neutral-200" />
    </section>
  );
}

function FactCard({
  label,
  value,
  note,
  accent = "blue",
}: {
  label: string;
  value: string;
  note?: string;
  accent?: "blue" | "red";
}) {
  const bg = accent === "red" ? "var(--rev-red-50)" : "var(--rev-blue-50)";
  const border =
    accent === "red" ? "var(--rev-red-100)" : "var(--rev-blue-100)";
  const dot = accent === "red" ? "var(--rev-red-600)" : "var(--rev-blue-700)";
  const valueColor =
    accent === "red" ? "var(--rev-red-600)" : "var(--rev-blue-800)";
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-neutral-700">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dot }}
        />
        {label}
      </div>
      <div
        className="mt-1 text-lg font-semibold tracking-tight"
        style={{ color: valueColor }}
      >
        {value}
      </div>
      {note && <div className="mt-1 text-xs text-neutral-600">{note}</div>}
    </div>
  );
}

/* helpers */
function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.max(0, n || 0)
  );
}

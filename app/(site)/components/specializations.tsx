// components/sections/specializations.tsx
"use client";
import Image from "next/image";
import * as React from "react";

export type Spec = {
  slug: string;
  title: string;
  blurb: string;
  programsCount?: number;
  href?: string;
};

const DEFAULT_SPECS: Spec[] = [
  {
    slug: "finance",
    title: "Finance",
    blurb: "Corporate finance, valuation, risk, and markets.",
    programsCount: 34,
    href: "/specializations/finance",
  },
  {
    slug: "marketing",
    title: "Marketing",
    blurb: "Brand, performance, CRM, and product marketing.",
    programsCount: 28,
    href: "/specializations/marketing",
  },
  {
    slug: "business-analytics",
    title: "Business Analytics",
    blurb: "Data storytelling, SQL, ML for managers.",
    programsCount: 22,
    href: "/specializations/business-analytics",
  },
  {
    slug: "hr",
    title: "Human Resources",
    blurb: "Talent, L&D, comp & benefits, HR analytics.",
    programsCount: 19,
    href: "/specializations/hr",
  },
  {
    slug: "operations",
    title: "Operations",
    blurb: "Supply chain, quality, lean and project operations.",
    programsCount: 17,
    href: "/specializations/operations",
  },
  {
    slug: "it",
    title: "IT & Systems",
    blurb: "Digital transformation, ERP, product delivery.",
    programsCount: 14,
    href: "/specializations/it",
  },
];

const iconMap: Record<string, string> = {
  finance: "/images/icons8-bitcoin-accepted-30.png",
  marketing: "/images/icons8-marketing-50.png",
  "business-analytics": "/images/icons8-analytics-30.png",
  hr: "/images/icons8-manager-30.png",
  operations: "/images/icons8-move-node-up-30.png",
  it: "/images/icons8-laptop-settings-30.png",
};

export function SpecializationsSection({
  specs = DEFAULT_SPECS,
}: {
  specs?: Spec[];
}) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9dce6] bg-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#514EA1] md:gap-2 md:px-4 md:py-1 md:text-xs">
            <span
              aria-hidden
              className="inline-flex h-1 w-1 rounded-full bg-[#3D38B8] md:h-1.5 md:w-1.5"
            />
            Specialisations
          </span>
          <h2 className="mt-4 text-xl font-semibold leading-tight text-[#10131a] md:mt-5 md:text-4xl">
            Explore top specialisations
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5a6072] md:mt-4 md:text-base">
            Pick a track that fits your career arc—each page lists the best
            programs, skills you’ll gain, and realistic roles.
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {specs.map((s) => (
            <li key={s.slug}>
              <div className="group block overflow-hidden rounded-xl border border-[#dee1ec] bg-white p-3 shadow-[0_24px_40px_-32px_rgba(16,19,26,0.4)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_32px_50px_-28px_rgba(16,19,26,0.5)] focus-within:ring-2 focus-within:ring-[#3D38B8] md:rounded-2xl md:p-6">
                <div className="flex flex-col items-start gap-2 md:flex-row md:gap-3">
                  <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#d9dce6] bg-[#f5f6fa] md:h-12 md:w-12">
                    <Image
                      src={iconMap[s.slug] ?? "/images/icons8-analytics-30.png"}
                      alt={`${s.title} icon`}
                      width={30}
                      height={30}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h6 className="truncate text-base leading-4 text-[#10131a] md:text-lg md:leading-normal">
                      {s.title}
                    </h6>
                    <p className="mt-2 hidden text-sm leading-relaxed text-[#5a6072] md:block">
                      {s.blurb}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between md:mt-5">
                  <span className="flex-shrink-0 rounded-md bg-[#f5f6fa] px-1 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#3D38B8] md:px-2 md:py-1 md:text-[11px]">
                    {s.programsCount ?? 0} programs
                  </span>
                  <a
                    href={s.href ?? `/specializations/${s.slug}`}
                    className="hidden items-center gap-2 text-sm font-semibold text-[#3D38B8] transition hover:text-[#514EA1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8] md:inline-flex"
                  >
                    See programs
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="transition group-hover:translate-x-0.5"
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

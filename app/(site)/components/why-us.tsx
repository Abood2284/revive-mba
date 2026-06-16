// components/sections/why-us.tsx
"use client";
import * as React from "react";

type Item = {
  title: string;
  body: string;
  icon?: React.ReactNode;
};

const DEFAULT_ITEMS: Item[] = [
  {
    title: "Verified & Updated Data",
    body: "Fees, intakes, eligibility and syllabus sourced from official university documents.",
  },
  {
    title: "Transparent Fees",
    body: "Clear breakup of tuition, exam, and application costs—no surprise charges.",
  },
  {
    title: "Deadline Alerts",
    body: "We track upcoming intakes and application windows so you don’t miss your shot.",
  },
  {
    title: "Unbiased Counseling",
    body: "Recommendations matched to your goals and budget, not to commissions.",
  },
  {
    title: "Accreditation First",
    body: "UGC-DEB / NAAC / NIRF badges called out prominently for every program.",
  },
  {
    title: "Compare & Decide",
    body: "Side-by-side comparisons of fees, duration, mode, and assessments.",
  },
];

export function WhyUsSection({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  return (
    <section className="hidden w-full bg-[#f5f6fa] md:block">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#514EA1]">
            <span
              aria-hidden
              className="inline-flex h-1.5 w-1.5 rounded-full bg-[#3D38B8]"
            />
            Why students pick Revive Education
          </span>
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-[#10131a] md:text-4xl">
            Platform that supports you End-to-End
          </h2>
        </header>

        <div className="mt-12 rounded-3xl border border-[#d9dce6] bg-white p-8 shadow-[0_28px_50px_-35px_rgba(16,19,26,0.35)]">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, index) => (
              <li
                key={index}
                className="rounded-2xl border border-[#e5e7ef] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#3D38B8] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-12 w-12 items-center justify-center"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="text-[#ED1C24]"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#9aa0b3]">
                      0{(index % 9) + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-[#10131a]">
                      {it.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5a6072]">
                      {it.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
          <a
            href="/counseling"
            className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-6 py-3 font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Get free counseling
          </a>
          <a
            href="/compare"
            className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] bg-white px-6 py-3 font-semibold text-[#10131a] transition hover:border-[#514EA1] hover:text-[#3D38B8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#514EA1]"
          >
            Compare programs
          </a>
        </div>
      </div>
    </section>
  );
}

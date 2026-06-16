"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";

type Mentor = {
  name: string;
  role: string;
  credential: string;
  experience: string;
  rating: string;
  consults: string;
  placeholderLabel: string;
};

const mentors: Mentor[] = [
  {
    name: "Dr. Aarav Mehta",
    role: "Lead Mentor · MBA",
    credential: "Former Director, Revive Online",
    experience: "12 years mentoring",
    rating: "4.9",
    consults: "2,430+",
    placeholderLabel: "Add Aarav's portrait",
  },
  {
    name: "Prof. Myra Sinha",
    role: "Sr. Mentor · Analytics",
    credential: "Ex-Head, Fintech Strategy Lab",
    experience: "9 years mentoring",
    rating: "4.8",
    consults: "2,280+",
    placeholderLabel: "Add Myra's portrait",
  },
  {
    name: "Dr. Kabir Anand",
    role: "Industry Coach · Product",
    credential: "Alumnus, ISB Hyderabad",
    experience: "8 years mentoring",
    rating: "4.7",
    consults: "1,940+",
    placeholderLabel: "Add Kabir's portrait",
  },
  {
    name: "Prof. Rhea D'Silva",
    role: "Sr. Mentor · Marketing",
    credential: "Ex-AVP, Hypergrowth SaaS",
    experience: "10 years mentoring",
    rating: "4.8",
    consults: "2,120+",
    placeholderLabel: "Add Rhea's portrait",
  },
  {
    name: "Dr. Vihaan Kapoor",
    role: "Lead Mentor · Finance",
    credential: "Chartered Accountant, CFA",
    experience: "11 years mentoring",
    rating: "4.9",
    consults: "2,560+",
    placeholderLabel: "Add Vihaan's portrait",
  },
];

const CARD_SCROLL_AMOUNT = 320;

export function ExpertGuidanceSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((direction: "prev" | "next") => {
    if (!scrollerRef.current) return;

    const scrollOffset =
      direction === "next" ? CARD_SCROLL_AMOUNT : -CARD_SCROLL_AMOUNT;

    scrollerRef.current.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-[color:color-mix(in_srgb,var(--color-secondary)_92%,black_8%)] py-24 text-white">
      <div className="section-container relative flex flex-col gap-14 max-w-7xl mx-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 text-center">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:color-mix(in_srgb,white_24%,transparent)] bg-[color:color-mix(in_srgb,white_8%,transparent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in_srgb,var(--brand-red)_72%,white_28%)]">
            <span aria-hidden>👋</span> Human-led guidance
          </span>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-[2.75rem]">
            Right guidance from Revive mentors
          </h2>
          <p className="text-lg leading-relaxed text-white/70">
            Our expert faculty counsellors bring industry depth, admissions
            insights, and real-world playbooks so every MBA plan stays personal
            and actionable.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -left-16 inset-y-0 hidden w-40 bg-gradient-to-r from-[color:color-mix(in_srgb,var(--color-secondary)_92%,black_8%)] to-transparent sm:block" />
          <div className="pointer-events-none absolute -right-16 inset-y-0 hidden w-40 bg-gradient-to-l from-[color:color-mix(in_srgb,var(--color-secondary)_92%,black_8%)] to-transparent sm:block" />

          <div className="relative">
            <div
              ref={scrollerRef}
              className="mentor-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] w-full sm:max-w-[72rem] sm:mx-auto"
            >
              <style jsx>{`
                .mentor-scroller::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {mentors.map((mentor) => (
                <article
                  key={mentor.name}
                  className="group relative flex w-[16rem] flex-shrink-0 flex-col overflow-hidden rounded-[1.25rem] bg-white text-[color:var(--color-secondary)] shadow-[0_24px_48px_-16px_rgba(16,19,26,0.3)] ring-1 ring-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between px-4 pt-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--brand-red)_16%,white_84%)] px-2.5 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--brand-red)_88%,black_12%)]">
                      <span aria-hidden>★</span>
                      {mentor.rating}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_18%,white_76%)] px-2.5 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-accent)_84%,black_16%)]">
                      <span aria-hidden>✔</span>
                      {mentor.consults} consults
                    </span>
                  </div>

                  <div className="relative mt-3 flex aspect-[4/5] items-center justify-center overflow-hidden px-4">
                    <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
                      <Image
                        src="/images/mba-teacher.jpg"
                        alt={`${mentor.name} - ${mentor.role}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 px-4 pb-5">
                    <div>
                      <h3 className="text-lg font-bold text-[color:var(--color-secondary)]">
                        {mentor.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[color:color-mix(in_srgb,var(--color-secondary)_64%,white_36%)]">
                        {mentor.role}
                      </p>
                      <p className="mt-1 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                        {mentor.credential}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-[color:color-mix(in_srgb,var(--brand-blue-700)_80%,black_20%)]">
                      {mentor.experience}
                    </p>
                    <Link
                      href="/lead-form"
                      className="mt-2 inline-flex items-center justify-center rounded-full bg-[color:var(--color-secondary)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_16px_-8px_rgba(16,19,26,0.4)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_92%,black_8%)]"
                    >
                      Consult now
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center justify-center sm:flex">
              <button
                type="button"
                onClick={() => handleScroll("prev")}
                aria-label="See previous mentors"
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <span aria-hidden>←</span>
              </button>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center justify-center sm:flex">
              <button
                type="button"
                onClick={() => handleScroll("next")}
                aria-label="See more mentors"
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/lead-form"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
          >
            View all
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

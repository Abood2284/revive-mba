"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ClipboardList,
  FileCheck2,
  ListChecks,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";

export function HowItWorksSection() {
  const steps: Step[] = [
    {
      title: "Tell us your goals",
      body: "Share background, budget, timeline, and preferred learning mode. Takes ~2 minutes.",
      meta: "Personal intake",
      icon: ClipboardList,
    },
    {
      title: "Get a curated shortlist",
      body: "We match accredited online MBAs to your profile—fees, duration, eligibility, deadlines.",
      meta: "Human-curated",
      icon: ListChecks,
    },
    {
      title: "Talk to a counselor",
      body: "Clarify fit, scholarships, EMI options. Straight answers—no commissions or pressure.",
      meta: "Live guidance",
      icon: MessagesSquare,
    },
    {
      title: "Apply with confidence",
      body: "We help with documents and timelines. You submit directly or via our guided flow.",
      meta: "Checklist support",
      icon: FileCheck2,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#EFEEFF] via-white to-transparent"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#514EA1] shadow-sm">
            <span
              aria-hidden
              className="inline-flex h-1.5 w-1.5 rounded-full bg-[#3D38B8]"
            />
            How Revive works
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-snug text-[#10131a] md:text-4xl">
            Shortlist, counsel, apply — with clarity
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6072]">
            A four-step path from confusion to confident choice. Built on
            verified data and fair guidance.
          </p>
        </header>

        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#e2e4ec] bg-white/90 p-6 shadow-[0_12px_40px_-24px_rgba(61,56,184,0.55)] transition duration-300 hover:-translate-y-1 hover:border-[#514EA1]/60 hover:shadow-[0_22px_45px_-25px_rgba(61,56,184,0.65)]"
              >
                {index !== steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-[-14px] top-12 hidden h-px w-12 bg-gradient-to-r from-[#cbcfe2] to-transparent lg:block"
                  />
                )}
                <div className="flex items-start gap-4">
                  <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#534DEB] via-[#4B47CF] to-[#3D38B8] text-white shadow-lg shadow-[#3D38B8]/30">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9197ad]">
                      Phase {index + 1}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-[#10131a]">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-[#5a6072]">
                  {step.body}
                </p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#f3f2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3D38B8]">
                  {step.meta}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/lead-form"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3D38B8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3D38B8]/30 transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Start free counseling
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9dce6] px-6 py-3 text-sm font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Explore programs
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-[#5a6072]">
          Revive Education only lists accredited offerings; fees and details are
          verified from official sources.
        </p>
      </div>
    </section>
  );
}

type Step = {
  title: string;
  body: string;
  meta: string;
  icon: LucideIcon;
};

// components/sections/faqs.tsx
"use client";
import * as React from "react";

export type FAQ = { q: string; a: string; tag?: string };

export function FAQsSection({
  title = "Frequently asked questions",
  subtitle = "Quick, honest answers about programs, eligibility, and fees.",
  items = DEFAULT_FAQS,
  tagFilter,
  emitJsonLd = true,
}: {
  title?: string;
  subtitle?: string;
  items?: FAQ[];
  tagFilter?: string;
  emitJsonLd?: boolean;
}) {
  const filtered = tagFilter ? items.filter((i) => i.tag === tagFilter) : items;

  const jsonLd = emitJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: filtered.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#514EA1]">
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-[#3D38B8]" />
            Need clarity?
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#10131a] md:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6072]">{subtitle}</p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {filtered.map((f, idx) => (
            <FAQItem key={idx} q={f.q} a={f.a} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
          <a
            href="/counseling"
            className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-5 py-3 font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Talk to a counselor
          </a>
          <a
            href="/resources"
            className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] px-5 py-3 font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            Read detailed guides
          </a>
        </div>
      </div>

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className={`group rounded-2xl border border-[#d9dce6] bg-white shadow-sm transition duration-200 ${
        open ? "border-[#3D38B8]" : ""
      }`}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl px-5 py-4 text-left">
        <h3 className="text-base font-semibold text-[#10131a]">{q}</h3>
        <span
          aria-hidden
          className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-sm font-bold transition ${
            open ? "bg-[#3D38B8] text-white" : "border border-[#d9dce6] text-[#3D38B8]"
          }`}
        >
          {open ? "–" : "+"}
        </span>
      </summary>
      <div className="px-5 pb-5 pt-0">
        <div className="rounded-xl border border-[#d9dce6] bg-[#f5f6fa] p-4 text-sm leading-relaxed text-[#404456]">
          {a}
        </div>
        {/fee|EMI|payment/i.test(q) && (
          <p className="mt-2 rounded-lg border border-[#f6c9cc] bg-[#fdecee] px-3 py-2 text-xs text-[#c53d45]">
            Note: Universities may levy application/exam fees separately; EMI terms vary by lender.
          </p>
        )}
      </div>
    </details>
  );
}

const DEFAULT_FAQS: FAQ[] = [
  {
    q: "Are these programs approved for online delivery?",
    a: "We list programs with UGC-DEB approval for distance/online delivery. We also display NAAC grade and NIRF rank where available.",
    tag: "approvals",
  },
  {
    q: "What’s included in the total fee you show?",
    a: "Tuition plus university-published exam and application fees (if stated). We do not add any agency markup.",
    tag: "fees",
  },
  {
    q: "Is an entrance exam required for an Online MBA?",
    a: "Most online MBAs do not require CAT/XAT. Some may conduct their own aptitude tests or rely on past academics and work experience.",
    tag: "eligibility",
  },
  {
    q: "Can I get EMI on fees?",
    a: "Many universities partner with NBFCs for EMIs. Our Fees & EMI calculator helps estimate monthly payouts; exact offers depend on the lender.",
    tag: "fees",
  },
  {
    q: "How do you recommend programs?",
    a: "We match your goals, budget, schedule, and work experience against program data—duration, mode, specialisations, and deadlines—to produce a transparent shortlist.",
    tag: "method",
  },
  {
    q: "Do you guarantee placements?",
    a: "No. We do not make placement guarantees. We share realistic outcomes from alumni and advise on skill-building alongside the MBA.",
    tag: "placements",
  },
];

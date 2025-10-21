import Link from "next/link";

const leadJourney = [
  {
    step: "Profile & goals",
    detail:
      "Map current role, experience, and the outcomes that matter most to you.",
  },
  {
    step: "Course preferences",
    detail:
      "Select degree type, learning mode, and specialisations to narrow matches.",
  },
  {
    step: "Eligibility context",
    detail:
      "Capture category, experience, and flexibility to personalise outreach.",
  },
  {
    step: "Smart recommendations",
    detail:
      "Preview top-fit programs with fit scores and counsellor notes before submitting.",
  },
  {
    step: "Contact confirmation",
    detail:
      "Verify details via OTP and choose your preferred follow-up channel.",
  },
] as const;

export function LeadFormSection() {
  return (
    <section id="lead-form" className="bg-[var(--surface-subtle)] py-24">
      <div className="section-container grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <span className="eyebrow">Lead journey</span>
          <h2 className="mt-4 text-3xl font-bold text-[color:var(--color-secondary)] sm:text-4xl">
            Five guided steps keep completion times under two minutes
          </h2>
          <p className="mt-4 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            Every section is context-aware with smart defaults pulled from
            campaign parameters, so you capture richer data without adding
            friction.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_90%,white_10%)] px-4 py-1.5 font-semibold text-[color:var(--color-secondary)]">
              <span aria-hidden className="text-base">
                ⏱
              </span>
              92 sec avg completion
            </span>
            <span>Verified across 12K+ submissions last intake</span>
          </div>
          <div className="mt-6 space-y-4 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_92%,white_8%)] p-6">
            {leadJourney.map((stage, index) => (
              <div
                key={stage.step}
                className="group flex gap-4 rounded-2xl bg-[color:color-mix(in_srgb,var(--surface-base)_95%,white_5%)] p-4 transition hover:bg-white hover:shadow-[0_16px_32px_-20px_rgba(33,20,59,0.45)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-secondary)] text-sm font-semibold text-[var(--color-primary-foreground)] shadow-[0_8px_18px_-10px_rgba(33,20,59,0.6)] transition group-hover:scale-105 group-hover:bg-[color:var(--color-accent)]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-[color:var(--color-secondary)]">
                    {stage.step}
                  </p>
                  <p className="mt-1 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    {stage.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
            Bank-grade OTP verification keeps personal data safe. You can pause and
            resume anytime with your link.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/lead-form"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_10px_24px_-12px_rgba(238,102,110,0.7)] transition hover:translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
            >
              Start my personalised shortlist
            </Link>
            <Link
              href="/lead-form?view=walkthrough"
              className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_90%,white_10%)] px-5 py-3 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_78%,white_22%)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
            >
              Watch 90-second walkthrough
            </Link>
            <span className="text-xs font-medium text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
              No credit card required • Autosave enabled
            </span>
          </div>
        </div>
        <div className="surface-card p-8">
          <h3 className="text-xl font-semibold text-[color:var(--color-secondary)]">
            Support tiles appear as you move through the form
          </h3>
          <p className="mt-3 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            Your prospects see real-time financing, scholarship, and counsellor
            availability insights exactly when they need reassurance.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_92%,white_8%)] px-4 py-2">
              <span aria-hidden className="text-[0.75rem]">
                📊
              </span>
              EMI & scholarship toggles
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_92%,white_8%)] px-4 py-2">
              <span aria-hidden className="text-[0.75rem]">
                🎯
              </span>
              Outcome-aligned prompts
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_92%,white_8%)] px-4 py-2">
              <span aria-hidden className="text-[0.75rem]">
                🔒
              </span>
              OTP-secure follow-up
            </span>
          </div>
          <div className="mt-6 rounded-[1.25rem] bg-[color:color-mix(in_srgb,var(--surface-subtle)_85%,white_15%)] p-6 shadow-[0_24px_48px_-32px_rgba(33,20,59,0.45)]">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                Selected programme fee
              </p>
              <span className="text-lg font-semibold text-[color:var(--color-secondary)]">
                Rs 2.10L
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                  Tenure
                </p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--color-secondary)]">
                  24 months
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                  Monthly EMI
                </p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--color-secondary)]">
                  Rs 9,450
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                  Savings vs upfront
                </p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--color-secondary)]">
                  Rs 22,300
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
              Calculations use partner NBFC rates. Final EMI subject to lender
              approval.
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_94%,white_6%)] p-6">
            <p className="text-sm italic leading-relaxed text-[color:color-mix(in_srgb,var(--color-secondary)_62%,white_38%)]">
              “I had a shortlist, EMI plan, and counsellor slot in under three
              minutes. The walkthrough felt built for my profile.”
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
              Rahul K · 6 yrs product leadership · Bengaluru
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
            <span className="text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
              Trusted by admissions at
            </span>
            {["NMIMS Global", "Manipal Online", "Amity Online"].map((partner) => (
              <span
                key={partner}
                className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_92%,white_8%)] px-3 py-2"
              >
                {partner}
              </span>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <details className="surface-card-muted p-5 [&[open]>summary]:text-[color:var(--color-secondary)]">
              <summary className="cursor-pointer text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                What happens after I submit the form?
              </summary>
              <p className="mt-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                You can book a counsellor call or continue comparing programmes.
                All recommendations also land in your inbox for later reference.
              </p>
            </details>
            <details className="surface-card-muted p-5 [&[open]>summary]:text-[color:var(--color-secondary)]">
              <summary className="cursor-pointer text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                Can I change my preferences after submission?
              </summary>
              <p className="mt-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                Yes. You can reopen the journey through your confirmation email
                to adjust preferences and regenerate suggestions instantly.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeadFormSection;

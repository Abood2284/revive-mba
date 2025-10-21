import Link from "next/link";

const valueProps = [
  {
    title: "Personalised roadmaps",
    description:
      "Share your goals and constraints, then receive a curated program shortlist with clear next steps in two minutes.",
    metric: "92% form completion rate",
  },
  {
    title: "Counsellor superpowers",
    description:
      "Human experts backed by Revive AI scripts ensure every conversation is consistent, compliant, and actionable.",
    metric: "45 counsellors trained on Revive playbooks",
  },
] as const;

const testimonials = [
  {
    quote:
      "Revive turned a confusing search into a confident decision. The counsellor recap email landed in my inbox before I finished my commute.",
    name: "Rahul S.",
    persona: "Senior Product Manager - Online MBA admit",
  },
] as const;

const journeySteps = [
  {
    title: "Diagnose goals",
    detail:
      "Capture intent, timelines, and budget signals so recommendations feel tailor-made from the first touchpoint.",
  },
  {
    title: "Compare with clarity",
    detail:
      "Benchmark curriculum depth, faculty expertise, and ROI projections side-by-side within a calm decision workspace.",
  },
  {
    title: "Commit confidently",
    detail:
      "Hand off warm, well-informed leads to admissions teams with Revive counsellor summaries and financing options pre-validated.",
  },
] as const;

export function WhyReviveSection() {
  return (
    <section
      id="why-revive"
      className="relative overflow-hidden bg-[var(--surface-base)] py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-20%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--surface-subtle)_72%,white_28%)_0%,rgba(255,255,255,0)_70%)] blur-2xl" />
        <div className="absolute right-[-18%] bottom-[-25%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_55%,white_45%)_0%,rgba(255,255,255,0)_68%)] blur-2xl" />
        <div className="absolute inset-y-0 left-1/3 w-[45%] bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_55%)]" />
      </div>
      <div className="section-container">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_85%,white_15%)] px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-secondary)_78%,white_22%)]">
                Why revive
              </span>
              <h2 className="text-balance !text-[clamp(3.25rem,6vw,4.75rem)] !font-black !leading-[1.05] tracking-[-0.02em] text-[color:var(--color-secondary)]">
                A calmer path from{" "}
                <span className="bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-accent)_65%,white_35%)_0%,color-mix(in_srgb,var(--color-tertiary)_45%,white_55%)_100%)] bg-clip-text text-transparent">
                  intent to enrolment
                </span>
              </h2>
              <p className="max-w-xl text-lg text-[color:color-mix(in_srgb,var(--color-secondary)_68%,white_32%)]">
                Equip your team with structured workflows, coach-ready scripts,
                and ROI snapshots so every learner decision feels grounded—not
                pressured.
              </p>
            </div>
            <ul className="relative space-y-5 pl-3 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)]">
              {journeySteps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex items-start gap-4 rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_88%,white_12%)] p-5 shadow-[0_18px_34px_-26px_rgba(45,25,68,0.4)]"
                >
                  <span
                    className="absolute left-[-28px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-base)_85%,white_15%)] text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)]"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                      {step.title}
                    </p>
                    <p className="text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-secondary)_63%,white_37%)]">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/lead-form"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-primary)] shadow-[0_14px_34px_-22px_rgba(45,25,68,0.55)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              >
                Start your roadmap
              </Link>
              <Link
                href="#programs"
                className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] px-5 py-2.5 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_82%,white_18%)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              >
                Explore programmes
              </Link>
            </div>
          </div>
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {valueProps.map((prop) => (
                <div
                  key={prop.title}
                  className="flex h-full flex-col justify-between rounded-[1.4rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)_0%,color-mix(in_srgb,var(--surface-base)_75%,white_25%)_100%)] p-6 shadow-[0_22px_46px_-28px_rgba(53,36,75,0.38)]"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[color:var(--color-secondary)]">
                      {prop.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      {prop.description}
                    </p>
                  </div>
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-accent)_78%,white_22%)]">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_18%,transparent)] text-xs text-[color:var(--color-accent)]">
                      ✓
                    </span>
                    {prop.metric}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.6rem] border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface-subtle)_90%,white_10%)_0%,color-mix(in_srgb,var(--surface-base)_82%,white_18%)_100%)] p-8 shadow-[0_28px_52px_-30px_rgba(60,44,82,0.36)]">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.name} className="space-y-6">
                  <p className="text-[1.3rem] font-semibold leading-relaxed text-[color:var(--color-secondary)]">
                    “{testimonial.quote}”
                  </p>
                  <footer className="flex flex-col gap-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_62%,white_38%)] sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-semibold text-[color:var(--color-secondary)]">
                      {testimonial.name}
                    </span>
                    <span className="hidden h-[3px] w-10 rounded-full bg-[color:color-mix(in_srgb,var(--color-accent)_62%,white_38%)] sm:inline" />
                    <span className="font-medium text-[color:color-mix(in_srgb,var(--color-secondary)_54%,white_46%)]">
                      {testimonial.persona}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyReviveSection;

import Link from "next/link";

const guidanceTools = [
  {
    title: "ROI forecaster",
    description:
      "Estimate salary growth versus tuition, factoring industry benchmarks and inflation.",
    action: "Open calculator",
  },
  {
    title: "Scholarship finder",
    description:
      "Match institute-specific scholarships and corporate tie-ups with your profile instantly.",
    action: "Check eligibility",
  },
  {
    title: "Application tracker",
    description:
      "Stay on top of deadlines, document checklists, and counsellor reminders in one place.",
    action: "View tracker",
  },
] as const;

export function GuidanceToolsSection() {
  return (
    <section id="guidance" className="bg-[var(--surface-base)] py-24">
      <div className="section-container">
        <div className="max-w-2xl">
          <span className="eyebrow">Guidance tools</span>
          <h2 className="mt-4 text-3xl font-bold text-[color:var(--color-secondary)] sm:text-4xl">
            Built-in calculators that keep learners engaged
          </h2>
          <p className="mt-4 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            Revive tools show real-time value so prospects stay motivated to
            finish the lead journey and continue the counselling conversation.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {guidanceTools.map((tool) => (
            <div key={tool.title} className="surface-card p-8">
              <h3 className="text-xl font-semibold text-[color:var(--color-secondary)]">
                {tool.title}
              </h3>
              <p className="mt-3 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                {tool.description}
              </p>
              <Link
                href="/lead-form"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)]"
              >
                {tool.action}
                <span aria-hidden>-&gt;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GuidanceToolsSection;

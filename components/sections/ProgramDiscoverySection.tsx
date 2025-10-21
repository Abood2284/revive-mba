import Link from "next/link";

const keyBenefits = [
  {
    title: "Study Anywhere",
    description: "Learn at your own pace, on your own schedule",
  },
  {
    title: "Career Growth",
    description: "40% average salary increase within 2 years",
  },
  {
    title: "Industry Ready",
    description: "Curriculum designed with top employers",
  },
] as const;

const successStories = [
  {
    name: "Priya Sharma",
    before: "Marketing Manager",
    after: "VP Marketing",
    increase: "+65%",
  },
  {
    name: "Rajesh Kumar",
    before: "Software Engineer",
    after: "Product Manager",
    increase: "+80%",
  },
] as const;

export function ProgramDiscoverySection() {
  return (
    <section id="why-mba" className="bg-[var(--surface-base)] py-24">
      <div className="section-container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
            Why Online MBA
          </span>
          <h2 className="mt-4 text-balance text-4xl font-bold text-[color:var(--color-secondary)] sm:text-5xl">
            Advance your career while you work
          </h2>
          <p className="mt-6 text-balance text-lg text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
            Join thousands of professionals transforming their careers through
            flexible online MBA programs
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {keyBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-[var(--surface-subtle)] p-8 transition hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-[color:var(--color-secondary)]">
                {benefit.title}
              </h3>
              <p className="mt-3 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mt-16 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-[var(--surface-subtle)] p-8 md:p-12">
          <h3 className="text-2xl font-bold text-[color:var(--color-secondary)]">
            Real career transformations
          </h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {successStories.map((story) => (
              <div
                key={story.name}
                className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] bg-[var(--surface-base)] p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-semibold text-[color:var(--color-secondary)]">
                    {story.name}
                  </p>
                  <span className="text-lg font-bold text-[color:var(--color-accent)]">
                    {story.increase}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                  <span>{story.before}</span>
                  <span>→</span>
                  <span>{story.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/lead-form"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-secondary)] px-8 py-4 text-base font-semibold text-[var(--color-primary-foreground)] transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Get personalized guidance
          </Link>
          <p className="mt-4 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            Free consultation • 2-minute form • Instant recommendations
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProgramDiscoverySection;

const mbaTags = [
  {
    label: "UGC-entitled MBA pathways",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-subtle) 70%, white 30%) 0%, color-mix(in srgb, var(--color-accent) 25%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 85%, white 15%)",
  },
  {
    label: "NAAC A+/NBA accredited cohorts",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-base) 80%, white 20%) 0%, color-mix(in srgb, var(--color-tertiary) 22%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 80%, white 20%)",
  },
  {
    label: "Global faculty masterclasses",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-subtle) 75%, white 25%) 0%, color-mix(in srgb, var(--color-accent) 18%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 82%, white 18%)",
  },
  {
    label: "AI counsellor follow-ups in 2 mins",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-base) 76%, white 24%) 0%, color-mix(in srgb, var(--color-accent) 28%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 78%, white 22%)",
  },
  {
    label: "Executive MBA + PGDM dual tracks",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-subtle) 72%, white 28%) 0%, color-mix(in srgb, var(--color-tertiary) 18%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 83%, white 17%)",
  },
  {
    label: "Scholarship & EMI concierge support",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-base) 78%, white 22%) 0%, color-mix(in srgb, var(--color-accent) 22%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 77%, white 23%)",
  },
  {
    label: "Industry capstones with Fortune 500 mentors",
    background:
      "linear-gradient(120deg, color-mix(in srgb, var(--surface-subtle) 74%, white 26%) 0%, color-mix(in srgb, var(--color-tertiary) 24%, transparent) 100%)",
    color: "color-mix(in srgb, var(--color-secondary) 84%, white 16%)",
  },
] as const;

export function TrustStrip() {
  const marqueeItems = [...mbaTags, ...mbaTags];

  return (
    <section className="bg-[var(--surface-base)] py-5">
      <div className="section-container">
        <div className="relative overflow-hidden">
          <div className="flex min-w-max items-center gap-4 animate-marquee">
            {marqueeItems.map((tag, index) => (
              <span
                key={`${tag.label}-${index}`}
                className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-3 py-[0.35rem] text-[0.7rem] font-medium uppercase tracking-[0.24em]"
                style={{
                  background: tag.background,
                  color: tag.color,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;

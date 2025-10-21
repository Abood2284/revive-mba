const faqs = [
  {
    question: "How fast do I receive programme recommendations?",
    answer:
      "You will get an AI-generated shortlist on-screen instantly with a detailed counsellor recap emailed within two minutes.",
  },
  {
    question: "Is Revive free for prospective learners?",
    answer:
      "Yes. Counselling, comparisons, and tools are free for students. Revive partners with institutions for platform access.",
  },
  {
    question: "Can I pause and revisit my lead form later?",
    answer:
      "Your progress autosaves to the browser. Return within seven days to resume, or request a counsellor callback to finish together.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="bg-[var(--surface-base)] py-24">
      <div className="section-container">
        <div className="max-w-2xl">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 text-3xl font-bold text-[color:var(--color-secondary)] sm:text-4xl">
            Answers before you decide
          </h2>
          <p className="mt-4 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            Transparent policies and fast counsellor responses mean you never
            have to wait days for clarity.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {faqs.map((item) => (
            <div key={item.question} className="surface-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                {item.question}
              </p>
              <p className="mt-3 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;

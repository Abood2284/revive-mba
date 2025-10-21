"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";

type FormStep = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  {
    number: 1,
    title: "About You",
    fields: 5,
    description:
      "Tell us about your current situation and what you want to achieve.",
    timeEstimate: "≈45s",
  },
  {
    number: 2,
    title: "MBA Preferences",
    fields: 6,
    description:
      "Share what kind of MBA program you're looking for and your budget.",
    timeEstimate: "≈60s",
  },
  {
    number: 3,
    title: "Your Background",
    fields: 2,
    description:
      "Help us find scholarships and programs that match your experience.",
    timeEstimate: "≈30s",
  },
  {
    number: 4,
    title: "Your Personalized Match",
    fields: 0,
    description: "See how we'll match you with the right MBA programs.",
    timeEstimate: "≈20s",
  },
  {
    number: 5,
    title: "Get Your Shortlist",
    fields: 8,
    description: "Where should we send your personalized MBA recommendations?",
    timeEstimate: "≈55s",
  },
] as const;

interface FormData {
  employmentStatus: string;
  salaryBand: string;
  highestQualification: string;
  lastScorePercent: string;
  goal: string;
  degreeInterest: string;
  coursePreference: string;
  specialisationInterest: string;
  budgetRange: string;
  wantsEmi: string;
  preferredMode: string;
  category: string;
  experienceYears: string;
  bestContactWindow: string;
  fullName: string;
  gender: string;
  email: string;
  phone: string;
  dob: string;
  state: string;
  city: string;
  source: string;
  utmCampaign: string;
}

interface ChoiceOption {
  value: string;
  label: string;
  helper?: string;
}

interface Banner {
  title: string;
  description: string;
}

interface BaseQuestion {
  step: FormStep;
  banner?: Banner;
  condition?: (data: FormData) => boolean;
}

interface ChoiceQuestion extends BaseQuestion {
  type: "choice";
  key: keyof FormData;
  title: string;
  description?: string;
  options: ChoiceOption[];
}

interface InfoQuestion extends BaseQuestion {
  type: "info";
  title: string;
  description: string;
  highlights?: string[];
}

type Question = ChoiceQuestion | InfoQuestion;

interface ApiResponse {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const QUESTIONS: Question[] = [
  {
    type: "choice",
    step: 1,
    key: "employmentStatus",
    title: "Where are you in your professional journey?",
    description:
      "We tailor recommendations based on your current context, so pick the one closest to you.",
    options: [
      {
        value: "working",
        label: "Working professional",
        helper: "Full-time or part-time employee",
      },
      {
        value: "student",
        label: "Student",
        helper: "Final or pre-final year",
      },
      {
        value: "self-employed",
        label: "Entrepreneur / Consultant",
        helper: "Building your own venture",
      },
      {
        value: "career-break",
        label: "On a break & exploring",
        helper: "Planning a focused comeback",
      },
    ],
    banner: {
      title: "What you get",
      description:
        "Connect with alumni mentors from your background within 24 hours of signing up.",
    },
  },
  {
    type: "choice",
    step: 1,
    key: "salaryBand",
    title: "Current annual CTC",
    description:
      "Totally confidential — we only use this to benchmark ROI and financing support.",
    options: [
      { value: "0-3", label: "₹0 – ₹3 LPA" },
      { value: "3-6", label: "₹3 – ₹6 LPA" },
      { value: "6-10", label: "₹6 – ₹10 LPA" },
      { value: "10-15", label: "₹10 – ₹15 LPA" },
      { value: "15-25", label: "₹15 – ₹25 LPA" },
      { value: "25+", label: "₹25 LPA and above" },
    ],
    condition: (data) => data.employmentStatus === "working",
  },
  {
    type: "choice",
    step: 1,
    key: "highestQualification",
    title: "Highest qualification earned",
    options: [
      { value: "10th", label: "10th Standard" },
      { value: "12th", label: "12th Standard" },
      { value: "diploma", label: "Diploma / Certification" },
      { value: "bachelors", label: "Bachelor’s Degree" },
      { value: "masters", label: "Master’s Degree" },
      { value: "doctorate", label: "Doctorate / PhD" },
    ],
  },
  {
    type: "choice",
    step: 1,
    key: "lastScorePercent",
    title: "Score in your last completed program",
    description: "Helps us pre-check eligibility and scholarship thresholds.",
    options: [
      { value: "85-plus", label: "85% and above" },
      { value: "70-84", label: "70% – 84%" },
      { value: "60-69", label: "60% – 69%" },
      { value: "below-60", label: "Below 60%" },
      { value: "pursuing", label: "Still pursuing / awaiting results" },
    ],
  },
  {
    type: "choice",
    step: 1,
    key: "goal",
    title: "What outcome matters most to you?",
    options: [
      { value: "career-switch", label: "Switch roles or industries" },
      { value: "promotion", label: "Move into leadership faster" },
      { value: "salary-hike", label: "Increase salary significantly" },
      { value: "start-business", label: "Launch or scale my venture" },
      { value: "skill-upgrade", label: "Deepen domain expertise" },
      { value: "academic-growth", label: "Pursue advanced academics" },
    ],
    banner: {
      title: "Career support included",
      description:
        "Your profile gets shared with 200+ hiring partners after completion, plus personalized interview coaching.",
    },
  },
  {
    type: "choice",
    step: 2,
    key: "degreeInterest",
    title: "Pick the credential you’re leaning toward",
    options: [
      { value: "MBA", label: "MBA", helper: "University-backed degree" },
      { value: "PGDM", label: "PGDM", helper: "AICTE-approved diploma" },
      {
        value: "Executive MBA",
        label: "Executive MBA",
        helper: "For 5+ years experience",
      },
      {
        value: "Executive PGDM",
        label: "Executive PGDM",
        helper: "Weekend & blended cohorts",
      },
    ],
  },
  {
    type: "choice",
    step: 2,
    key: "coursePreference",
    title: "How would you like the learning experience to feel?",
    options: [
      {
        value: "immersive-campus",
        label: "Immersive campus blocks",
        helper: "Short residencies + online prep",
      },
      {
        value: "hybrid-weekend",
        label: "Hybrid weekend sessions",
        helper: "Live faculty + weekday async",
      },
      {
        value: "fully-online",
        label: "Fully online cohorts",
        helper: "Live & on-demand classrooms",
      },
      {
        value: "self-paced",
        label: "Self-paced mastery",
        helper: "Projects + mentor reviews",
      },
    ],
    banner: {
      title: "Study support included",
      description:
        "Get AI-powered lesson summaries and live doubt-solving sessions between classes.",
    },
  },
  {
    type: "choice",
    step: 2,
    key: "specialisationInterest",
    title: "Which specialisation excites you right now?",
    options: [
      { value: "general-management", label: "General Management" },
      {
        value: "digital-transformation",
        label: "Digital & Product Leadership",
      },
      { value: "finance", label: "Finance & FinTech" },
      { value: "marketing", label: "Brand & Growth Marketing" },
      { value: "analytics", label: "Business Analytics & AI" },
      { value: "undecided", label: "Undecided — show me top bets" },
    ],
  },
  {
    type: "choice",
    step: 2,
    key: "budgetRange",
    title: "Total tuition sweet spot",
    description:
      "We’ll pair this with scholarship and EMI options automatically.",
    options: [
      { value: "under-1-5", label: "Under ₹1.5L" },
      { value: "1-5-2-5", label: "₹1.5L – ₹2.5L" },
      { value: "2-5-4", label: "₹2.5L – ₹4L" },
      { value: "4-6", label: "₹4L – ₹6L" },
      { value: "6-plus", label: "₹6L and above" },
    ],
    banner: {
      title: "EMI financing available",
      description:
        "Our financing team helps you get instant EMI approvals up to 36 months with zero hassle.",
    },
  },
  {
    type: "choice",
    step: 2,
    key: "wantsEmi",
    title: "Would flexible EMI support be helpful?",
    options: [
      { value: "yes", label: "Yes, need structured EMIs" },
      { value: "no", label: "No, I can pay upfront" },
      { value: "maybe", label: "Maybe — want to compare options" },
    ],
  },
  {
    type: "choice",
    step: 2,
    key: "preferredMode",
    title: "Preferred weekly study cadence",
    options: [
      { value: "weekend", label: "Weekend immersions" },
      { value: "weekday-evening", label: "Weekday evenings" },
      { value: "self-paced", label: "Self-paced with mentor check-ins" },
      { value: "cohort-live", label: "Live cohort sessions through the week" },
    ],
  },
  {
    type: "choice",
    step: 3,
    key: "category",
    title: "Reservation / category status",
    options: [
      { value: "general", label: "General / Open" },
      { value: "ews", label: "EWS" },
      { value: "obc", label: "OBC (Non-creamy layer)" },
      { value: "sc-st", label: "SC / ST" },
      { value: "international", label: "International applicant" },
    ],
  },
  {
    type: "choice",
    step: 3,
    key: "experienceYears",
    title: "How much total professional experience do you bring?",
    options: [
      { value: "0", label: "0 years — just starting out" },
      { value: "1-3", label: "1 – 3 years" },
      { value: "3-5", label: "3 – 5 years" },
      { value: "5-10", label: "5 – 10 years" },
      { value: "10-plus", label: "10+ years" },
    ],
    banner: {
      title: "Interview coaching included",
      description:
        "Get personalized interview coaching and resume guidance tailored to your experience level.",
    },
  },
  {
    type: "info",
    step: 4,
    title: "Here's what you'll get",
    description:
      "Based on your answers, we'll create a personalized MBA shortlist just for you.",
    highlights: [
      "Top 3 MBA programs matched to your profile with scholarship chances",
      "Salary projection showing expected income increase after MBA",
      "Detailed program guide and next steps emailed instantly",
    ],
  },
  {
    type: "choice",
    step: 5,
    key: "bestContactWindow",
    title: "When should your counsellor reach out?",
    options: [
      { value: "morning", label: "Morning (9am – 11am)" },
      { value: "lunch", label: "Midday (11am – 2pm)" },
      { value: "evening", label: "Evening (5pm – 8pm)" },
      { value: "weekend", label: "Weekend slots" },
      { value: "chat-only", label: "Prefer WhatsApp / email only" },
    ],
  },
] as const;

const findNextVisibleIndex = (startIndex: number, data: FormData) => {
  for (let idx = startIndex + 1; idx < QUESTIONS.length; idx += 1) {
    const question = QUESTIONS[idx];
    if (!question.condition || question.condition(data)) {
      return idx;
    }
  }
  return QUESTIONS.length;
};

const findPreviousVisibleIndex = (startIndex: number, data: FormData) => {
  let idx = Math.min(startIndex - 1, QUESTIONS.length - 1);
  for (; idx >= 0; idx -= 1) {
    const question = QUESTIONS[idx];
    if (!question.condition || question.condition(data)) {
      return idx;
    }
  }
  return 0;
};

export default function LeadFormPage() {
  const [isPending, startTransition] = useTransition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    employmentStatus: "",
    salaryBand: "",
    highestQualification: "",
    lastScorePercent: "",
    goal: "",
    degreeInterest: "",
    coursePreference: "",
    specialisationInterest: "",
    budgetRange: "",
    wantsEmi: "",
    preferredMode: "",
    category: "",
    experienceYears: "",
    bestContactWindow: "",
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    dob: "",
    state: "",
    city: "",
    source: "",
    utmCampaign: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [blinkingChoice, setBlinkingChoice] = useState<string | null>(null);

  const advanceTimeoutRef = useRef<number | null>(null);
  const blinkTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      clearTimers();
    },
    []
  );

  function clearTimers() {
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (blinkTimeoutRef.current) {
      window.clearTimeout(blinkTimeoutRef.current);
      blinkTimeoutRef.current = null;
    }
  }

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function handleChoiceSelect(question: ChoiceQuestion, option: ChoiceOption) {
    clearTimers();
    const nextData: FormData = { ...formData, [question.key]: option.value };
    if (question.key === "employmentStatus") {
      nextData.salaryBand = "";
    }
    setFormData(nextData);

    if (errors[question.key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[question.key];
        return newErrors;
      });
    }

    const optionKey = `${String(question.key)}:${option.value}`;
    setBlinkingChoice(optionKey);
    blinkTimeoutRef.current = window.setTimeout(() => {
      setBlinkingChoice(null);
    }, 650);

    advanceTimeoutRef.current = window.setTimeout(() => {
      const nextIndex = findNextVisibleIndex(currentIndex, nextData);
      setCurrentIndex(nextIndex);
    }, 520);
  }

  function handleContinue() {
    clearTimers();
    const nextIndex = findNextVisibleIndex(currentIndex, formData);
    setCurrentIndex(nextIndex);
  }

  function handleBack() {
    clearTimers();
    if (currentIndex === 0) return;
    const prevIndex = findPreviousVisibleIndex(currentIndex, formData);
    setCurrentIndex(prevIndex);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    const payload = {
      ...formData,
      wantsEmi: formData.wantsEmi === "yes",
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = (await response.json()) as ApiResponse;

        if (result.success) {
          setSubmitSuccess(true);
        } else {
          setSubmitError(result.error || "An error occurred");
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          }
        }
      } catch {
        setSubmitError("Network error. Please try again.");
      }
    });
  }

  const applicableIndexes = useMemo(() => {
    const indexes: number[] = [];
    QUESTIONS.forEach((question, idx) => {
      if (!question.condition || question.condition(formData)) {
        indexes.push(idx);
      }
    });
    return indexes;
  }, [formData]);

  const isContactStep = currentIndex >= QUESTIONS.length;
  const currentQuestion = !isContactStep ? QUESTIONS[currentIndex] : null;
  const activeStepNumber: FormStep = isContactStep ? 5 : currentQuestion!.step;
  const activeStepMeta =
    STEPS.find((step) => step.number === activeStepNumber) ?? STEPS[0];

  const currentStagePosition = useMemo(() => {
    if (isContactStep) return applicableIndexes.length;
    const position = applicableIndexes.indexOf(currentIndex);
    return position >= 0 ? position : 0;
  }, [applicableIndexes, currentIndex, isContactStep]);

  const totalStages = applicableIndexes.length + 1; // +1 for contact step
  const progress = ((currentStagePosition + 1) / totalStages) * 100;
  const canGoBack = currentStagePosition > 0 || isContactStep;

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {submitSuccess ? (
        <section className="bg-[var(--surface-subtle)] pb-24 pt-28">
          <div className="section-container max-w-2xl text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-2xl text-[var(--color-accent-foreground)]">
              ✓
            </div>
            <h1 className="mt-6 text-4xl font-bold text-[color:var(--color-secondary)]">
              Thank you for your interest!
            </h1>
            <p className="mt-4 text-lg text-[color:color-mix(in srgb, var(--color-secondary) 65%, white 35%)]">
              Your profile has been submitted successfully. Our AI counsellor is
              generating your personalised program recommendations.
            </p>
            <p className="mt-3 text-base font-semibold text-[color:var(--color-accent)]">
              Check your inbox within 2 minutes for your detailed shortlist.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
              >
                Browse all programs
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in srgb, var(--color-secondary) 25%, transparent)] px-6 py-3 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:border-[color:color-mix(in srgb, var(--color-secondary) 40%, transparent)]"
              >
                Return home
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="bg-[var(--surface-subtle)] pb-12 pt-28">
            <div className="section-container max-w-3xl">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <span className="eyebrow">Your MBA Journey</span>
                  <h1 className="mt-4 text-3xl font-bold text-[color:var(--color-secondary)] sm:text-4xl">
                    Find Your Perfect MBA
                  </h1>
                  <p className="mt-3 text-sm text-[color:color-mix(in srgb, var(--color-secondary) 60%, white 40%)]">
                    Answer a few questions and we’ll match you with MBA programs
                    that fit your goals, budget, and schedule.
                  </p>
                </div>
                <div className="rounded-full border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 85%, white 15%)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in srgb, var(--color-secondary) 70%, white 30%)] sm:text-sm">
                  Step {activeStepMeta.number} of {STEPS.length} •{" "}
                  {activeStepMeta.timeEstimate}
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-[color:color-mix(in srgb, var(--color-secondary) 12%, transparent)]">
                <div
                  className="h-full bg-[color:var(--color-accent)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>

          <section className="bg-[var(--surface-subtle)] pb-24">
            <div className="section-container max-w-3xl">
              {!isContactStep && currentQuestion?.type === "choice" && (
                <div className="surface-card p-8">
                  <div className="flex flex-col gap-3">
                    <span className="eyebrow">{activeStepMeta.title}</span>
                    <h2 className="text-2xl font-semibold text-[color:var(--color-secondary)]">
                      {currentQuestion.title}
                    </h2>
                    {currentQuestion.description && (
                      <p className="text-sm text-[color:color-mix(in srgb, var(--color-secondary) 62%, white 38%)]">
                        {currentQuestion.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-2.5">
                    {currentQuestion.options.map((option) => {
                      const optionKey = `${String(currentQuestion.key)}:${
                        option.value
                      }`;
                      const isSelected =
                        formData[currentQuestion.key] === option.value;
                      const isBlinking = blinkingChoice === optionKey;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`choice-pill ${
                            isBlinking ? "animate-choice-blink" : ""
                          }`}
                          data-state={isSelected ? "selected" : "idle"}
                          onClick={() =>
                            handleChoiceSelect(currentQuestion, option)
                          }
                        >
                          <span className="flex flex-col">
                            <span className="text-sm font-semibold">
                              {option.label}
                            </span>
                            {option.helper && (
                              <span className="mt-1 text-xs text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                                {option.helper}
                              </span>
                            )}
                          </span>
                          <span
                            aria-hidden
                            className="ml-auto text-base text-[color:color-mix(in srgb, var(--color-secondary) 68%, white 32%)]"
                          >
                            ↗
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {currentQuestion.banner && (
                    <div className="mt-5 inline-flex items-start gap-3 rounded-xl border border-[color:color-mix(in srgb,var(--color-accent)_28%,transparent)] bg-[color:color-mix(in srgb,var(--color-accent)_8%,white_92%)] px-3.5 py-3 shadow-sm">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <div>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[color:color-mix(in srgb, var(--color-accent) 85%, black 15%)]">
                          {currentQuestion.banner.title}
                        </p>
                        <p className="mt-1 text-[0.8125rem] leading-snug text-[color:color-mix(in srgb, var(--color-secondary) 75%, white 25%)]">
                          {currentQuestion.banner.description}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={!canGoBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] px-4 py-2 font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in srgb, var(--color-secondary) 70%, white 30%)] disabled:opacity-40"
                    >
                      ← Back
                    </button>
                    <span>
                      Moves to the next question after your selection.
                    </span>
                  </div>
                </div>
              )}

              {!isContactStep && currentQuestion?.type === "info" && (
                <div className="surface-card space-y-6 p-8">
                  <div className="space-y-3">
                    <span className="eyebrow">{activeStepMeta.title}</span>
                    <h2 className="text-2xl font-semibold text-[color:var(--color-secondary)]">
                      {currentQuestion.title}
                    </h2>
                    <p className="text-sm text-[color:color-mix(in srgb, var(--color-secondary) 62%, white 38%)]">
                      {currentQuestion.description}
                    </p>
                  </div>
                  {currentQuestion.highlights && (
                    <ul className="space-y-3 text-sm text-[color:color-mix(in srgb, var(--color-secondary) 65%, white 35%)]">
                      {currentQuestion.highlights.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-1 inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={!canGoBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] px-4 py-2 font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in srgb, var(--color-secondary) 70%, white 30%)] disabled:opacity-40"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-secondary)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {isContactStep && (
                <form
                  onSubmit={handleSubmit}
                  className="surface-card space-y-6 p-8"
                >
                  <div className="space-y-3">
                    <span className="eyebrow">{activeStepMeta.title}</span>
                    <h2 className="text-2xl font-semibold text-[color:var(--color-secondary)]">
                      Where can we send your curated roadmap?
                    </h2>
                    <p className="text-sm text-[color:color-mix(in srgb, var(--color-secondary) 62%, white 38%)]">
                      We share your shortlist instantly and follow up with a
                      counsellor call in your preferred window.
                    </p>
                  </div>

                  {submitError && (
                    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                      {submitError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        Full name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          updateField("fullName", e.target.value)
                        }
                        required
                        placeholder="Your name"
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.fullName[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                        placeholder="name@email.com"
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.email[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        WhatsApp number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        required
                        placeholder="+91"
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phone[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        Date of birth
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateField("dob", e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                      {errors.dob && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.dob[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => updateField("gender", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.gender[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        required
                        placeholder="Your state"
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.state[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:color-mix(in srgb, var(--color-secondary) 58%, white 42%)]">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        required
                        placeholder="Your city"
                        className="mt-2 w-full rounded-xl border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] bg-[color:color-mix(in srgb, var(--surface-base) 92%, white 8%)] px-4 py-3 text-sm text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.city[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[color:color-mix(in srgb, var(--color-secondary) 12%, transparent)] bg-[linear-gradient(135deg, color-mix(in srgb, var(--surface-base) 90%, white 10%) 0%, color-mix(in srgb, var(--color-accent) 16%, transparent) 100%)] p-5 text-sm text-[color:color-mix(in srgb, var(--color-secondary) 70%, white 30%)]">
                    <p className="font-semibold uppercase tracking-[0.26em] text-[color:color-mix(in srgb, var(--color-secondary) 60%, white 40%)]">
                      Privacy promise
                    </p>
                    <p className="mt-2">
                      Your data powers personalised recommendations only. We
                      never sell or spam—unsubscribe anytime.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in srgb, var(--color-secondary) 18%, transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in srgb, var(--color-secondary) 70%, white 30%)]"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-secondary)] px-6 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {isPending ? "Submitting…" : "Get my shortlist"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

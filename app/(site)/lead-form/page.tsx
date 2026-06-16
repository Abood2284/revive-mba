"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
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
    title: "Program Preferences",
    fields: 6,
    description:
      "Share what kind of program you're looking for and your budget.",
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
    description: "See how we'll match you with the right programs.",
    timeEstimate: "≈20s",
  },
  {
    number: 5,
    title: "Get Your Shortlist",
    fields: 8,
    description:
      "Where should we send your personalized program recommendations?",
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
      "Based on your answers, we'll create a personalized program shortlist just for you.",
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
    <div className="min-h-screen bg-[#f5f6fa] text-[#10131a]">
      {submitSuccess ? (
        <section className="border-b border-[#d9dce6] bg-white pb-24 pt-28">
          <div className="section-container max-w-2xl text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#3D38B8] text-2xl text-white shadow">
              ✓
            </div>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
              Thank you for your interest!
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#5a6072]">
              Your profile has been submitted successfully. Our AI counsellor is
              generating your personalised program recommendations.
            </p>
            <p className="mt-3 text-base font-semibold text-[#ED1C24]">
              Check your inbox within 2 minutes for your detailed shortlist.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-6 py-3 text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
              >
                Browse all programs
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] px-6 py-3 text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
              >
                Return home
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="border-b border-[#d9dce6] bg-white pb-12 pt-28">
            <div className="section-container max-w-3xl">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] bg-[#f5f6fa] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#514EA1]">
                    Your program journey
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                    Find your perfect program
                  </h1>
                  <p className="mt-3 text-sm text-[#5a6072]">
                    Answer a few questions and we’ll match you with programs
                    that fit your goals, budget, and schedule.
                  </p>
                </div>
                <div className="rounded-full border border-[#d9dce6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3D38B8] sm:text-sm">
                  Step {activeStepMeta.number} of {STEPS.length} •{" "}
                  {activeStepMeta.timeEstimate}
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#d9dce6]">
                <div
                  className="h-full bg-[#3D38B8] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>

          <section className="py-16" id="lead-form">
            <div className="section-container max-w-3xl">
              {!isContactStep && currentQuestion?.type === "choice" && (
                <div className="rounded-3xl border border-[#d9dce6] bg-white p-8 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514EA1]">
                      {activeStepMeta.title}
                    </span>
                    <h2 className="text-2xl font-semibold">
                      {currentQuestion.title}
                    </h2>
                    {currentQuestion.description && (
                      <p className="text-sm text-[#5a6072]">
                        {currentQuestion.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
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
                          onClick={() =>
                            handleChoiceSelect(currentQuestion, option)
                          }
                          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8] ${
                            isSelected
                              ? "border-[#3D38B8] bg-[#f5f6fa] text-[#3D38B8]"
                              : "border-[#d9dce6] bg-white"
                          } ${isBlinking ? "animate-pulse" : ""}`}
                        >
                          <span
                            className={`mt-1 inline-flex h-2 w-2 rounded-full ${
                              isSelected ? "bg-[#ED1C24]" : "bg-[#d9dce6]"
                            }`}
                            aria-hidden
                          />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-[#10131a]">
                              {option.label}
                            </span>
                            {option.helper && (
                              <span className="mt-1 block text-xs text-[#5a6072]">
                                {option.helper}
                              </span>
                            )}
                          </span>
                          <span
                            aria-hidden
                            className="ml-auto text-base text-[#9197ad]"
                          >
                            ↗
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {currentQuestion.banner && (
                    <div className="mt-6 rounded-2xl border border-[#d9dce6] bg-[#f5f6fa] px-4 py-3 text-sm text-[#5a6072]">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/icons8-gift-96.png"
                          alt="Bonus gift icon"
                          width={32}
                          height={32}
                          className="h-8 w-8"
                        />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D38B8]">
                          {currentQuestion.banner.title}
                        </p>
                      </div>
                      <p className="mt-2">
                        {currentQuestion.banner.description}
                      </p>
                    </div>
                  )}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5a6072]">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={!canGoBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] px-4 py-2 font-semibold uppercase tracking-[0.2em] text-[#3D38B8] disabled:opacity-40"
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
                <div className="rounded-3xl border border-[#d9dce6] bg-white p-8 shadow-sm">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514EA1]">
                      {activeStepMeta.title}
                    </span>
                    <h2 className="text-2xl font-semibold">
                      {currentQuestion.title}
                    </h2>
                    <p className="text-sm text-[#5a6072]">
                      {currentQuestion.description}
                    </p>
                  </div>
                  {currentQuestion.highlights && (
                    <ul className="mt-6 space-y-3 text-sm text-[#5a6072]">
                      {currentQuestion.highlights.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-1 inline-block h-2 w-2 rounded-full bg-[#3D38B8]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5a6072]">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={!canGoBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] px-4 py-2 font-semibold uppercase tracking-[0.2em] text-[#3D38B8] disabled:opacity-40"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="inline-flex items-center gap-2 rounded-full bg-[#3D38B8] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {isContactStep && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 rounded-3xl border border-[#d9dce6] bg-white p-8 shadow-sm"
                >
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514EA1]">
                      {activeStepMeta.title}
                    </span>
                    <h2 className="text-2xl font-semibold">
                      Where can we send your curated roadmap?
                    </h2>
                    <p className="text-sm text-[#5a6072]">
                      We share your shortlist instantly and follow up with a
                      counsellor call in your preferred window.
                    </p>
                  </div>

                  {submitError && (
                    <div className="rounded-lg border border-[#edb1b3] bg-[#fdecee] p-4 text-sm text-[#b8161b]">
                      {submitError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FieldControl
                      label="Full name *"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Your name"
                      required
                      error={errors.fullName}
                      className="sm:col-span-2"
                    />
                    <FieldControl
                      label="Email *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="name@email.com"
                      required
                      error={errors.email}
                    />
                    <FieldControl
                      label="WhatsApp number *"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+91"
                      required
                      error={errors.phone}
                    />
                    <FieldControl
                      label="Date of birth"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateField("dob", e.target.value)}
                    />
                    <FieldControl
                      label="State"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                    />
                    <FieldControl
                      label="City"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                    <FieldControl
                      label="Preferred contact window"
                      value={formData.bestContactWindow}
                      onChange={(e) =>
                        updateField("bestContactWindow", e.target.value)
                      }
                      placeholder="Morning / Evening / Weekend"
                      className="sm:col-span-2"
                    />
                    <FieldControl
                      label="Source"
                      value={formData.source}
                      onChange={(e) => updateField("source", e.target.value)}
                      placeholder="How did you hear about us?"
                    />
                    <FieldControl
                      label="UTM campaign"
                      value={formData.utmCampaign}
                      onChange={(e) =>
                        updateField("utmCampaign", e.target.value)
                      }
                      placeholder="Optional tracking"
                    />
                  </div>

                  <div className="rounded-2xl border border-[#d9dce6] bg-[#f5f6fa] p-5 text-sm text-[#5a6072]">
                    <p className="font-semibold uppercase tracking-[0.18em] text-[#3D38B8]">
                      What happens next
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li>• Personalised shortlist mailed within 2 minutes</li>
                      <li>• Counsellor follow-up in your preferred window</li>
                      <li>• Access to scholarships and financing partners</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3D38B8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#514EA1] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                  >
                    {isPending ? "Submitting…" : "Send my tailored shortlist"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function FieldControl({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#514EA1]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-[#d9dce6] bg-white px-4 py-3 text-sm text-[#10131a] focus:outline-none focus:ring-2 focus:ring-[#3D38B8]"
      />
      {error && <p className="mt-1 text-xs text-[#b8161b]">{error[0]}</p>}
    </div>
  );
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n || 0
  );
}

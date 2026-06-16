// components/sections/hero-new.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";

const heroProofMetrics = [
  {
    icon: "/images/icons8-popular-man-96.png",
    alt: "Happy students icon",
    value: "27K+",
    label: "Students counselled",
  },
  {
    icon: "/images/icons8-graduate-94.png",
    alt: "Graduate cap icon",
    value: "540+",
    label: "Expert mentors",
  },
  {
    icon: "/images/icons8-rating-100.png",
    alt: "Rating badge icon",
    value: "4.9/5",
    label: "Learner rating",
  },
] as const;

export function HeroNew() {
  const router = useRouter();
  const [budget, setBudget] = React.useState(250000);
  const [spec, setSpec] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();
    params.set("maxFee", budget.toString());
    if (spec) {
      params.set("specialization", spec);
    }

    // Navigate to programs page with filters
    router.push(`/programs?${params.toString()}`);
  };

  return (
    <section className="relative w-full bg-white text-[#0b0e17]">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-16 md:pt-18 md:pb-24">
        <div className="mt-8 grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Find the right <span className="text-[#ED1C24]">Online Program</span>{" "}
              without the spin.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#514EA1] md:text-lg">
              Compare accredited programs by fees, duration, and mode. Download
              brochures, check eligibility, and get counseling without the sales
              push.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <div className="relative">
                <Link
                  href="/lead-form"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f5f6fa] px-6 py-3 text-sm font-semibold text-[#3D38B8] shadow transition hover:text-[#514EA1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                >
                  <Image
                    src="/images/icons8-verified-account-96.png"
                    alt="Verified"
                    width={18}
                    height={18}
                  />
                  Suggest in 2 mins
                </Link>
                <span className="absolute -top-3 left-3 inline-flex items-center gap-2 rounded-full bg-[#ED1C24] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow">
                  <Image
                    src="/images/icons8-light-96.png"
                    alt="AI powered"
                    width={16}
                    height={16}
                  />
                  AI-powered
                </span>
              </div>
              <a
                href="/compare"
                className="rounded-full border border-[#514EA1] px-5 py-3 text-[#514EA1] transition hover:bg-[#514EA1] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#514EA1]"
              >
                Compare Programs
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 items-center gap-2 text-left md:mt-10 md:flex md:flex-wrap md:gap-x-12 md:gap-y-6">
              {heroProofMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col items-center gap-1 whitespace-nowrap md:flex-row md:items-center md:gap-3"
                >
                  <Image
                    src={metric.icon}
                    alt={metric.alt}
                    width={24}
                    height={24}
                    className="h-5 w-5 object-contain md:h-12 md:w-12"
                  />
                  <div className="flex flex-col items-center justify-center text-center leading-none text-[#0b0e17] md:items-start md:text-left">
                    <span className="text-[12px] font-black md:text-2xl">
                      {metric.value}
                    </span>
                    <span className="text-[9px] font-semibold text-[#514EA1] md:text-base">
                      {metric.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <form
              id="program-finder"
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#514EA1] bg-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-[#3D38B8] pb-4">
                <h2 className="text-lg font-semibold text-[#0b0e17]">
                  Let us find the right program for you
                </h2>
              </div>
              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="budget"
                    className="block text-sm text-[#0b0e17]"
                  >
                    Max total fee (₹)
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="budget"
                      type="range"
                      min={50000}
                      max={600000}
                      step={10000}
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                      className="w-full accent-[#ED1C24]"
                      aria-describedby="budget-help"
                    />
                    <span className="min-w-24 rounded-md border border-[#514EA1] bg-white px-2 py-1 text-right text-sm tabular-nums text-[#0b0e17]">
                      ₹{formatINR(budget)}
                    </span>
                  </div>
                  <p id="budget-help" className="mt-1 text-xs text-[#514EA1]">
                    Drag to set your fee cap.
                  </p>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Field>
                      <label
                        htmlFor="spec"
                        className="block text-sm text-[#0b0e17]"
                      >
                        Specialisation
                      </label>
                      <select
                        id="spec"
                        value={spec}
                        onChange={(e) => setSpec(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#514EA1] bg-white px-3 py-2 text-sm text-[#0b0e17] focus:outline-none focus:ring-2 focus:ring-[#514EA1]"
                      >
                        <option value="">Any</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                        <option value="business-analytics">
                          Business Analytics
                        </option>
                        <option value="hr">Human Resources</option>
                        <option value="operations">Operations</option>
                        <option value="it">IT & Systems</option>
                        <option value="healthcare">Healthcare</option>
                      </select>
                    </Field>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full bg-[#ED1C24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b8161b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED1C24]"
                  >
                    Show Programs
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="-mr-1"
                    >
                      <path
                        d="M13 5l7 7-7 7M5 12h14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <a
                    href="#contact"
                    className="rounded text-[#ED1C24] transition hover:text-[#b8161b] focus-visible:outline-2 focus-visible:outline-[#ED1C24]"
                  >
                    Prefer guidance? Talk to a counselor →
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
function Field({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}


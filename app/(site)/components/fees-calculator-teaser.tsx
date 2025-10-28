// components/sections/fees-calculator-teaser.tsx
"use client";
import * as React from "react";

export function FeesCalculatorTeaser() {
  const [totalFee, setTotalFee] = React.useState(200000);
  const [downPct, setDownPct] = React.useState(10);
  const [tenure, setTenure] = React.useState(24);
  const [annualRate, setAnnualRate] = React.useState(10);

  const principal = Math.max(0, totalFee - (downPct / 100) * totalFee);
  const monthlyRate = annualRate / 12 / 100;

  const { emi, totalPayable, totalInterest } = React.useMemo(() => {
    if (principal <= 0 || tenure <= 0) {
      return { emi: 0, totalPayable: 0, totalInterest: 0 };
    }
    if (monthlyRate === 0) {
      const e = principal / tenure;
      return { emi: e, totalPayable: e * tenure, totalInterest: 0 };
    }
    const pow = Math.pow(1 + monthlyRate, tenure);
    const e = (principal * monthlyRate * pow) / (pow - 1);
    return {
      emi: e,
      totalPayable: e * tenure,
      totalInterest: e * tenure - principal,
    };
  }, [principal, tenure, monthlyRate]);

  return (
    <section className="w-full bg-white text-[#10131a]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9dce6] bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#514EA1] md:gap-2 md:px-3 md:py-1 md:text-[11px]">
            <span
              aria-hidden
              className="inline-flex h-1 w-1 rounded-full bg-[#3D38B8] md:h-1.5 md:w-1.5"
            />
            Financing clarity
          </span>
          <h2 className="mt-3 text-xl font-semibold leading-tight md:mt-4 md:text-4xl">
            Fees & EMI calculator
          </h2>
          <p className="mt-3 hidden text-sm leading-relaxed text-[#5a6072] md:mt-4 md:block md:text-base">
            Estimate monthly EMI for your chosen program. Transparent, quick
            math—no sales calls attached.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 md:mt-12 md:gap-8">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#d9dce6] bg-white p-4 shadow-sm md:p-8">
              <ControlBlock label="Program total fee (₹)">
                <SliderRow
                  id="fee"
                  min={50000}
                  max={800000}
                  step={5000}
                  value={totalFee}
                  onChange={(v) => setTotalFee(v)}
                  accent="#ED1C24"
                  display={`₹${formatINR(totalFee)}`}
                />
              </ControlBlock>

              <ControlBlock label="Down payment (%)">
                <SliderRow
                  id="down"
                  min={0}
                  max={60}
                  step={1}
                  value={downPct}
                  onChange={(v) => setDownPct(v)}
                  accent="#3D38B8"
                  display={`${downPct}%`}
                />
              </ControlBlock>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                <ControlBlock label="Tenure (months)">
                  <SliderRow
                    id="tenure"
                    min={6}
                    max={48}
                    step={1}
                    value={tenure}
                    onChange={(v) => setTenure(v)}
                    accent="#3D38B8"
                    display={`${tenure}`}
                  />
                </ControlBlock>
                <ControlBlock label="Interest (p.a., %)">
                  <SliderRow
                    id="rate"
                    min={0}
                    max={24}
                    step={0.5}
                    value={annualRate}
                    onChange={(v) => setAnnualRate(v)}
                    accent="#ED1C24"
                    display={`${annualRate}%`}
                  />
                </ControlBlock>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-[11px] text-[#5a6072] md:gap-4 md:text-sm">
                <Fact
                  label="Loan principal"
                  value={`₹${formatINR(principal)}`}
                />
                <Fact
                  label="Down payment"
                  value={`₹${formatINR((downPct / 100) * totalFee)}`}
                />
              </dl>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#d9dce6] bg-white p-5 shadow-md md:p-8">
              <h3 className="text-base font-semibold text-[#10131a]">
                Your EMI estimate
              </h3>

              <div className="mt-5 rounded-2xl border border-[#d9dce6] bg-[#f5f6fa] p-5 md:mt-6 md:p-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#514EA1] md:text-xs">
                    Monthly EMI
                  </span>
                  <span className="text-xl font-semibold tracking-tight text-[#10131a] md:text-2xl">
                    ₹{formatINR(emi)}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#5a6072] md:mt-4 md:gap-3 md:text-sm">
                  <Summary
                    label="Total payable"
                    value={`₹${formatINR(totalPayable)}`}
                  />
                  <Summary
                    label="Total interest"
                    value={`₹${formatINR(totalInterest)}`}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 md:mt-8 md:gap-3">
                <a
                  href="/counseling"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#3D38B8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8] md:px-5 md:py-3 md:text-sm"
                >
                  Discuss EMI options
                </a>
                <a
                  href="/programs"
                  className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] px-4 py-2 text-xs font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8] md:px-5 md:py-3 md:text-sm"
                >
                  See eligible programs
                </a>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-[#5a6072]">
                Estimates are for guidance only and do not constitute a loan
                offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlBlock({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#514EA1]">
        {label}
      </label>
      {children}
      {description && <p className="text-xs text-[#5a6072]">{description}</p>}
    </div>
  );
}

function SliderRow({
  id,
  min,
  max,
  step,
  value,
  onChange,
  accent,
  display,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  accent: string;
  display: string;
}) {
  return (
    <div className="mt-2 flex items-center gap-2 md:gap-3">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
      />
      <span className="min-w-20 rounded-md border border-[#d9dce6] bg-[#f5f6fa] px-1.5 py-0.5 text-right text-xs tabular-nums text-[#10131a] md:min-w-24 md:px-2 md:py-1 md:text-sm">
        {display}
      </span>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d9dce6] bg-[#f5f6fa] p-3 md:p-4">
      <dt className="text-xs uppercase tracking-[0.2em] text-[#514EA1]">
        {label}
      </dt>
      <dd className="mt-2 text-base font-semibold text-[#10131a] md:text-lg">
        {value}
      </dd>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d9dce6] bg-white p-2.5 md:p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#514EA1] md:text-xs">
        {label}
      </div>
      <div className="mt-1.5 text-xs font-semibold text-[#10131a] md:mt-2 md:text-sm">
        {value}
      </div>
    </div>
  );
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    n || 0
  );
}

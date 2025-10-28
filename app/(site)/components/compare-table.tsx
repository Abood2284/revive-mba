// app/(site)/components/compare-table.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AddProgramDialog } from "./add-program-dialog";
import {
  buildCompareUrl,
  removeProgramFromComparison,
  getComparisonIdsFromStorage,
  saveComparisonIdsToStorage,
} from "@/lib/comparison-state";

export type ComparisonProgram = {
  id: number;
  title: string;
  degreeType: string;
  durationMonths: number | null;
  deliveryMode: string | null;
  totalFee: number | null;
  applicationFee: number | null;
  emiAvailable: boolean;
  highlights: string | null;
  outcomes: string | null;
  eligibility: string | null;
  curriculum: string | null;
  workExperienceMinYears: number | null;
  isFeatured: boolean;
  heroImage: string | null;
  brochureUrl: string | null;
  applyUrl: string | null;
  applicationDeadline: Date | null;
  institution: {
    id: number;
    name: string;
    location: string | null;
    accreditation: string | null;
    website: string | null;
    logoUrl: string | null;
    establishedYear: number | null;
    shortDescription: string | null;
  } | null;
  specialisations: Array<{
    id: number;
    name: string;
    description: string | null;
  }>;
  fees: Array<{ id: number; label: string; amount: number }>;
  faqs: Array<{ id: number; question: string; answerHtml: string }>;
};

interface CompareTableProps {
  programs: ComparisonProgram[];
}

export function CompareTable({ programs }: CompareTableProps) {
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  const handleRemoveProgram = (programId: number) => {
    const currentIds = getComparisonIdsFromStorage();
    const newIds = removeProgramFromComparison(currentIds, programId);
    saveComparisonIdsToStorage(newIds);

    if (newIds.length === 0) {
      window.location.href = "/compare";
    } else {
      window.location.href = buildCompareUrl(newIds);
    }
  };

  // Handle empty state when no programs are selected
  if (programs.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#d9dce6] bg-[#f8f9fa]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#9197ad]"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#10131a] mb-2">
            No programs selected
          </h2>
          <p className="text-[#5a6072] mb-6">
            Add programs to start comparing their features side-by-side
          </p>
          <button
            onClick={() => setShowAddDialog(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#3D38B8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Program to Comparison
          </button>
        </div>

        <AddProgramDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          currentProgramIds={[]}
        />
      </>
    );
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Not disclosed";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const sanitizeHtml = (html: string | null) => {
    if (!html) return "";
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
  };

  const ComparisonRow = ({
    label,
    values,
    className = "",
    isAlternate = false,
  }: {
    label: string;
    values: React.ReactNode[];
    className?: string;
    isAlternate?: boolean;
  }) => (
    <tr
      className={`border-b border-[#d9dce6] ${
        isAlternate ? "bg-[#f8f9fa]" : "bg-white"
      } text-[10px] leading-tight md:text-sm ${className}`}
    >
      <td
        className={`sticky left-0 z-10 px-2 py-2 font-semibold text-[#10131a] min-w-[120px] w-[32%] md:min-w-[180px] md:w-auto ${
          isAlternate ? "bg-[#f8f9fa]" : "bg-white"
        }`}
      >
        {label}
      </td>
      {values.map((value, index) => (
        <td
          key={index}
          className={`px-2 py-2 text-[#5a6072] min-w-[160px] md:min-w-[220px] ${
            isAlternate ? "bg-[#f8f9fa]" : "bg-white"
          }`}
        >
          {value}
        </td>
      ))}
      {programs.length < 4 && (
        <td
          className={`px-2 py-2 text-center min-w-[160px] md:min-w-[220px] ${
            isAlternate ? "bg-[#f8f9fa]" : "bg-white"
          }`}
        >
          {/* Empty cell for add program column */}
        </td>
      )}
    </tr>
  );

  const ProgramHeader = ({ program }: { program: ComparisonProgram }) => (
    <div className="relative">
      <button
        onClick={() => handleRemoveProgram(program.id)}
        className="absolute -top-2 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#ED1C24] text-white hover:bg-[#b8161b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED1C24]"
        aria-label={`Remove ${program.title} from comparison`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="surface-card p-3 md:p-4">
        <div className="mb-2 md:mb-3 flex items-center gap-2">
          {program.isFeatured && (
            <span className="metric-chip text-[10px] md:text-xs">Featured</span>
          )}
          <span className="eyebrow text-[10px] md:text-xs">
            {program.degreeType}
          </span>
        </div>

        <h3 className="text-xs md:text-lg font-semibold text-[#10131a] mb-1 md:mb-2 line-clamp-2">
          {program.title}
        </h3>

        {/* Removed duplicate info - already shown in comparison rows below */}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="border-b-2 border-[#d9dce6] text-xs md:text-sm">
                <th className="sticky left-0 z-10 bg-[#f5f6fa] px-2 py-3 text-left font-semibold text-[#10131a] min-w-[120px] w-[32%] md:min-w-[180px] md:w-auto">
                  Features
                </th>
                {programs.map((program) => (
                  <th
                    key={program.id}
                    className="px-2 py-3 text-center min-w-[160px] md:min-w-[220px]"
                  >
                    <ProgramHeader program={program} />
                  </th>
                ))}
                {programs.length < 4 && (
                  <th className="px-2 py-3 text-center min-w-[160px] md:min-w-[220px]">
                    <button
                      onClick={() => setShowAddDialog(true)}
                      className="w-full surface-card p-4 hover:border-[#3D38B8] hover:shadow-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                    >
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[#d9dce6] hover:border-[#3D38B8] transition-colors">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-[#10131a] mb-1">
                          Add Program
                        </p>
                        <p className="text-xs text-[#9197ad]">
                          Compare up to 4 programs
                        </p>
                      </div>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* Overview Section */}
              <tr className="bg-[#f8f9fa]">
                <td
                  colSpan={programs.length + (programs.length < 4 ? 2 : 1)}
                  className="px-4 py-3 text-sm font-bold text-[#10131a]"
                >
                  Overview
                </td>
              </tr>

              <ComparisonRow
                label="University"
                values={programs.map((program) => (
                  <div>
                    <p className="font-medium text-[#10131a]">
                      {program.institution?.name || "N/A"}
                    </p>
                    {program.institution?.location && (
                      <p className="text-xs text-[#9197ad]">
                        {program.institution.location}
                      </p>
                    )}
                  </div>
                ))}
                isAlternate={true}
              />

              <ComparisonRow
                label="Accreditation"
                values={programs.map((program) => (
                  <span className="text-sm">
                    {program.institution?.accreditation || "Not specified"}
                  </span>
                ))}
              />

              <ComparisonRow
                label="Established"
                values={programs.map((program) => (
                  <span className="text-sm">
                    {program.institution?.establishedYear || "Not specified"}
                  </span>
                ))}
                isAlternate={true}
              />

              {/* Program Details Section */}
              <tr className="bg-[#f8f9fa]">
                <td
                  colSpan={programs.length + (programs.length < 4 ? 2 : 1)}
                  className="px-4 py-3 text-sm font-bold text-[#10131a]"
                >
                  Program Details
                </td>
              </tr>

              <ComparisonRow
                label="Degree Type"
                values={programs.map((program) => (
                  <span className="font-medium">{program.degreeType}</span>
                ))}
                isAlternate={true}
              />

              <ComparisonRow
                label="Duration"
                values={programs.map((program) => (
                  <span>
                    {program.durationMonths
                      ? `${program.durationMonths} months`
                      : "Not specified"}
                  </span>
                ))}
              />

              <ComparisonRow
                label="Delivery Mode"
                values={programs.map((program) => (
                  <span className="capitalize">
                    {program.deliveryMode || "Not specified"}
                  </span>
                ))}
                isAlternate={true}
              />

              <ComparisonRow
                label="Featured"
                values={programs.map((program) => (
                  <span
                    className={
                      program.isFeatured
                        ? "metric-chip text-xs"
                        : "text-[#9197ad]"
                    }
                  >
                    {program.isFeatured ? "Yes" : "No"}
                  </span>
                ))}
              />

              {/* Fees Section */}
              <tr className="bg-[#f8f9fa]">
                <td
                  colSpan={programs.length + (programs.length < 4 ? 2 : 1)}
                  className="px-4 py-3 text-sm font-bold text-[#10131a]"
                >
                  Fees
                </td>
              </tr>

              <ComparisonRow
                label="Total Fee"
                values={programs.map((program) => (
                  <span className="font-semibold text-[#10131a]">
                    {formatCurrency(program.totalFee)}
                  </span>
                ))}
                isAlternate={true}
              />

              <ComparisonRow
                label="Application Fee"
                values={programs.map((program) => (
                  <span>{formatCurrency(program.applicationFee)}</span>
                ))}
              />

              <ComparisonRow
                label="EMI Available"
                values={programs.map((program) => (
                  <span
                    className={
                      program.emiAvailable
                        ? "text-green-600 font-medium"
                        : "text-[#9197ad]"
                    }
                  >
                    {program.emiAvailable ? "Yes" : "No"}
                  </span>
                ))}
                isAlternate={true}
              />

              {/* Requirements Section */}
              <tr className="bg-[#f8f9fa]">
                <td
                  colSpan={programs.length + (programs.length < 4 ? 2 : 1)}
                  className="px-4 py-3 text-sm font-bold text-[#10131a]"
                >
                  Requirements
                </td>
              </tr>

              <ComparisonRow
                label="Work Experience"
                values={programs.map((program) => (
                  <span>
                    {program.workExperienceMinYears
                      ? `${program.workExperienceMinYears} years minimum`
                      : "Not specified"}
                  </span>
                ))}
                isAlternate={true}
              />

              {/* Specializations Section */}
              <ComparisonRow
                label="Specializations"
                values={programs.map((program) => (
                  <div className="space-y-0.5 text-[10px] md:text-sm">
                    {program.specialisations.length > 0 ? (
                      program.specialisations.map((spec) => (
                        <div
                          key={spec.id}
                          className="pill text-[9px] md:text-xs"
                        >
                          {spec.name}
                        </div>
                      ))
                    ) : (
                      <span className="text-[#9197ad]">Not specified</span>
                    )}
                  </div>
                ))}
              />

              {/* Additional Section */}
              <tr className="bg-[#f8f9fa]">
                <td
                  colSpan={programs.length + (programs.length < 4 ? 2 : 1)}
                  className="px-4 py-3 text-sm font-bold text-[#10131a]"
                >
                  Additional Information
                </td>
              </tr>

              <ComparisonRow
                label="Application Deadline"
                values={programs.map((program) => (
                  <span>{formatDate(program.applicationDeadline)}</span>
                ))}
                isAlternate={true}
              />

              <ComparisonRow
                label="Apply Now"
                values={programs.map((program) =>
                  program.applyUrl ? (
                    <a
                      href={program.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                    >
                      Apply
                    </a>
                  ) : (
                    <Link
                      href="/#lead-form"
                      className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] px-4 py-2 text-xs font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                    >
                      Express Interest
                    </Link>
                  )
                )}
              />

              <ComparisonRow
                label="Brochure"
                values={programs.map((program) =>
                  program.brochureUrl ? (
                    <a
                      href={program.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#3D38B8] hover:text-[#514EA1]"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      Download
                    </a>
                  ) : (
                    <span className="text-[#9197ad]">Not available</span>
                  )
                )}
                isAlternate={true}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Add Program Button */}
      {programs.length < 4 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAddDialog(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9dce6] bg-white px-6 py-3 text-sm font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Program to Comparison
          </button>
        </div>
      )}

      <AddProgramDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        currentProgramIds={programs.map((p) => p.id)}
      />
    </>
  );
}

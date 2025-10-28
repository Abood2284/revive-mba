// app/(site)/compare/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { getComparisonIds } from "@/lib/comparison-state";
import {
  CompareTable,
  ComparisonProgram,
} from "@/app/(site)/components/compare-table";

interface ComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchProgramDetails(id: number) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/programs/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch program ${id}: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Error fetching program ${id}:`, error);
    return null;
  }
}

async function CompareContent({ searchParams }: ComparePageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams();

  // Convert searchParams to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlSearchParams.set(key, value.join(","));
    }
  });

  const comparisonIds = getComparisonIds(urlSearchParams);

  if (comparisonIds.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="w-full px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#10131a] mb-4">
              Compare Programs
            </h1>
            <p className="text-lg text-[#5a6072] mb-8">
              Select programs to compare their features side-by-side
            </p>
            <CompareTable programs={[]} />
          </div>
        </div>
      </div>
    );
  }

  // Fetch all program details
  const programPromises = comparisonIds.map((id) => fetchProgramDetails(id));
  const programResults = await Promise.all(programPromises);

  // Filter out failed fetches
  const programs = programResults.filter(Boolean);

  if (programs.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f6fa]">
        <div className="section-container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#10131a] mb-4">
              Compare Programs
            </h1>
            <p className="text-lg text-[#5a6072] mb-8">
              Unable to load the selected programs. Please try again.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
            >
              Browse Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#10131a] mb-2">
            Compare Programs
          </h1>
          <p className="text-[#5a6072]">
            Compare {programs.length} program{programs.length !== 1 ? "s" : ""}{" "}
            side-by-side
          </p>
        </div>

        <CompareTable programs={programs as ComparisonProgram[]} />
      </div>
    </div>
  );
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D38B8] mx-auto mb-4"></div>
            <p className="text-[#5a6072]">Loading comparison...</p>
          </div>
        </div>
      }
    >
      <CompareContent searchParams={searchParams} />
    </Suspense>
  );
}

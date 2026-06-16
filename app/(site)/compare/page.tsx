// app/(site)/compare/page.tsx
import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { getComparisonIds } from "@/lib/comparison-state";
import {
  CompareTable,
  ComparisonProgram,
} from "@/app/(site)/components/compare-table";

interface ComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRequestOrigin() {
  const h = await headers();
  const explicitUrl = h.get("x-url");
  if (explicitUrl) {
    try {
      return new URL(explicitUrl).origin;
    } catch {}
  }
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  // Fallback for local dev SSR
  return "http://localhost:3000";
}

async function fetchProgramDetails(id: number) {
  try {
    const origin = await getRequestOrigin();
    const url = `${origin}/api/programs/${id}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.warn(`[compare] fetch failed`, {
        id,
        url,
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    const data = await response.json();
    console.log(`[compare] fetch ok`, { id, url });
    return data;
  } catch (error) {
    console.warn(`[compare] fetch error`, { id, error });
    return null;
  }
}

async function fetchProgramDetailsWithDiag(id: number) {
  try {
    const origin = await getRequestOrigin();
    const url = `${origin}/api/programs/${id}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return {
        program: null,
        diag: {
          id,
          url,
          ok: false,
          status: response.status,
          statusText: response.statusText,
        },
      };
    }
    const data = await response.json();
    return { program: data, diag: { id, url, ok: true, status: 200 } };
  } catch (error) {
    return {
      program: null,
      diag: {
        id,
        url: `${await getRequestOrigin()}/api/programs/${id}`,
        ok: false,
        error: String(error),
      },
    };
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
  const debug = urlSearchParams.get("debug") === "1";
  console.log(`[compare] ids`, comparisonIds);

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
  let programs: any[] = [];
  let diags: Array<Record<string, unknown>> | undefined;
  if (debug) {
    const results = await Promise.all(
      comparisonIds.map((id) => fetchProgramDetailsWithDiag(id))
    );
    programs = results.map((r) => r.program).filter(Boolean);
    diags = results.map((r) => r.diag);
    console.log(`[compare] diagnostics`, diags);
  } else {
    const programPromises = comparisonIds.map((id) => fetchProgramDetails(id));
    const programResults = await Promise.all(programPromises);
    programs = programResults.filter(Boolean);
  }

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

  // Sort programs by degree type (Masters → Bachelors → Certificates)
  const categorizeDegreeType = (degreeType: string | null | undefined): number => {
    if (!degreeType) return 4;
    const lower = degreeType.toLowerCase().trim();
    
    // Combo degrees (priority 2) - check first to avoid misclassification
    if (lower.includes("combo") || lower.includes("+")) {
      return 2;
    }
    
    // Masters degrees (priority 0)
    if (
      lower.startsWith("m") &&
      (lower.includes("mba") ||
        lower.includes("m.com") ||
        lower.includes("mcom") ||
        lower.includes("m.sc") ||
        lower.includes("msc") ||
        lower.includes("mca") ||
        lower === "ma" ||
        lower.startsWith("ma ") ||
        lower.includes("master"))
    ) {
      return 0;
    }
    
    // Bachelors degrees (priority 1)
    if (
      lower.startsWith("b") &&
      (lower.includes("bba") ||
        lower.includes("b.a") ||
        lower === "b.a." ||
        lower.includes("ba ") ||
        lower.includes("bca") ||
        lower.includes("b.com") ||
        lower.includes("bcom") ||
        lower.includes("b.sc") ||
        lower.includes("bsc") ||
        lower.includes("bachelor"))
    ) {
      return 1;
    }
    
    // Certificate (priority 3)
    if (lower.includes("certificate")) {
      return 3;
    }
    
    // Other (priority 4)
    return 4;
  };

  const sortedPrograms = [...programs].sort((a, b) => {
    const categoryA = categorizeDegreeType(a.degreeType);
    const categoryB = categorizeDegreeType(b.degreeType);
    
    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }
    
    // Alphabetically within same category
    return (a.title || "").localeCompare(b.title || "");
  });

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

        {urlSearchParams.get("debug") === "1" && diags && (
          <div className="mb-6 rounded-lg border border-[#d9dce6] bg-white p-4 text-xs text-[#10131a]">
            <div className="font-semibold mb-2">Diagnostics</div>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(diags, null, 2)}
            </pre>
          </div>
        )}

        <CompareTable programs={sortedPrograms as ComparisonProgram[]} />
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

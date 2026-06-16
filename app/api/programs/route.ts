// app/api/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions, programs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

type ApiProgram = {
  id: string;
  title: string;
  university: string;
  specialization: string;
  mode: "online" | "blended" | "distance";
  durationMonths: number;
  totalFeeINR: number;
  nextIntake?: string;
  badges?: string[];
  heroImage?: string;
  logoUrl?: string;
  degreeType?: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const parsedLimit =
      limitParam !== null ? Number.parseInt(limitParam, 10) : undefined;
    const limit =
      parsedLimit !== undefined && Number.isFinite(parsedLimit)
        ? Math.max(parsedLimit, 1)
        : undefined;

    const baseQuery = db
      .select({
        id: programs.id,
        title: programs.title,
        durationMonths: programs.durationMonths,
        deliveryMode: programs.deliveryMode,
        totalFee: programs.totalFee,
        applicationDeadline: programs.applicationDeadline,
        institutionName: institutions.name,
        institutionAccreditation: institutions.accreditation,
        heroImage: programs.heroImage,
        logoUrl: institutions.logoUrl,
        degreeType: programs.degreeType,
      })
      .from(programs)
      .leftJoin(institutions, eq(programs.institutionId, institutions.id));

    const rows = limit ? await baseQuery.limit(limit) : await baseQuery;

    const programsPayload: ApiProgram[] = rows.map((row) => ({
      id: String(row.id),
      title: row.title ?? "Program coming soon",
      university: row.institutionName ?? "Partner university",
      specialization: inferSpecialization(row.title),
      mode: mapDeliveryMode(row.deliveryMode),
      durationMonths: row.durationMonths ?? 24,
      totalFeeINR: row.totalFee ?? 0,
      nextIntake: formatIntake(row.applicationDeadline),
      badges: parseBadges(row.institutionAccreditation),
      heroImage: row.heroImage ?? undefined,
      logoUrl: row.logoUrl ?? undefined,
      degreeType: row.degreeType ?? undefined,
    }));

    // Sort programs: MBA/Master's first, then by university order (NMIMS, VIT, AMITY, DY PATIL)
    const sortedPrograms = sortPrograms(programsPayload);

    return NextResponse.json({ programs: sortedPrograms });
  } catch (error) {
    console.error("Failed to fetch programs", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

function mapDeliveryMode(mode: string | null): ApiProgram["mode"] {
  switch (mode) {
    case "online":
    case "blended":
    case "distance":
      return mode;
    case "weekend":
    case "on-campus":
      return "blended";
    default:
      return "online";
  }
}

function inferSpecialization(title?: string | null): ApiProgram["specialization"] {
  if (!title) return "general";
  const lower = title.toLowerCase();
  if (lower.includes("finance")) return "finance";
  if (lower.includes("marketing")) return "marketing";
  if (lower.includes("analytics")) return "business-analytics";
  if (lower.includes("human resource") || lower.includes("hr")) return "hr";
  if (lower.includes("operations")) return "operations";
  if (lower.includes("it") || lower.includes("technology")) return "it";
  if (lower.includes("healthcare") || lower.includes("hospital"))
    return "healthcare";
  return "general";
}

function formatIntake(date?: string | Date | null) {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function parseBadges(accreditation?: string | null) {
  if (!accreditation) return undefined;
  return accreditation
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function sortPrograms(programs: ApiProgram[]): ApiProgram[] {
  // University priority order: NMIMS, UMAS, VIT, AMITY, DY PATIL
  const universityOrder: Record<string, number> = {
    nmims: 0,
    "nmims global access school": 0,
    umas: 1,
    "university of massachusetts": 1,
    "umas university": 1,
    vit: 2,
    "vit university": 2,
    amity: 3,
    "amity university": 3,
    "dy patil": 4,
    "dr. dy patil": 4,
  };

  function getUniversityPriority(university: string): number {
    const normalized = university.toLowerCase().trim();
    for (const [key, priority] of Object.entries(universityOrder)) {
      if (normalized.includes(key)) {
        return priority;
      }
    }
    return 999; // Other universities come last
  }

  function isMastersOrMBA(degreeType?: string): boolean {
    if (!degreeType) return false;
    const normalized = degreeType.toLowerCase().trim();
    return (
      normalized.includes("mba") ||
      normalized.includes("master") ||
      normalized.includes("m.com") ||
      normalized.includes("mcom") ||
      normalized.includes("m.sc") ||
      normalized.includes("msc") ||
      normalized.includes("mca") ||
      normalized === "ma" ||
      normalized.startsWith("ma ") ||
      normalized.includes("pgdm")
    );
  }

  function isCertification(degreeType?: string): boolean {
    if (!degreeType) return false;
    const normalized = degreeType.toLowerCase().trim();
    return normalized.includes("certificate") || normalized.includes("certification");
  }

  return [...programs].sort((a, b) => {
    // First: Filter out certifications (they come last)
    const aIsCert = isCertification(a.degreeType);
    const bIsCert = isCertification(b.degreeType);
    if (aIsCert && !bIsCert) return 1;
    if (!aIsCert && bIsCert) return -1;

    // Second: Prioritize MBA/Master's programs
    const aIsMasters = isMastersOrMBA(a.degreeType);
    const bIsMasters = isMastersOrMBA(b.degreeType);
    if (aIsMasters && !bIsMasters) return -1;
    if (!aIsMasters && bIsMasters) return 1;

    // Third: Sort by university priority (NMIMS, UMAS, VIT, AMITY, DY PATIL)
    const aUniPriority = getUniversityPriority(a.university);
    const bUniPriority = getUniversityPriority(b.university);
    if (aUniPriority !== bUniPriority) {
      return aUniPriority - bUniPriority;
    }

    // Fourth: Maintain featured status priority
    // (Note: We can't access isFeatured here, so we maintain original order for same university)
    return 0;
  });
}

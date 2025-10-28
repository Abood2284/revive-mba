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
      })
      .from(programs)
      .leftJoin(institutions, eq(programs.institutionId, institutions.id))
      .orderBy(sql`${programs.isFeatured} DESC, ${programs.createdAt} DESC`);

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
    }));

    return NextResponse.json({ programs: programsPayload });
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

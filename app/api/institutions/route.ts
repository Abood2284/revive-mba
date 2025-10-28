// app/api/institutions/route.ts
// Purpose: Public institutions API - list institutions with their programs

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions, programs } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

type ApiInstitution = {
  id: string;
  name: string;
  slug: string;
  location?: string;
  accreditation?: string;
  website?: string;
  logoUrl?: string;
  establishedYear?: number;
  shortDescription?: string;
  programs: ApiProgram[];
};

type ApiProgram = {
  id: string;
  title: string;
  degreeType: string;
  durationMonths?: number;
  deliveryMode?: string;
  totalFee?: number;
  isFeatured: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const featuredOnly = searchParams.get("featured") === "true";

    const parsedLimit =
      limitParam !== null ? Number.parseInt(limitParam, 10) : undefined;
    const limit =
      parsedLimit !== undefined && Number.isFinite(parsedLimit)
        ? Math.max(parsedLimit, 1)
        : undefined;

    // Build base query for institutions
    const baseInstitutionsQuery = db
      .select({
        id: institutions.id,
        name: institutions.name,
        slug: institutions.slug,
        location: institutions.location,
        accreditation: institutions.accreditation,
        website: institutions.website,
        logoUrl: institutions.logoUrl,
        establishedYear: institutions.establishedYear,
        shortDescription: institutions.shortDescription,
      })
      .from(institutions)
      .orderBy(institutions.name);

    // Apply limit if specified
    const institutionsList = limit
      ? await baseInstitutionsQuery.limit(limit)
      : await baseInstitutionsQuery;

    // Fetch programs for each institution
    const institutionsWithPrograms: ApiInstitution[] = await Promise.all(
      institutionsList.map(async (institution) => {
        // Build programs query for this institution
        const conditions = [eq(programs.institutionId, institution.id)];

        // If featured only, filter programs
        if (featuredOnly) {
          conditions.push(eq(programs.isFeatured, true));
        }

        const programsList = await db
          .select({
            id: programs.id,
            title: programs.title,
            degreeType: programs.degreeType,
            durationMonths: programs.durationMonths,
            deliveryMode: programs.deliveryMode,
            totalFee: programs.totalFee,
            isFeatured: programs.isFeatured,
          })
          .from(programs)
          .where(and(...conditions))
          .orderBy(
            sql`${programs.isFeatured} DESC, ${programs.createdAt} DESC`
          );

        // If featured=true but no featured programs found, get all programs for this institution
        const finalProgramsList =
          featuredOnly && programsList.length === 0
            ? await db
                .select({
                  id: programs.id,
                  title: programs.title,
                  degreeType: programs.degreeType,
                  durationMonths: programs.durationMonths,
                  deliveryMode: programs.deliveryMode,
                  totalFee: programs.totalFee,
                  isFeatured: programs.isFeatured,
                })
                .from(programs)
                .where(eq(programs.institutionId, institution.id))
                .orderBy(sql`${programs.createdAt} DESC`)
            : programsList;

        const apiPrograms: ApiProgram[] = finalProgramsList.map((program) => ({
          id: String(program.id),
          title: program.title,
          degreeType: program.degreeType,
          durationMonths: program.durationMonths ?? undefined,
          deliveryMode: program.deliveryMode ?? undefined,
          totalFee: program.totalFee ?? undefined,
          isFeatured: program.isFeatured ?? false,
        }));

        return {
          id: String(institution.id),
          name: institution.name,
          slug: institution.slug,
          location: institution.location ?? undefined,
          accreditation: institution.accreditation ?? undefined,
          website: institution.website ?? undefined,
          logoUrl: institution.logoUrl ?? undefined,
          establishedYear: institution.establishedYear ?? undefined,
          shortDescription: institution.shortDescription ?? undefined,
          programs: apiPrograms,
        };
      })
    );

    // If featured only, filter institutions that have featured programs
    // If no programs are featured, show all institutions instead of empty result
    const filteredInstitutions = featuredOnly
      ? institutionsWithPrograms.filter((inst) =>
          inst.programs.some((p) => p.isFeatured)
        )
      : institutionsWithPrograms;

    // Fallback: if featured=true but no featured programs exist, show all institutions
    const finalInstitutions =
      featuredOnly && filteredInstitutions.length === 0
        ? institutionsWithPrograms
        : filteredInstitutions;

    return NextResponse.json({ institutions: finalInstitutions });
  } catch (error) {
    console.error("Failed to fetch institutions", error);
    return NextResponse.json(
      { error: "Failed to fetch institutions" },
      { status: 500 }
    );
  }
}

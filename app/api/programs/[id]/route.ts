// app/api/programs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  institutions,
  programs,
  programSpecialisations,
  programFees,
  programFaqs,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const programId = parseInt(id, 10);

    if (isNaN(programId)) {
      return NextResponse.json(
        { error: "Invalid program ID" },
        { status: 400 }
      );
    }

    // Fetch program with institution details
    const [program] = await db
      .select({
        id: programs.id,
        degreeType: programs.degreeType,
        title: programs.title,
        durationMonths: programs.durationMonths,
        deliveryMode: programs.deliveryMode,
        totalFee: programs.totalFee,
        applicationFee: programs.applicationFee,
        emiAvailable: programs.emiAvailable,
        highlights: programs.highlights,
        outcomes: programs.outcomes,
        eligibility: programs.eligibility,
        curriculum: programs.curriculum,
        workExperienceMinYears: programs.workExperienceMinYears,
        isFeatured: programs.isFeatured,
        heroImage: programs.heroImage,
        brochureUrl: programs.brochureUrl,
        applyUrl: programs.applyUrl,
        applicationDeadline: programs.applicationDeadline,
        institution: {
          id: institutions.id,
          name: institutions.name,
          location: institutions.location,
          accreditation: institutions.accreditation,
          website: institutions.website,
          logoUrl: institutions.logoUrl,
          establishedYear: institutions.establishedYear,
          shortDescription: institutions.shortDescription,
        },
      })
      .from(programs)
      .leftJoin(institutions, eq(programs.institutionId, institutions.id))
      .where(eq(programs.id, programId));

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Fetch related data
    const [specialisations, fees, faqs] = await Promise.all([
      db
        .select()
        .from(programSpecialisations)
        .where(eq(programSpecialisations.programId, programId)),
      db.select().from(programFees).where(eq(programFees.programId, programId)),
      db.select().from(programFaqs).where(eq(programFaqs.programId, programId)),
    ]);

    const programData = {
      ...program,
      specialisations,
      fees,
      faqs,
    };

    return NextResponse.json(programData);
  } catch (error) {
    console.error("Failed to fetch program details", error);
    return NextResponse.json(
      { error: "Failed to fetch program details" },
      { status: 500 }
    );
  }
}

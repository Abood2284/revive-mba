// app/api/leads/route.ts
// Purpose: Client-facing lead submission API

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { completeLeadSchema } from "@/lib/validations/lead";
import {
  createSuccessResponse,
  createErrorResponse,
  formatValidationErrors,
  HTTP_STATUS,
} from "@/lib/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the lead data
    const result = completeLeadSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Insert lead into database
    const [lead] = await db
      .insert(leads)
      .values({
        fullName: validatedData.fullName,
        gender: validatedData.gender || null,
        email: validatedData.email,
        phone: validatedData.phone,
        dob: validatedData.dob || null,
        state: validatedData.state,
        city: validatedData.city,
        employmentStatus: validatedData.employmentStatus,
        salaryBand: validatedData.salaryBand || null,
        highestQualification: validatedData.highestQualification,
        lastScorePercent: validatedData.lastScorePercent?.toString() || null,
        degreeInterest: validatedData.degreeInterest,
        coursePreference: validatedData.coursePreference || null,
        specialisationInterest: validatedData.specialisationInterest || null,
        goal: validatedData.goal,
        budgetRange: validatedData.budgetRange,
        wantsEmi: validatedData.wantsEmi,
        category: validatedData.category || null,
        experienceYears: validatedData.experienceYears?.toString() || null,
        preferredMode: validatedData.preferredMode,
        source: validatedData.source || null,
        utmCampaign: validatedData.utmCampaign || null,
        consentedAt: new Date(),
      })
      .returning({ id: leads.id });

    if (!lead) {
      return NextResponse.json(createErrorResponse("Failed to create lead"), {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    }

    return NextResponse.json(createSuccessResponse({ leadId: lead.id }), {
      status: HTTP_STATUS.CREATED,
    });
  } catch (error) {
    console.error("Error submitting lead:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "An unexpected error occurred"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

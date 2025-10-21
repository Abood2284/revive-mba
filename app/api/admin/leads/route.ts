// app/api/admin/leads/route.ts
// Purpose: Admin leads list

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sql } from "drizzle-orm";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorResponse,
  HTTP_STATUS,
} from "@/lib/types/api";

const listSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = listSchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );
    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse("Invalid query parameters"),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const page = parsed.data.page ?? 1;
    const limit = parsed.data.limit ?? 100;
    const offset = (page - 1) * limit;

    const leadList = await db
      .select({
        id: leads.id,
        fullName: leads.fullName,
        gender: leads.gender,
        email: leads.email,
        phone: leads.phone,
        dob: leads.dob,
        state: leads.state,
        city: leads.city,
        employmentStatus: leads.employmentStatus,
        salaryBand: leads.salaryBand,
        highestQualification: leads.highestQualification,
        lastScorePercent: leads.lastScorePercent,
        degreeInterest: leads.degreeInterest,
        coursePreference: leads.coursePreference,
        specialisationInterest: leads.specialisationInterest,
        goal: leads.goal,
        budgetRange: leads.budgetRange,
        wantsEmi: leads.wantsEmi,
        category: leads.category,
        experienceYears: leads.experienceYears,
        preferredMode: leads.preferredMode,
        source: leads.source,
        utmCampaign: leads.utmCampaign,
        consentedAt: leads.consentedAt,
        notes: leads.notes,
        status: leads.status,
      })
      .from(leads)
      .orderBy(sql`${leads.consentedAt} DESC`)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(createSuccessResponse(leadList));
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch leads"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

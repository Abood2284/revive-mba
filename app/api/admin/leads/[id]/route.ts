// app/api/admin/leads/[id]/route.ts
// Purpose: Admin leads CRUD - get, update, delete single lead

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorResponse,
  formatValidationErrors,
  HTTP_STATUS,
} from "@/lib/types/api";

// Schema for updating lead notes and status
const updateLeadSchema = z.object({
  notes: z.string().max(1000).optional(),
  status: z
    .enum(["new", "pending", "reached_out", "completed", "closed"]) // CRM statuses
    .optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json(createErrorResponse("Invalid lead ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const [lead] = await db
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
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return NextResponse.json(createErrorResponse("Lead not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    return NextResponse.json(createSuccessResponse(lead));
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch lead"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json(createErrorResponse("Invalid lead ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const body = await request.json();

    // Validate the update data
    const result = updateLeadSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if lead exists
    const [existingLead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!existingLead) {
      return NextResponse.json(createErrorResponse("Lead not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Update lead
    const [updatedLead] = await db
      .update(leads)
      .set(validatedData)
      .where(eq(leads.id, leadId))
      .returning({ id: leads.id });

    return NextResponse.json(createSuccessResponse({ leadId: updatedLead.id }));
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to update lead"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json(createErrorResponse("Invalid lead ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    // Check if lead exists
    const [existingLead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!existingLead) {
      return NextResponse.json(createErrorResponse("Lead not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Delete lead (cascade will handle related records)
    await db.delete(leads).where(eq(leads.id, leadId));

    return NextResponse.json(createSuccessResponse({ deleted: true }));
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to delete lead"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

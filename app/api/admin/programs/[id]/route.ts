// app/api/admin/programs/[id]/route.ts
// Purpose: Admin programs CRUD - get, update, delete single program

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { programs, institutions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateProgramSchema } from "@/lib/validations/program";
import {
  createSuccessResponse,
  createErrorResponse,
  formatValidationErrors,
  HTTP_STATUS,
} from "@/lib/types/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const programId = parseInt(id, 10);

    if (isNaN(programId)) {
      return NextResponse.json(createErrorResponse("Invalid program ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const [program] = await db
      .select({
        id: programs.id,
        institutionId: programs.institutionId,
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
        brochureUrl: programs.brochureUrl,
        heroImage: programs.heroImage,
        applyUrl: programs.applyUrl,
        applicationDeadline: programs.applicationDeadline,
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
        institution: {
          id: institutions.id,
          name: institutions.name,
          slug: institutions.slug,
        },
      })
      .from(programs)
      .leftJoin(institutions, eq(programs.institutionId, institutions.id))
      .where(eq(programs.id, programId))
      .limit(1);

    if (!program) {
      return NextResponse.json(createErrorResponse("Program not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    return NextResponse.json(createSuccessResponse(program));
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch program"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const programId = parseInt(id, 10);

    if (isNaN(programId)) {
      return NextResponse.json(createErrorResponse("Invalid program ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const body = await request.json();

    // Validate the update data
    const result = updateProgramSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if program exists
    const [existingProgram] = await db
      .select({ id: programs.id })
      .from(programs)
      .where(eq(programs.id, programId))
      .limit(1);

    if (!existingProgram) {
      return NextResponse.json(createErrorResponse("Program not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // If institutionId is being updated, check if new institution exists
    if (validatedData.institutionId) {
      const [institution] = await db
        .select({ id: institutions.id })
        .from(institutions)
        .where(eq(institutions.id, validatedData.institutionId))
        .limit(1);

      if (!institution) {
        return NextResponse.json(createErrorResponse("Institution not found"), {
          status: HTTP_STATUS.NOT_FOUND,
        });
      }
    }

    // Update program
    const [updatedProgram] = await db
      .update(programs)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, programId))
      .returning({ id: programs.id });

    return NextResponse.json(
      createSuccessResponse({ programId: updatedProgram.id })
    );
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to update program"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const programId = parseInt(id, 10);

    if (isNaN(programId)) {
      return NextResponse.json(createErrorResponse("Invalid program ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    // Check if program exists
    const [existingProgram] = await db
      .select({ id: programs.id })
      .from(programs)
      .where(eq(programs.id, programId))
      .limit(1);

    if (!existingProgram) {
      return NextResponse.json(createErrorResponse("Program not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Delete program (cascade will handle related records)
    await db.delete(programs).where(eq(programs.id, programId));

    return NextResponse.json(createSuccessResponse({ deleted: true }));
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to delete program"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

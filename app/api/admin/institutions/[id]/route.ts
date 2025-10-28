// app/api/admin/institutions/[id]/route.ts
// Purpose: Admin institutions CRUD - get, update, delete single institution

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions, programs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateInstitutionSchema } from "@/lib/validations/institution";
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
    const institutionId = parseInt(id, 10);

    if (isNaN(institutionId)) {
      return NextResponse.json(createErrorResponse("Invalid institution ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const [institution] = await db
      .select({
        id: institutions.id,
        name: institutions.name,
        slug: institutions.slug,
        location: institutions.location,
        accreditation: institutions.accreditation,
        website: institutions.website,
        heroImage: institutions.heroImage,
        logoUrl: institutions.logoUrl,
        establishedYear: institutions.establishedYear,
        shortDescription: institutions.shortDescription,
        createdAt: institutions.createdAt,
        updatedAt: institutions.updatedAt,
      })
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!institution) {
      return NextResponse.json(createErrorResponse("Institution not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    return NextResponse.json(createSuccessResponse(institution));
  } catch (error) {
    console.error("Error fetching institution:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch institution"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id, 10);

    if (isNaN(institutionId)) {
      return NextResponse.json(createErrorResponse("Invalid institution ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const body = await request.json();

    // Validate the update data
    const result = updateInstitutionSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if institution exists
    const [existingInstitution] = await db
      .select({ id: institutions.id })
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!existingInstitution) {
      return NextResponse.json(createErrorResponse("Institution not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // If slug is being updated, check if new slug already exists
    if (validatedData.slug) {
      const [slugConflict] = await db
        .select({ id: institutions.id })
        .from(institutions)
        .where(eq(institutions.slug, validatedData.slug))
        .limit(1);

      if (slugConflict && slugConflict.id !== institutionId) {
        return NextResponse.json(
          createErrorResponse("Institution with this slug already exists"),
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    // Update institution
    const [updatedInstitution] = await db
      .update(institutions)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(institutions.id, institutionId))
      .returning({
        id: institutions.id,
        name: institutions.name,
        slug: institutions.slug,
        location: institutions.location,
        accreditation: institutions.accreditation,
        website: institutions.website,
        heroImage: institutions.heroImage,
        logoUrl: institutions.logoUrl,
        establishedYear: institutions.establishedYear,
        shortDescription: institutions.shortDescription,
        updatedAt: institutions.updatedAt,
      });

    return NextResponse.json(
      createSuccessResponse(updatedInstitution)
    );
  } catch (error) {
    console.error("Error updating institution:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to update institution"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const institutionId = parseInt(id, 10);

    if (isNaN(institutionId)) {
      return NextResponse.json(createErrorResponse("Invalid institution ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    // Check if institution exists
    const [existingInstitution] = await db
      .select({ id: institutions.id })
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!existingInstitution) {
      return NextResponse.json(createErrorResponse("Institution not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Check if institution has programs
    const [programCount] = await db
      .select({ count: programs.id })
      .from(programs)
      .where(eq(programs.institutionId, institutionId))
      .limit(1);

    if (programCount) {
      return NextResponse.json(
        createErrorResponse("Cannot delete institution with existing programs"),
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Delete institution (cascade will handle related records)
    await db.delete(institutions).where(eq(institutions.id, institutionId));

    return NextResponse.json(createSuccessResponse({ deleted: true }));
  } catch (error) {
    console.error("Error deleting institution:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to delete institution"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// app/api/admin/institutions/route.ts
// Purpose: Admin institutions CRUD - list and create

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions } from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import {
  createInstitutionSchema,
  listInstitutionsSchema,
} from "@/lib/validations/institution";
import {
  createSuccessResponse,
  createErrorResponse,
  formatValidationErrors,
  HTTP_STATUS,
} from "@/lib/types/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const result = listInstitutionsSchema.safeParse(queryParams);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Invalid query parameters", fieldErrors),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const filters = result.data;
    const conditions = [];

    // Build search filter
    if (filters.search) {
      conditions.push(ilike(institutions.name, `%${filters.search}%`));
    }

    // Build query
    const query = db
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
      .orderBy(institutions.name);

    // Apply filters
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const institutionList = await query.limit(limit).offset(offset);

    return NextResponse.json(createSuccessResponse(institutionList));
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch institutions"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the institution data
    const result = createInstitutionSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if slug already exists
    const [existingInstitution] = await db
      .select({ id: institutions.id })
      .from(institutions)
      .where(eq(institutions.slug, validatedData.slug))
      .limit(1);

    if (existingInstitution) {
      return NextResponse.json(
        createErrorResponse("Institution with this slug already exists"),
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Insert institution
    const [institution] = await db
      .insert(institutions)
      .values({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: institutions.id });

    if (!institution) {
      return NextResponse.json(
        createErrorResponse("Failed to create institution"),
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(
      createSuccessResponse({ institutionId: institution.id }),
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error("Error creating institution:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to create institution"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

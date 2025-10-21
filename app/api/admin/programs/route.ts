// app/api/admin/programs/route.ts
// Purpose: Admin programs CRUD - list and create

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { programs, institutions } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import {
  createProgramSchema,
  listProgramsSchema,
} from "@/lib/validations/program";
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
    const result = listProgramsSchema.safeParse(queryParams);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Invalid query parameters", fieldErrors),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const filters = result.data;
    const conditions = [];

    // Build filter conditions
    if (filters.institutionId) {
      conditions.push(eq(programs.institutionId, filters.institutionId));
    }

    if (filters.degreeType) {
      conditions.push(eq(programs.degreeType, filters.degreeType));
    }

    if (filters.deliveryMode) {
      conditions.push(eq(programs.deliveryMode, filters.deliveryMode));
    }

    if (filters.minFee) {
      conditions.push(gte(programs.totalFee, filters.minFee));
    }

    if (filters.maxFee) {
      conditions.push(lte(programs.totalFee, filters.maxFee));
    }

    if (filters.isFeatured !== undefined) {
      conditions.push(eq(programs.isFeatured, filters.isFeatured));
    }

    // Build query
    const query = db
      .select({
        id: programs.id,
        title: programs.title,
        degreeType: programs.degreeType,
        deliveryMode: programs.deliveryMode,
        totalFee: programs.totalFee,
        isFeatured: programs.isFeatured,
        createdAt: programs.createdAt,
        institution: {
          id: institutions.id,
          name: institutions.name,
        },
      })
      .from(programs)
      .leftJoin(institutions, eq(programs.institutionId, institutions.id))
      .orderBy(sql`${programs.isFeatured} DESC, ${programs.createdAt} DESC`);

    // Apply filters
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const programList = await query.limit(limit).offset(offset);

    return NextResponse.json(createSuccessResponse(programList));
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch programs"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the program data
    const result = createProgramSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if institution exists
    const institution = await db
      .select({ id: institutions.id })
      .from(institutions)
      .where(eq(institutions.id, validatedData.institutionId))
      .limit(1);

    if (institution.length === 0) {
      return NextResponse.json(createErrorResponse("Institution not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Insert program
    const [program] = await db
      .insert(programs)
      .values({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: programs.id });

    if (!program) {
      return NextResponse.json(
        createErrorResponse("Failed to create program"),
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(createSuccessResponse({ programId: program.id }), {
      status: HTTP_STATUS.CREATED,
    });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to create program"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// app/api/admin/admins/route.ts
// Purpose: Admin user management CRUD - list and create

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createAdminSchema, listAdminsSchema } from "@/lib/validations/admin";
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
    const result = listAdminsSchema.safeParse(queryParams);

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
    if (filters.role) {
      conditions.push(eq(admins.role, filters.role));
    }

    if (filters.isActive !== undefined) {
      conditions.push(eq(admins.isActive, filters.isActive));
    }

    // Build query
    const query = db
      .select({
        id: admins.id,
        email: admins.email,
        name: admins.name,
        role: admins.role,
        isActive: admins.isActive,
        lastLoginAt: admins.lastLoginAt,
        createdAt: admins.createdAt,
        updatedAt: admins.updatedAt,
      })
      .from(admins)
      .orderBy(admins.createdAt);

    // Apply filters
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const adminList = await query.limit(limit).offset(offset);

    return NextResponse.json(createSuccessResponse(adminList));
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch admins"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the admin data
    const result = createAdminSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if email already exists
    const [existingAdmin] = await db
      .select({ id: admins.id })
      .from(admins)
      .where(eq(admins.email, validatedData.email))
      .limit(1);

    if (existingAdmin) {
      return NextResponse.json(
        createErrorResponse("Admin with this email already exists"),
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    // Insert admin (store password as plain text for simplicity)
    const [admin] = await db
      .insert(admins)
      .values({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name || null,
        role: validatedData.role || "editor",
        isActive:
          validatedData.isActive !== undefined ? validatedData.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: admins.id });

    if (!admin) {
      return NextResponse.json(createErrorResponse("Failed to create admin"), {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    }

    return NextResponse.json(createSuccessResponse({ adminId: admin.id }), {
      status: HTTP_STATUS.CREATED,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to create admin"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// app/api/admin/admins/[id]/route.ts
// Purpose: Admin user management CRUD - get, update, delete single admin

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateAdminSchema } from "@/lib/validations/admin";
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
    const adminId = parseInt(id, 10);

    if (isNaN(adminId)) {
      return NextResponse.json(createErrorResponse("Invalid admin ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const [admin] = await db
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
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!admin) {
      return NextResponse.json(createErrorResponse("Admin not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    return NextResponse.json(createSuccessResponse(admin));
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to fetch admin"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminId = parseInt(id, 10);

    if (isNaN(adminId)) {
      return NextResponse.json(createErrorResponse("Invalid admin ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const body = await request.json();

    // Validate the update data
    const result = updateAdminSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = formatValidationErrors(result.error.issues);
      return NextResponse.json(
        createErrorResponse("Validation failed", fieldErrors),
        { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
      );
    }

    const validatedData = result.data;

    // Check if admin exists
    const [existingAdmin] = await db
      .select({ id: admins.id })
      .from(admins)
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!existingAdmin) {
      return NextResponse.json(createErrorResponse("Admin not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // If email is being updated, check if new email already exists
    if (validatedData.email) {
      const [emailConflict] = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.email, validatedData.email))
        .limit(1);

      if (emailConflict && emailConflict.id !== adminId) {
        return NextResponse.json(
          createErrorResponse("Admin with this email already exists"),
          { status: HTTP_STATUS.CONFLICT }
        );
      }
    }

    // Prepare update data
    const updateData: Partial<typeof admins.$inferInsert> = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Store password as plain text if provided
    if (validatedData.password) {
      updateData.password = validatedData.password;
    }

    // Update admin
    const [updatedAdmin] = await db
      .update(admins)
      .set(updateData)
      .where(eq(admins.id, adminId))
      .returning({ id: admins.id });

    return NextResponse.json(
      createSuccessResponse({ adminId: updatedAdmin.id })
    );
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to update admin"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const adminId = parseInt(id, 10);

    if (isNaN(adminId)) {
      return NextResponse.json(createErrorResponse("Invalid admin ID"), {
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    // Check if admin exists
    const [existingAdmin] = await db
      .select({ id: admins.id, role: admins.role })
      .from(admins)
      .where(eq(admins.id, adminId))
      .limit(1);

    if (!existingAdmin) {
      return NextResponse.json(createErrorResponse("Admin not found"), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Prevent deletion of superadmin (basic protection)
    if (existingAdmin.role === "superadmin") {
      return NextResponse.json(
        createErrorResponse("Cannot delete superadmin"),
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Delete admin
    await db.delete(admins).where(eq(admins.id, adminId));

    return NextResponse.json(createSuccessResponse({ deleted: true }));
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to delete admin"
      ),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

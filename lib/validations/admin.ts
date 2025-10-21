// lib/validations/admin.ts
// Purpose: Zod schemas for admin user CRUD operations

import { z } from "zod";

// Base admin schema for creation
export const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  role: z.enum(["superadmin", "editor", "viewer"]).optional(),
  isActive: z.boolean().optional(),
});

// Update admin schema (password optional, others required)
export const updateAdminSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(["superadmin", "editor", "viewer"]).optional(),
  isActive: z.boolean().optional(),
});

// Login schema
export const loginAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Query parameters for listing admins
export const listAdminsSchema = z.object({
  role: z.enum(["superadmin", "editor", "viewer"]).optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type LoginAdminInput = z.infer<typeof loginAdminSchema>;
export type ListAdminsInput = z.infer<typeof listAdminsSchema>;

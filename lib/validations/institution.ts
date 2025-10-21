// lib/validations/institution.ts
// Purpose: Zod schemas for institution CRUD operations

import { z } from "zod";

// Base institution schema for creation
export const createInstitutionSchema = z.object({
  name: z
    .string()
    .min(1, "Institution name is required")
    .max(200, "Name too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  location: z.string().max(200).optional(),
  accreditation: z.string().max(200).optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  heroImage: z
    .string()
    .url("Invalid hero image URL")
    .optional()
    .or(z.literal("")),
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  establishedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  shortDescription: z.string().max(500).optional(),
});

// Update institution schema (all fields optional except id)
export const updateInstitutionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  location: z.string().max(200).optional(),
  accreditation: z.string().max(200).optional(),
  website: z.string().url().optional().or(z.literal("")),
  heroImage: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  establishedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  shortDescription: z.string().max(500).optional(),
});

// Query parameters for listing institutions
export const listInstitutionsSchema = z.object({
  search: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;
export type UpdateInstitutionInput = z.infer<typeof updateInstitutionSchema>;
export type ListInstitutionsInput = z.infer<typeof listInstitutionsSchema>;

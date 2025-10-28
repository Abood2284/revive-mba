// lib/validations/institution.ts
// Purpose: Zod schemas for institution CRUD operations

import { z } from "zod";

// Base institution schema for creation
const optionalShortText = (max: number) =>
  z.union([z.string().max(max), z.null()]).optional();

const optionalUrl = z
  .union([z.string().url("Invalid URL"), z.literal(""), z.null()])
  .optional();

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
  location: optionalShortText(200),
  accreditation: optionalShortText(200),
  website: optionalUrl,
  heroImage: optionalUrl,
  logoUrl: optionalUrl,
  establishedYear: z
    .union([
      z
        .number()
        .int()
        .min(1800)
        .max(new Date().getFullYear()),
      z.null(),
    ])
    .optional(),
  shortDescription: optionalShortText(500),
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
  location: optionalShortText(200),
  accreditation: optionalShortText(200),
  website: optionalUrl,
  heroImage: optionalUrl,
  logoUrl: optionalUrl,
  establishedYear: z
    .union([
      z
        .number()
        .int()
        .min(1800)
        .max(new Date().getFullYear()),
      z.null(),
    ])
    .optional(),
  shortDescription: optionalShortText(500),
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

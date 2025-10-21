// lib/validations/program.ts
// Purpose: Zod schemas for program CRUD operations

import { z } from "zod";

// Base program schema for creation
export const createProgramSchema = z.object({
  institutionId: z
    .number()
    .int()
    .positive("Institution ID must be a positive integer"),
  degreeType: z
    .string()
    .min(1, "Degree type is required")
    .max(50, "Degree type too long"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  durationMonths: z.number().int().min(1).max(60).optional(),
  deliveryMode: z
    .enum(["online", "blended", "weekend", "on-campus"])
    .optional(),
  totalFee: z.number().int().min(0).optional(),
  applicationFee: z.number().int().min(0).optional(),
  emiAvailable: z.boolean().optional(),
  highlights: z.string().max(1000).optional(),
  outcomes: z.string().max(1000).optional(),
  eligibility: z.string().max(2000).optional(),
  curriculum: z.string().max(5000).optional(),
  workExperienceMinYears: z.number().int().min(0).max(20).optional(),
  isFeatured: z.boolean().optional(),
  brochureUrl: z
    .string()
    .url("Invalid brochure URL")
    .optional()
    .or(z.literal("")),
  heroImage: z
    .string()
    .url("Invalid hero image URL")
    .optional()
    .or(z.literal("")),
  applyUrl: z.string().url("Invalid apply URL").optional().or(z.literal("")),
  applicationDeadline: z.string().datetime().optional().or(z.literal("")),
});

// Update program schema (all fields optional except id)
export const updateProgramSchema = z.object({
  institutionId: z.number().int().positive().optional(),
  degreeType: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(200).optional(),
  durationMonths: z.number().int().min(1).max(60).optional(),
  deliveryMode: z
    .enum(["online", "blended", "weekend", "on-campus"])
    .optional(),
  totalFee: z.number().int().min(0).optional(),
  applicationFee: z.number().int().min(0).optional(),
  emiAvailable: z.boolean().optional(),
  highlights: z.string().max(1000).optional(),
  outcomes: z.string().max(1000).optional(),
  eligibility: z.string().max(2000).optional(),
  curriculum: z.string().max(5000).optional(),
  workExperienceMinYears: z.number().int().min(0).max(20).optional(),
  isFeatured: z.boolean().optional(),
  brochureUrl: z.string().url().optional().or(z.literal("")),
  heroImage: z.string().url().optional().or(z.literal("")),
  applyUrl: z.string().url().optional().or(z.literal("")),
  applicationDeadline: z.string().datetime().optional().or(z.literal("")),
});

// Query parameters for listing programs
export const listProgramsSchema = z.object({
  institutionId: z.string().transform(Number).optional(),
  degreeType: z.string().optional(),
  deliveryMode: z
    .enum(["online", "blended", "weekend", "on-campus"])
    .optional(),
  minFee: z.string().transform(Number).optional(),
  maxFee: z.string().transform(Number).optional(),
  isFeatured: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ListProgramsInput = z.infer<typeof listProgramsSchema>;

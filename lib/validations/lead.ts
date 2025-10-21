import { z } from "zod";

// Step 1: Profile & Goals
export const profileGoalsSchema = z.object({
  employmentStatus: z.string().min(1, "Employment status is required"),
  salaryBand: z.string().optional(),
  highestQualification: z.string().min(1, "Qualification is required"),
  lastScorePercent: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || (val >= 0 && val <= 100), {
      message: "Score must be between 0 and 100",
    }),
  goal: z.string().min(1, "Career goal is required"),
});

export type ProfileGoalsInput = z.infer<typeof profileGoalsSchema>;

// Step 2: Course Preferences
export const coursePreferencesSchema = z.object({
  degreeInterest: z.string().min(1, "Degree interest is required"),
  coursePreference: z.string().optional(),
  specialisationInterest: z.string().optional(),
  budgetRange: z.string().min(1, "Budget range is required"),
  wantsEmi: z.boolean().default(false),
  preferredMode: z.string().min(1, "Preferred mode is required"),
});

export type CoursePreferencesInput = z.infer<typeof coursePreferencesSchema>;

// Step 3: Eligibility Context
export const eligibilityContextSchema = z.object({
  category: z.string().optional(),
  experienceYears: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || val >= 0, {
      message: "Experience must be a positive number",
    }),
});

export type EligibilityContextInput = z.infer<typeof eligibilityContextSchema>;

// Step 4: Contact Details
export const contactDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  gender: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  dob: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  source: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type ContactDetailsInput = z.infer<typeof contactDetailsSchema>;

// Combined schema for final submission
export const completeLeadSchema = profileGoalsSchema
  .merge(coursePreferencesSchema)
  .merge(eligibilityContextSchema)
  .merge(contactDetailsSchema);

export type CompleteLeadInput = z.infer<typeof completeLeadSchema>;

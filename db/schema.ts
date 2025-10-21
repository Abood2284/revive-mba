// db/schema.ts
// Purpose: Brochure-first, conversion-focused MBA/PG catalog.
// Design cues:
// - Programs are the hero entity (degreeType/title/fees/duration/mode).
// - Institutions hold brand context and assets.
// - Optional breakdown tables (fees, FAQs) mirror brochure structure.
// - Assets table keeps brochures/images organized + dedupable.
// - Leads capture the funnel. Admins secure the dashboard.

import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* =============================================================================
   ENUMS
   =============================================================================
   delivery_mode: Normalized values so filters remain clean in UI.
   -----------------------------------------------------------------------------
   - "online"   : Full online programs (majority of catalog)
   - "blended"  : Hybrid / online + campus immersion
   - "weekend"  : Weekend classroom/virtual formats (common for exec MBAs)
   - "on-campus": Rare, kept for consistency if needed
============================================================================= */
export const deliveryModeEnum = pgEnum("delivery_mode", [
  "online",
  "blended",
  "weekend",
  "on-campus",
]);

/* =============================================================================
   ADMINS  — Lock the admin dashboard
   =============================================================================
   What:
     Minimal admin identity store for your internal dashboard (email/password).

   Crucial columns:
     - email (unique): Login identifier.
     - password: Store Argon2/Bcrypt hash ONLY (never plaintext).
     - role: Simple RBAC for future (superadmin/editor/viewer).
     - lastLoginAt: Useful for basic auditability.
============================================================================= */
export const adminRoleEnum = pgEnum("admin_role", [
  "superadmin",
  "editor",
  "viewer",
]);

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    name: text("name"),
    role: adminRoleEnum("role").default("editor").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailUq: uniqueIndex("admins_email_uq").on(table.email),
    roleIdx: index("admins_role_idx").on(table.role),
  })
);

/* =============================================================================
   INSTITUTIONS  — Universities/Schools/Partners
   =============================================================================
   What:
     Master record for each university/institute offering programs via your
     catalog (e.g., "Manipal University Jaipur", "NMIMS").

   Crucial columns:
     - slug: URL/identifier you control. Unique, stable.
     - accreditation: NAAC/NBA/UGC status or important badges.
     - heroImage / logoUrl: Power clean cards and partner badges in UI.
     - shortDescription: 1–3 lines used on listing cards or partner page.
============================================================================= */
export const institutions = pgTable(
  "institutions",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    location: text("location"),
    accreditation: text("accreditation"),
    website: text("website"),
    heroImage: text("hero_image"),
    logoUrl: text("logo_url"),
    establishedYear: integer("established_year"),
    shortDescription: text("short_description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("institutions_slug_uq").on(table.slug),
    nameIdx: index("institutions_name_idx").on(table.name),
  })
);

/* =============================================================================
   PROGRAMS  — The core catalog row
   =============================================================================
   What:
     Every program the user can discover/compare/apply to.

   Crucial columns:
     - institutionId: FK to institutions (cascades on delete).
     - degreeType: Free text (e.g., "MBA", "PGDM", "Executive MBA"); flexible now.
     - durationMonths: Normalized to months (24, 12, etc.) for filters.
     - deliveryMode: ENUM for clean facets (online/blended/weekend/on-campus).
     - totalFee: Integer rupees (INR) for sort/filter/EMI calc.
     - applicationFee: One-time fee often listed in brochures.
     - workExperienceMinYears: For exec MBAs; drive eligibility UI.
     - eligibility/curriculum: Long-form brochure text (rich content users read).
     - brochureUrl: Public URL (your R2/S3) to the brochure PDF.
     - heroImage/applyUrl: UI props for cards and CTA.
     - applicationDeadline: Optional; often blank; set when known.

   Constraint:
     uniqueProgramPerInstitution: Prevent duplicate titles under same institution.
============================================================================= */
export const programs = pgTable(
  "programs",
  {
    id: serial("id").primaryKey(),

    institutionId: integer("institution_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),

    degreeType: text("degree_type").notNull(), // "MBA" | "PGDM" | "Executive MBA" | etc.
    title: text("title").notNull(),

    durationMonths: integer("duration_months"),
    deliveryMode: deliveryModeEnum("delivery_mode"),

    totalFee: integer("total_fee"),
    applicationFee: integer("application_fee"),
    emiAvailable: boolean("emi_available").default(false),

    highlights: text("highlights"),
    outcomes: text("outcomes"),
    eligibility: text("eligibility"),
    curriculum: text("curriculum"),

    workExperienceMinYears: integer("work_experience_min_years"),

    isFeatured: boolean("is_featured").default(false),

    brochureUrl: text("brochure_url"),
    heroImage: text("hero_image"),
    applyUrl: text("apply_url"),
    applicationDeadline: date("application_deadline"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    degreeIdx: index("program_degree_idx").on(table.degreeType),
    feeIdx: index("program_fee_idx").on(table.totalFee),
    institutionIdx: index("program_institution_idx").on(table.institutionId),
    modeIdx: index("program_mode_idx").on(table.deliveryMode),
    uniqueProgramPerInstitution: uniqueIndex("program_inst_title_uq").on(
      table.institutionId,
      table.title
    ),
  })
);

/* =============================================================================
   PROGRAM SPECIALISATIONS  — e.g., Finance, Marketing, BA, Ops, HRM
   =============================================================================
   What:
     Optional narrow tracks within a program. Shown as badges and filter pills.

   Crucial columns:
     - name: "Finance", "Business Analytics", "Supply Chain", etc.
     - description: Optional blurb for detail page.
============================================================================= */
export const programSpecialisations = pgTable(
  "program_specialisations",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
  },
  (table) => ({
    programIdx: index("specialisations_program_idx").on(table.programId),
    uniqueSpecPerProgram: uniqueIndex("specialisations_program_name_uq").on(
      table.programId,
      table.name
    ),
  })
);

/* =============================================================================
   PROGRAM FEES  — Optional breakdown (semester/exam/admission)
   =============================================================================
   What:
     Some brochures split fee into multiple lines. Store them for calculators
     and visuals (e.g., "₹43,750 per semester", "Exam fee ₹5,000").

   Crucial columns:
     - label: Human label as printed in brochure ("Per semester", "Exam fee").
     - amount: Integer rupees for charts/math.
============================================================================= */
export const programFees = pgTable(
  "program_fees",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),

    label: text("label").notNull(),
    amount: integer("amount").notNull(),
  },
  (table) => ({
    programIdx: index("program_fees_program_idx").on(table.programId),
  })
);

/* =============================================================================
   PROGRAM FAQS  — Optional Q&A (many brochures include them)
   =============================================================================
   What:
     User-facing FAQs rendered on the program detail page.

   Crucial columns:
     - question: The FAQ prompt.
     - answerHtml: Store as HTML so we can keep bullets/links easily.
============================================================================= */
export const programFaqs = pgTable(
  "program_faqs",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answerHtml: text("answer_html").notNull(),
  },
  (table) => ({
    programIdx: index("program_faqs_program_idx").on(table.programId),
  })
);

/* =============================================================================
   ASSETS  — Brochures, logos, hero images (provenance + dedupe)
   =============================================================================
   What:
     Central registry of uploaded files you serve (Cloudflare R2/S3).

   Crucial columns:
     - type: 'brochure' | 'image' | 'logo' (free text kept simple).
     - url: Public or signed URL/key you serve from your CDN/bucket.
     - sha256: Optional hash for de-duplication/integrity.
============================================================================= */
export const assets = pgTable(
  "assets",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(), // 'brochure' | 'image' | 'logo' | etc.
    url: text("url").notNull(), // R2/S3 URL or key
    mime: text("mime"),
    sha256: text("sha256"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    typeIdx: index("assets_type_idx").on(table.type),
    urlUniqueIdx: uniqueIndex("assets_url_uq").on(table.url),
  })
);

/* =============================================================================
   PROGRAM ASSETS  — Link programs to their assets
   =============================================================================
   What:
     Join table to attach brochures/hero/gallery images per program.

   Crucial columns:
     - purpose: 'brochure' | 'hero' | 'gallery' (keeps UI wiring obvious).
     - uniquePurposePerProgram: Ensures you don’t repeat e.g. two "hero" assets.
============================================================================= */
export const programAssets = pgTable(
  "program_assets",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    assetId: integer("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    purpose: text("purpose"),
  },
  (table) => ({
    programIdx: index("program_assets_program_idx").on(table.programId),
    assetIdx: index("program_assets_asset_idx").on(table.assetId),
    uniquePurposePerProgram: uniqueIndex(
      "program_assets_program_purpose_uq"
    ).on(table.programId, table.purpose),
  })
);

/* =============================================================================
   LEADS  — The funnel
   =============================================================================
   What:
     Submissions from the multi-step form (profile → preferences → eligibility
     context → recommendations → contact). Keep it minimal but useful.

   Crucial columns:
     - lastScorePercent: Precision (5,2) supports 0–100.00 safely.
     - experienceYears: Precision (4,1) captures 0–99.9 years.
     - wantsEmi / budgetRange: Drive EMI estimator + counseling scripts.
     - consentedAt: DPDP-friendly audit trail of consent.
============================================================================= */
export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    gender: text("gender"),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    dob: date("dob"),
    state: text("state"),
    city: text("city"),
    employmentStatus: text("employment_status"),
    salaryBand: text("salary_band"),
    highestQualification: text("highest_qualification"),
    lastScorePercent: numeric("last_score_percent", { precision: 5, scale: 2 }),
    degreeInterest: text("degree_interest"),
    coursePreference: text("course_preference"),
    specialisationInterest: text("specialisation_interest"),
    goal: text("goal"),
    budgetRange: text("budget_range"),
    wantsEmi: boolean("wants_emi").default(false),
    category: text("category"),
    experienceYears: numeric("experience_years", { precision: 4, scale: 1 }),
    preferredMode: text("preferred_mode"),
    source: text("source"),
    utmCampaign: text("utm_campaign"),
    consentedAt: timestamp("consented_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    notes: text("notes"),
    status: text("status").default("new").notNull(),
  },
  (table) => ({
    emailIdx: index("leads_email_idx").on(table.email),
    phoneIdx: index("leads_phone_idx").on(table.phone),
    statusIdx: index("leads_status_idx").on(table.status),
  })
);

/* =============================================================================
   LEAD ↔ PROGRAM INTERESTS  — Bridge with optional fit score
   =============================================================================
   What:
     Connects a lead to one or more programs shortlisted by the recommender or
     counselor. Fit score is a simple integer you can compute (0–100).

   Constraint:
     uniqueLeadProgram: Prevent duplicate rows per (lead, program).
============================================================================= */
export const leadProgramInterests = pgTable(
  "lead_program_interests",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    programId: integer("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    fitScore: integer("fit_score"),
    notes: text("notes"),
  },
  (table) => ({
    leadIdx: index("lead_program_lead_idx").on(table.leadId),
    programIdx: index("lead_program_program_idx").on(table.programId),
    uniqueLeadProgram: uniqueIndex("lead_program_unique").on(
      table.leadId,
      table.programId
    ),
  })
);

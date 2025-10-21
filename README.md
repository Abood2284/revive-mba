# Revive MBA Platform

Revive is a conversion-focused online MBA discovery platform built with Next.js (App Router) and deployed to Cloudflare. The experience balances dense academic information with a reassuring visual system so prospective learners can compare programs and submit their profile for personalised recommendations in minutes.

## Product Vision
- Empower Indian working professionals and graduates to evaluate MBA/PGDM pathways, compare colleges, and request curated guidance without sales friction.
- Collect rich lead data through an engaging, value-driven form that promises AI-assisted counselling in under two minutes.
- Maintain a trustworthy, minimal interface tailored for information-heavy content and accessible on low-bandwidth devices.

## Core Experience
- **Program discovery:** Categorised course listings surfaced by degree level, learning mode, duration, fee band, and partner institution highlights.
- **Lead capture journey:** A multi-step, progress-aware form with contextual prompts and testimonials that motivates completion. Input validation, save-state, and optional incentives (scholarship checker, ROI calculator) keep users engaged.
- **Personalised follow-up:** Submitted leads sync to Neon via Drizzle ORM. Review workflows can trigger program suggestions, counsellor callbacks, or automated email drips.

## Brand & UI System
- **Color palette:**
  - `--color-primary`: hsl(270, 50%, 90%) – default background/light text surfaces.
  - `--color-secondary`: hsl(270, 50%, 10%) – primary text on light mode.
  - `--color-accent`: hsl(210, 80%, 20%) – CTAs, key metrics, interactive focus.
  - `--color-tertiary`: hsl(330, 80%, 20%) – highlights for badges, tab states.
  - `.dark` token set in `app/globals.css` flips contrast for dark mode.
- **Typography:** Nunito (via `lib/font.ts`) is the brand font. Define reusable tokens in `:root` (rem values shown below) and apply via utility classes/custom CSS:
  ```css
  :root {
    --font-family-base: var(--font-nunito, "Nunito", system-ui, sans-serif);
    --type-display: 700 2.5rem/1.2 var(--font-family-base);   /* hero headlines */
    --type-h1:      700 1.75rem/1.35 var(--font-family-base);
    --type-h2:      600 1.5rem/1.4 var(--font-family-base);
    --type-h3:      600 1.25rem/1.45 var(--font-family-base);
    --type-body-lg: 400 1.125rem/1.6 var(--font-family-base);
    --type-body-md: 400 1rem/1.65 var(--font-family-base);
    --type-body-sm: 500 0.875rem/1.5 var(--font-family-base);
    --type-label:   600 0.75rem/1.4 var(--font-family-base);
  }
  ```
- **Layout principles:**
  - Dense informational blocks with clear section headings, badges for accreditations, and accordions for eligibility details.
  - Responsive grids for course cards (2-col tablet, 3-col desktop). Ample white space around CTAs and form modules.
  - Iconography is minimal; emphasise text hierarchy and data viz (fee ranges, timelines) over decorative motion.

## Lead Form Blueprint
Structure the journey as 4 guided stages + contact confirmation to keep perceived effort low:
1. **Profile & Goals** – status (working/student), highest qualification, recent score, salary band, career goals (placements, promotion, hike).
2. **Course Preferences** – desired degree (MBA, PGDM, Executive MBA), preferred course, specialisation interests, budget/fee range, EMI preference.
3. **Eligibility Context** – category information (SC/ST/OBC, government employee, defence, Divyaang), experience years, study mode preference.
4. **Smart Recommendations** – show dynamic summary, highlight top-fit programs, invite scheduling a call.
5. **Contact Details** – full name, gender, email, mobile OTP, DOB, state, city, consent to contact.

Enhancements over competitors:
- Progress tracker with micro-copy (“Step 3 of 5 · 45s remaining”).
- Inline calculators (EMI estimator, ROI vs current salary) triggered by the budget step.
- Optional document upload (resume/marksheet) gated behind consent to improve lead quality.
- Smart defaults using query parameters (e.g., campaign-specific specialisation prefill).

## Information Architecture
- **Hero:** Value proposition, trust badges, AI counselling CTA.
- **Why Revive:** Outcomes (salary uplift, partner network stats), alumni testimonials.
- **Programs:** Filterable catalog, comparison table, accreditation info.
- **Guidance Tools:** Articles, FAQs, ROI calculator previews.
- **Form CTA:** Persistent floating button (“Get AI Suggestions in 2 Minutes”) opening the multi-step dialog.
- **Footer:** Compliance statements, contact channels, WhatsApp CTA, policy links.

## Data Model (Drizzle + Neon)
Planned schema in `db/schema.ts`:
```ts
// Institutions offering programs
export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  location: text("location"),
  accreditation: text("accreditation"),
  website: text("website"),
  heroImage: text("hero_image")
});

// Programs mapped to institutions
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").references(() => institutions.id, { onDelete: "cascade" }),
  degreeType: text("degree_type").notNull(),   // MBA, PGDM, Executive MBA, etc.
  title: text("title").notNull(),
  durationMonths: integer("duration_months"),
  deliveryMode: text("delivery_mode"),         // online, blended, weekend
  totalFee: integer("total_fee"),
  emiAvailable: boolean("emi_available").default(false),
  highlights: text("highlights"),
  outcomes: text("outcomes"),
  isFeatured: boolean("is_featured").default(false)
});

// Optional specialisations per program
export const programSpecialisations = pgTable("program_specialisations", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => programs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description")
});

// Lead submissions from the form
export const leads = pgTable("leads", {
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
  lastScorePercent: numeric("last_score_percent"),
  degreeInterest: text("degree_interest"),
  coursePreference: text("course_preference"),
  specialisationInterest: text("specialisation_interest"),
  goal: text("goal"),
  budgetRange: text("budget_range"),
  wantsEmi: boolean("wants_emi").default(false),
  category: text("category"),
  experienceYears: numeric("experience_years"),
  consentedAt: timestamp("consented_at").defaultNow(),
  source: text("source"),
  utmCampaign: text("utm_campaign")
});

// Bridge table to map lead interest to programs
export const leadProgramInterests = pgTable("lead_program_interests", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "cascade" }),
  programId: integer("program_id").references(() => programs.id, { onDelete: "cascade" }),
  fitScore: integer("fit_score")
});
```
Include indexes on frequent filters (degree type, fee band) and enable row level security as part of the Neon setup.

## Tech Stack
- Next.js 15 (App Router) with React 19, TypeScript strict mode.
- Tailwind CSS v4 with custom properties for theming; add typography/spacing tokens in `app/globals.css`.
- Drizzle ORM with PostgreSQL (Neon) and Cloudflare Pages/Workers deployment via `@opennextjs/cloudflare`.
- Authentication ready via `@auth/drizzle-adapter` for counsellor dashboards (future scope).
- Iconography: Lucide React; utility helpers via `clsx`, `tailwind-merge`.

## Development Workflow
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server (Turbopack)
   ```bash
   npm run dev
   ```
3. Lint before committing
   ```bash
   npm run lint
   ```
4. Build for production
   ```bash
   npm run build
   npm run start # serve locally
   ```
5. Cloudflare preview & deploy
   ```bash
   npm run preview
   npm run deploy
   ```
6. Update Cloudflare binding types whenever KV/Secrets change
   ```bash
 npm run cf-typegen
  ```

## Database Workflow
1. Generate migration files from the Drizzle schema
   ```bash
   npm run db:generate
   ```
2. Push migrations to the target Neon database
   ```bash
   npm run db:push
   ```
3. (Optional) Run pending migrations via migration history
   ```bash
   npm run db:migrate
   ```
4. Open Drizzle Studio to inspect tables locally
   ```bash
   npm run db:studio
   ```
5. Seed sample institutions and programs (requires `DATABASE_URL`)
   ```bash
   npm run db:seed
   ```

## Repository Structure
- `app/` – Next.js App Router tree (`layout.tsx`, route segments, global styles).
- `lib/font.ts` – Nunito font loader exported as CSS variable.
- `db/schema.ts` – Drizzle schema definitions powering migrations and seeds.
- `public/` – Static assets (logos, SEO metadata) delivered verbatim.
- `docs/` – Additional product and process documentation (strategy decks, content guides).

## Future Enhancements
- Configure analytics events (form start/completion, field drop-offs) via Cloudflare Workers.
- Integrate WhatsApp/Phone verification at final step using cloud function webhook.
- Launch counsellor dashboard to review leads, curate program bundles, and trigger follow-up sequences.
- Layer CMS integration (e.g., Contentful or Sanity) for managing program content at scale.
- Implement accessibility and i18n reviews to support regional language rollouts.

## Operational Notes
- Protect personal data under India’s DPDP Act: obtain consent, store minimal PII, and document retention policy.
- Maintain content accuracy with quarterly partner audits; highlight NAAC/NBA recognitions and updated fee structures.
- Provide PR collateral (screenshots, manual test notes) alongside each release.

Let’s iterate on the schema and UI in tandem, ensuring the README stays the single source of truth for business requirements as we grow the Revive platform.

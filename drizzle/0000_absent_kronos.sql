CREATE TABLE "institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"location" text,
	"accreditation" text,
	"website" text,
	"hero_image" text,
	"established_year" integer,
	"short_description" text,
	CONSTRAINT "institutions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lead_program_interests" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"program_id" integer NOT NULL,
	"fit_score" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"gender" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"dob" date,
	"state" text,
	"city" text,
	"employment_status" text,
	"salary_band" text,
	"highest_qualification" text,
	"last_score_percent" numeric(5, 2),
	"degree_interest" text,
	"course_preference" text,
	"specialisation_interest" text,
	"goal" text,
	"budget_range" text,
	"wants_emi" boolean DEFAULT false,
	"category" text,
	"experience_years" numeric(4, 1),
	"preferred_mode" text,
	"source" text,
	"utm_campaign" text,
	"consented_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "program_specialisations" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"institution_id" integer NOT NULL,
	"degree_type" text NOT NULL,
	"title" text NOT NULL,
	"duration_months" integer,
	"delivery_mode" text,
	"total_fee" integer,
	"emi_available" boolean DEFAULT false,
	"highlights" text,
	"outcomes" text,
	"is_featured" boolean DEFAULT false,
	"brochure_url" text,
	"application_deadline" date
);
--> statement-breakpoint
ALTER TABLE "lead_program_interests" ADD CONSTRAINT "lead_program_interests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_program_interests" ADD CONSTRAINT "lead_program_interests_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_specialisations" ADD CONSTRAINT "program_specialisations_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_program_lead_idx" ON "lead_program_interests" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_program_program_idx" ON "lead_program_interests" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "specialisations_program_idx" ON "program_specialisations" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_degree_idx" ON "programs" USING btree ("degree_type");--> statement-breakpoint
CREATE INDEX "program_fee_idx" ON "programs" USING btree ("total_fee");--> statement-breakpoint
CREATE INDEX "program_institution_idx" ON "programs" USING btree ("institution_id");
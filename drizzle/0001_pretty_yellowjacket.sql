CREATE TYPE "public"."admin_role" AS ENUM('superadmin', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."delivery_mode" AS ENUM('online', 'blended', 'weekend', 'on-campus');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"mime" text,
	"sha256" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	"purpose" text
);
--> statement-breakpoint
CREATE TABLE "program_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"question" text NOT NULL,
	"answer_html" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"label" text NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_slug_unique";--> statement-breakpoint
ALTER TABLE "programs" ALTER COLUMN "delivery_mode" SET DATA TYPE "public"."delivery_mode" USING "delivery_mode"::"public"."delivery_mode";--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "institutions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "application_fee" integer;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "eligibility" text;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "curriculum" text;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "work_experience_min_years" integer;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "hero_image" text;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "apply_url" text;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "program_assets" ADD CONSTRAINT "program_assets_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_assets" ADD CONSTRAINT "program_assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_faqs" ADD CONSTRAINT "program_faqs_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_fees" ADD CONSTRAINT "program_fees_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admins_email_uq" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admins_role_idx" ON "admins" USING btree ("role");--> statement-breakpoint
CREATE INDEX "assets_type_idx" ON "assets" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "assets_url_uq" ON "assets" USING btree ("url");--> statement-breakpoint
CREATE INDEX "program_assets_program_idx" ON "program_assets" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_assets_asset_idx" ON "program_assets" USING btree ("asset_id");--> statement-breakpoint
CREATE UNIQUE INDEX "program_assets_program_purpose_uq" ON "program_assets" USING btree ("program_id","purpose");--> statement-breakpoint
CREATE INDEX "program_faqs_program_idx" ON "program_faqs" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_fees_program_idx" ON "program_fees" USING btree ("program_id");--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_slug_uq" ON "institutions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "institutions_name_idx" ON "institutions" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_program_unique" ON "lead_program_interests" USING btree ("lead_id","program_id");--> statement-breakpoint
CREATE UNIQUE INDEX "specialisations_program_name_uq" ON "program_specialisations" USING btree ("program_id","name");--> statement-breakpoint
CREATE INDEX "program_mode_idx" ON "programs" USING btree ("delivery_mode");--> statement-breakpoint
CREATE UNIQUE INDEX "program_inst_title_uq" ON "programs" USING btree ("institution_id","title");
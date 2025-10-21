ALTER TABLE "leads" ADD COLUMN "status" text DEFAULT 'new' NOT NULL;--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
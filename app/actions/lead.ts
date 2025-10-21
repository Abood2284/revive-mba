"use server";

import { db } from "@/db";
import { leads, leadProgramInterests } from "@/db/schema";
import { completeLeadSchema } from "@/lib/validations/lead";
import { revalidatePath } from "next/cache";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitLead(
  formData: FormData
): Promise<ActionResponse<{ leadId: number }>> {
  try {
    // Extract and parse form data
    const rawData = {
      fullName: formData.get("fullName"),
      gender: formData.get("gender") || undefined,
      email: formData.get("email"),
      phone: formData.get("phone"),
      dob: formData.get("dob") || undefined,
      state: formData.get("state"),
      city: formData.get("city"),
      employmentStatus: formData.get("employmentStatus"),
      salaryBand: formData.get("salaryBand") || undefined,
      highestQualification: formData.get("highestQualification"),
      lastScorePercent: formData.get("lastScorePercent") || undefined,
      degreeInterest: formData.get("degreeInterest"),
      coursePreference: formData.get("coursePreference") || undefined,
      specialisationInterest:
        formData.get("specialisationInterest") || undefined,
      goal: formData.get("goal"),
      budgetRange: formData.get("budgetRange"),
      wantsEmi: formData.get("wantsEmi") === "true",
      category: formData.get("category") || undefined,
      experienceYears: formData.get("experienceYears") || undefined,
      preferredMode: formData.get("preferredMode"),
      source: formData.get("source") || undefined,
      utmCampaign: formData.get("utmCampaign") || undefined,
    };

    // Validate
    const result = completeLeadSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    const validatedData = result.data;

    // Insert lead into database
    const [lead] = await db
      .insert(leads)
      .values({
        fullName: validatedData.fullName,
        gender: validatedData.gender || null,
        email: validatedData.email,
        phone: validatedData.phone,
        dob: validatedData.dob || null,
        state: validatedData.state,
        city: validatedData.city,
        employmentStatus: validatedData.employmentStatus,
        salaryBand: validatedData.salaryBand || null,
        highestQualification: validatedData.highestQualification,
        lastScorePercent: validatedData.lastScorePercent?.toString() || null,
        degreeInterest: validatedData.degreeInterest,
        coursePreference: validatedData.coursePreference || null,
        specialisationInterest: validatedData.specialisationInterest || null,
        goal: validatedData.goal,
        budgetRange: validatedData.budgetRange,
        wantsEmi: validatedData.wantsEmi,
        category: validatedData.category || null,
        experienceYears: validatedData.experienceYears?.toString() || null,
        preferredMode: validatedData.preferredMode,
        source: validatedData.source || null,
        utmCampaign: validatedData.utmCampaign || null,
        consentedAt: new Date(),
      })
      .returning({ id: leads.id });

    if (!lead) {
      return {
        success: false,
        error: "Failed to create lead",
      };
    }

    // Optionally link to interested programs (future enhancement)
    // For now, we just return the lead ID

    revalidatePath("/");

    return {
      success: true,
      data: { leadId: lead.id },
    };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function linkLeadToPrograms(
  leadId: number,
  programIds: number[]
): Promise<ActionResponse> {
  try {
    if (programIds.length === 0) {
      return { success: true };
    }

    const values = programIds.map((programId) => ({
      leadId,
      programId,
      fitScore: null,
      notes: null,
    }));

    await db.insert(leadProgramInterests).values(values);

    return { success: true };
  } catch (error) {
    console.error("Error linking lead to programs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to link programs",
    };
  }
}

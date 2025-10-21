"use server";

import { db } from "@/db";
import { programs } from "@/db/schema";
import { eq } from "drizzle-orm";

interface UpdateProgramFormData {
  title: string;
  degreeType: string;
  deliveryMode?: string;
  totalFee?: string;
  isFeatured?: boolean;
}

export async function updateProgram(
  programId: number,
  formData: UpdateProgramFormData
) {
  try {
    const deliveryModes = [
      "online",
      "blended",
      "weekend",
      "on-campus",
    ] as const;
    function isDeliveryMode(
      value: string | undefined
    ): value is (typeof deliveryModes)[number] {
      if (!value) return false;
      return (deliveryModes as readonly string[]).includes(value);
    }

    const updateData: Partial<typeof programs.$inferInsert> = {
      title: formData.title,
      degreeType: formData.degreeType,
      deliveryMode: isDeliveryMode(formData.deliveryMode)
        ? formData.deliveryMode
        : null,
      totalFee: formData.totalFee ? parseInt(formData.totalFee) : null,
      isFeatured: formData.isFeatured,
      updatedAt: new Date(),
    };

    await db.update(programs).set(updateData).where(eq(programs.id, programId));

    return { success: true };
  } catch (error) {
    console.error("Failed to update program:", error);
    throw new Error("Failed to update program");
  }
}

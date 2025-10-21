"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Find admin by email
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new Error("Account is disabled");
    }

    // Compare plain text password
    if (admin.password !== password) {
      throw new Error("Invalid credentials");
    }

    // Create session
    const session = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect("/admin");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}

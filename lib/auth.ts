import { cookies } from "next/headers";

export interface AdminSession {
  id: number;
  email: string;
  name: string | null;
  role: "superadmin" | "editor" | "viewer";
}

/**
 * Get the current admin session from cookies
 * In production, this should verify a JWT or session token
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    return null;
  }

  try {
    // In production, verify JWT and decode session data
    // For now, this is a placeholder
    const session = JSON.parse(sessionCookie.value) as AdminSession;
    return session;
  } catch {
    return null;
  }
}

/**
 * Check if the current session has required role
 */
export async function requireAdmin(
  allowedRoles: Array<"superadmin" | "editor" | "viewer"> = [
    "superadmin",
    "editor",
    "viewer",
  ]
): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized: No active session");
  }

  if (!allowedRoles.includes(session.role)) {
    throw new Error(`Forbidden: Role ${session.role} not allowed`);
  }

  return session;
}

/**
 * Check if user can perform write operations
 */
export async function canWrite(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.role === "superadmin" || session?.role === "editor";
}

/**
 * Check if user is superadmin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.role === "superadmin";
}

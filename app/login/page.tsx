import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { loginAdmin } from "@/app/actions/auth";

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface-base)]">
      <div className="w-full max-w-md">
        <div className="surface-card p-8">
          <h1 className="text-2xl font-bold text-[color:var(--color-secondary)]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
            Sign in to access the Revive admin dashboard
          </p>

          <form action={loginAdmin} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[color:var(--color-secondary)]"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@revive.mba"
                required
                className="mt-2 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[color:var(--color-secondary)]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                className="mt-2 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline focus:outline-2 focus:outline-[var(--color-ring)]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

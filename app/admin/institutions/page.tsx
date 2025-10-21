"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

interface InstitutionRow {
  id: number;
  name: string;
  slug: string;
  location: string | null;
  accreditation: string | null;
  website: string | null;
  heroImage: string | null;
  logoUrl: string | null;
  establishedYear: number | null;
  shortDescription: string | null;
}

export default function AdminInstitutionsPage() {
  const searchParams = useSearchParams();
  const [institutions, setInstitutions] = useState<InstitutionRow[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    location: "",
    accreditation: "",
    website: "",
    heroImage: "",
    logoUrl: "",
    establishedYear: "",
    shortDescription: "",
  });

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const res = await fetch("/api/admin/institutions");
        const { data } = (await res.json()) as { data: InstitutionRow[] };
        setInstitutions(data);
      } catch (e) {
        console.error("Failed to fetch institutions", e);
      }
    }
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") setIsCreateOpen(true);
  }, [searchParams]);

  const cards = useMemo(() => institutions, [institutions]);

  return (
    <section className="bg-[var(--surface-base)] py-12">
      <div className="section-container">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--color-secondary)]">
              Institutions
            </h1>
            <p className="mt-2 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
              Manage partner universities and schools
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add institution
          </button>
        </div>

        <div className="mt-8">
          {cards.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((institution) => (
                <Link
                  key={institution.id}
                  href={`/admin/institutions/${institution.id}`}
                  className="surface-card p-6 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                    {institution.name}
                  </h3>
                  <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    {institution.location || "Location not specified"}
                  </p>
                  {institution.accreditation && (
                    <p className="mt-2 text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                      {institution.accreditation}
                    </p>
                  )}
                  {institution.establishedYear && (
                    <p className="mt-3 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                      Est. {institution.establishedYear}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="surface-card p-12 text-center">
              <p className="text-lg font-semibold text-[color:var(--color-secondary)]">
                No institutions yet
              </p>
              <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                Add your first institution to get started
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
              >
                Add institution
              </button>
            </div>
          )}
        </div>

        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]">
              <div className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] p-6">
                <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
                  Add Institution
                </h2>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
                >
                  Close
                </button>
              </div>
              <form
                className="p-6 space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  if (!form.name || !form.slug) {
                    setError("Name and Slug are required");
                    return;
                  }
                  setIsSubmitting(true);
                  try {
                    const payload = {
                      name: form.name,
                      slug: form.slug,
                      location: form.location || null,
                      accreditation: form.accreditation || null,
                      website: form.website || null,
                      heroImage: form.heroImage || null,
                      logoUrl: form.logoUrl || null,
                      establishedYear: form.establishedYear
                        ? parseInt(form.establishedYear, 10)
                        : null,
                      shortDescription: form.shortDescription || null,
                    };
                    const res = await fetch("/api/admin/institutions", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    if (!res.ok) {
                      const body = await res.json().catch(() => ({}));
                      setError(
                        (body as { message?: string }).message ||
                          "Failed to create institution"
                      );
                      setIsSubmitting(false);
                      return;
                    }
                    const list = await fetch("/api/admin/institutions");
                    const { data } = (await list.json()) as {
                      data: InstitutionRow[];
                    };
                    setInstitutions(data);
                    setIsCreateOpen(false);
                  } catch (err) {
                    setError("Failed to create institution");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {error && (
                  <div className="rounded-md border border-[color:color-mix(in_srgb,crimson_45%,transparent)] bg-[color:color-mix(in_srgb,crimson_10%,transparent)] p-3 text-sm text-[color:color-mix(in_srgb,crimson_70%,white_30%)]">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Accreditation
                    </label>
                    <input
                      type="text"
                      value={form.accreditation}
                      onChange={(e) =>
                        setForm({ ...form, accreditation: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) =>
                        setForm({ ...form, website: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Hero Image
                    </label>
                    <input
                      type="text"
                      value={form.heroImage}
                      onChange={(e) =>
                        setForm({ ...form, heroImage: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={form.logoUrl}
                      onChange={(e) =>
                        setForm({ ...form, logoUrl: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Established Year
                    </label>
                    <input
                      type="number"
                      value={form.establishedYear}
                      onChange={(e) =>
                        setForm({ ...form, establishedYear: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm({ ...form, shortDescription: e.target.value })
                      }
                      className="min-h-20 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-6 py-2.5 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-[color:var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isSubmitting ? "Creating..." : "Create Institution"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

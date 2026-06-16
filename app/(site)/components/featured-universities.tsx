// components/sections/featured-universities.tsx
"use client";
import * as React from "react";

type UniversityProgram = {
  id: string;
  title: string;
};

export interface University {
  id: string;
  name: string;
  logoUrl?: string;
  href?: string;
  programs?: UniversityProgram[];
}

// API types
interface ApiInstitution {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  programs: ApiProgram[];
}

interface ApiProgram {
  id: string;
  title: string;
}

function transformApiInstitutionToUniversity(
  apiInstitution: ApiInstitution
): University {
  return {
    id: apiInstitution.id,
    name: apiInstitution.name,
    logoUrl: apiInstitution.logoUrl,
    href: `/universities/${apiInstitution.slug}`,
    programs: apiInstitution.programs?.map((p) => ({
      id: p.id,
      title: p.title,
    })),
  };
}

export function FeaturedUniversitiesSection({
  universities: propUniversities,
  title = "Explore over 100 online universities & Compare on 30+ factors",
}: {
  universities?: University[];
  title?: string;
}) {
  const [universities, setUniversities] = React.useState<University[]>(
    propUniversities || []
  );
  const [isLoading, setIsLoading] = React.useState(!propUniversities);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (propUniversities) return;

    const fetchUniversities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/institutions?limit=24");
        if (!response.ok) throw new Error("Failed to fetch universities");
        const data = (await response.json()) as {
          institutions: ApiInstitution[];
        };
        const transformed = data.institutions.map(
          transformApiInstitutionToUniversity
        );
        setUniversities(transformed);
      } catch (err) {
        console.error("Error fetching universities:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch universities"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [propUniversities]);

  if (isLoading)
    return (
      <section className="w-full bg-[var(--surface-base)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <h2 className="text-center text-3xl font-semibold text-[color:var(--color-secondary)] md:text-4xl">
            {title}
          </h2>
          <div className="mt-10 flex items-center justify-center py-12">
            <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-accent)] border-t-transparent" />
          </div>
        </div>
      </section>
    );

  if (error)
    return (
      <section className="w-full bg-[var(--surface-base)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <h2 className="text-center text-3xl font-semibold text-[color:var(--color-secondary)] md:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-center text-sm text-red-600">{error}</p>
        </div>
      </section>
    );

  return (
    <section className="w-full bg-[var(--surface-base)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <h2 className="text-center text-3xl font-semibold leading-tight text-[color:var(--color-secondary)] md:text-4xl">
          {title}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="group relative flex flex-col items-center justify-between rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] bg-white p-4 text-center shadow-sm transition hover:border-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)] hover:shadow-md"
            >
              {typeof uni.programs?.length === "number" &&
                uni.programs.length > 0 && (
                  <span className="absolute right-2 top-1 inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,#22c55e_16%,white_84%)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#16a34a] shadow-sm">
                    {uni.programs.length} Programs
                  </span>
                )}
              <LogoMark name={uni.name} logoUrl={uni.logoUrl} />
              <p className="mt-0.5 line-clamp-2 text-[12px] font-medium text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                {uni.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/universities"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-accent-foreground)] transition hover:opacity-90"
          >
            Explore all universities
          </a>
        </div>
      </div>
    </section>
  );
}

function LogoMark({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl)
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="h-12 w-28 rounded-md bg-white p-2 object-contain"
      />
    );

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      aria-label={`${name} logo`}
      className="flex h-12 w-28 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#5a6072]"
    >
      {initials}
    </div>
  );
}

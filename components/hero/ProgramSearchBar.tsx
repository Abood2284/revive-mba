"use client";

import { useMemo, useState } from "react";

export interface ProgramSearchBarProps {
  onSubmit: (q: string) => void;
}

export function ProgramSearchBar({ onSubmit }: ProgramSearchBarProps) {
  const [query, setQuery] = useState("");
  const suggestions = useMemo(
    () => [
      "MBA in Business Analytics",
      "Executive MBA for working professionals",
      "Online MBA under ₹3L",
      "PGDM in Marketing",
      "MBA in Finance & FinTech",
    ],
    []
  );

  return (
    <div className="surface-card p-2">
      <div className="flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] px-4 py-2">
        <span aria-hidden>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit(query);
          }}
          placeholder="Search specialisations, mode, fee range..."
          aria-label="Search programs"
          className="flex-1 bg-transparent outline-none placeholder:text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]"
        />
        <button
          type="button"
          onClick={() => onSubmit(query)}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)]"
        >
          Match me →
        </button>
      </div>
      {query.length === 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="pill"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgramSearchBar;

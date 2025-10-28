// app/(site)/components/add-program-dialog.tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Search } from "lucide-react";
import {
  buildCompareUrl,
  addProgramToComparison,
  getComparisonIdsFromStorage,
  saveComparisonIdsToStorage,
} from "@/lib/comparison-state";

interface AddProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProgramIds: number[];
}

type Program = {
  id: string;
  title: string;
  university: string;
  specialization: string;
  mode: "online" | "blended" | "distance";
  durationMonths: number;
  totalFeeINR: number;
  nextIntake?: string;
  badges?: string[];
};

export function AddProgramDialog({
  open,
  onOpenChange,
  currentProgramIds,
}: AddProgramDialogProps) {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [spec, setSpec] = React.useState("");

  const fetchPrograms = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/programs", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load programs: ${response.statusText}`);
      }
      const body = await response.json();
      const allPrograms = (body as { programs: Program[] }).programs;
      setPrograms(allPrograms);
    } catch (err) {
      console.error("Failed to load programs", err);
      setError("We couldn't load programs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchPrograms();
    }
  }, [open, fetchPrograms]);

  const filteredPrograms = React.useMemo(() => {
    const [dMin, dMax] = parseRange(duration);
    return programs
      .filter((p) => {
        // Exclude already selected programs
        if (currentProgramIds.includes(parseInt(p.id, 10))) return false;

        const durOk =
          !duration || (p.durationMonths >= dMin && p.durationMonths <= dMax);
        const specOk = !spec || p.specialization === spec;
        const queryOk =
          !search ||
          (p.title + " " + p.university + " " + p.specialization)
            .toLowerCase()
            .includes(search.toLowerCase());
        return durOk && specOk && queryOk;
      })
      .slice(0, 20); // Limit to 20 results for performance
  }, [programs, duration, spec, search, currentProgramIds]);

  const handleAddProgram = (programId: string) => {
    const currentIds = getComparisonIdsFromStorage();
    const newIds = addProgramToComparison(currentIds, parseInt(programId, 10));
    saveComparisonIdsToStorage(newIds);

    // Close dialog first
    onOpenChange(false);

    // Navigate to updated comparison
    window.location.href = buildCompareUrl(newIds);
  };

  const formatINR = (n: number) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      n
    );
  };

  const labelForSpec = (slug: string) => {
    const map: Record<string, string> = {
      general: "General",
      finance: "Finance",
      marketing: "Marketing",
      "business-analytics": "Business Analytics",
      hr: "Human Resources",
      operations: "Operations",
      it: "IT & Systems",
      healthcare: "Healthcare",
    };
    return map[slug] || slug;
  };

  const capital = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed inset-0 z-50 w-full h-[100svh] overflow-hidden bg-white md:left-1/2 md:top-1/2 md:h-auto md:w-full md:max-w-4xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:shadow-xl">
          <div className="flex h-full flex-col md:max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#d9dce6] p-6 sticky top-0 z-10 bg-white">
              <div>
                <Dialog.Title className="text-xl font-semibold text-[#10131a]">
                  Add Program to Comparison
                </Dialog.Title>
                <p className="mt-1 text-sm text-[#5a6072]">
                  Select a program to compare with your current selection
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9dce6] hover:bg-[#f5f6fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Filters */}
            <div className="border-b border-[#d9dce6] p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#514EA1] mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9197ad]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Try NMIMS, Finance, Analytics…"
                      className="w-full rounded-lg border border-[#d9dce6] bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#514EA1]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 md:contents">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#514EA1] mb-2">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-lg border border-[#d9dce6] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#514EA1]"
                    >
                      <option value="">Any</option>
                      <option value="12-18">12–18 months</option>
                      <option value="18-24">18–24 months</option>
                      <option value="24-30">24–30 months</option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#514EA1] mb-2">
                      Specialisation
                    </label>
                    <select
                      value={spec}
                      onChange={(e) => setSpec(e.target.value)}
                      className="w-full rounded-lg border border-[#d9dce6] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#514EA1]"
                    >
                      <option value="">Any</option>
                      <option value="general">General</option>
                      <option value="finance">Finance</option>
                      <option value="marketing">Marketing</option>
                      <option value="business-analytics">
                        Business Analytics
                      </option>
                      <option value="hr">Human Resources</option>
                      <option value="operations">Operations</option>
                      <option value="it">IT & Systems</option>
                      <option value="healthcare">Healthcare</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D38B8]"></div>
                  <span className="ml-3 text-[#5a6072]">
                    Loading programs...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-[#ED1C24] mb-4">{error}</p>
                  <button
                    onClick={fetchPrograms}
                    className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#5a6072] mb-4">
                    No programs match your filters. Try adjusting your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setDuration("");
                      setSpec("");
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-[#d9dce6] px-4 py-2 text-sm font-semibold text-[#3D38B8] transition hover:border-[#514EA1] hover:text-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[#5a6072]">
                    {filteredPrograms.length} program
                    {filteredPrograms.length !== 1 ? "s" : ""} found
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredPrograms.map((program) => (
                      <div
                        key={program.id}
                        className="group rounded-2xl border border-[#d9dce6] bg-white p-4 shadow-sm transition hover:border-[#3D38B8] hover:shadow-md"
                      >
                        <div className="mb-3 flex flex-wrap gap-2">
                          {program.badges
                            ?.filter((b) =>
                              !b || !b.toLowerCase().includes("ugc") ? b : null
                            )
                            .map((badge) => (
                              <span
                                key={badge}
                                className="rounded-full border border-[#d9dce6] bg-[#f5f6fa] px-2 py-1 text-[10px] uppercase tracking-wide text-[#3D38B8]"
                              >
                                {badge}
                              </span>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold leading-snug text-[#10131a] mb-2">
                          {program.title}
                        </h3>
                        <p className="text-sm text-[#5a6072] mb-3">
                          {program.university}
                        </p>

                        <button
                          onClick={() => handleAddProgram(program.id)}
                          className="w-full rounded-full bg-[#3D38B8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8]"
                        >
                          Add to Comparison
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function parseRange(dur: string | null | string): [number, number] {
  if (!dur) return [0, 10_000];
  const [a, b] = String(dur)
    .split("-")
    .map((x) => parseInt(x, 10));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return [0, 10_000];
  return [a, b];
}

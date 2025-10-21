"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Edit, X, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
// client page uses API routes; no server actions here

interface Program {
  id: number;
  title: string;
  degreeType: string;
  deliveryMode: string | null;
  totalFee: number | null;
  isFeatured: boolean;
  institution: {
    name: string | null;
  };
}

interface EditDialogProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
}

interface EditFormData {
  title: string;
  degreeType: string;
  deliveryMode: string;
  totalFee: string;
  isFeatured: boolean;
}

function EditDialog({ program, isOpen, onClose, onSave }: EditDialogProps) {
  const [formData, setFormData] = useState<EditFormData>({
    title: "",
    degreeType: "",
    deliveryMode: "",
    totalFee: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title,
        degreeType: program.degreeType,
        deliveryMode: program.deliveryMode || "",
        totalFee: program.totalFee?.toString() || "",
        isFeatured: program.isFeatured,
      });
    }
  }, [program]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface-subtle)] rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)]">
        <div className="flex items-center justify-between p-6 border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)]">
          <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
            Edit Program
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
              Program Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
              Degree Type
            </label>
            <input
              type="text"
              value={formData.degreeType}
              onChange={(e) =>
                setFormData({ ...formData, degreeType: e.target.value })
              }
              className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
              Delivery Mode
            </label>
            <select
              value={formData.deliveryMode}
              onChange={(e) =>
                setFormData({ ...formData, deliveryMode: e.target.value })
              }
              className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
            >
              <option value="">Select mode</option>
              <option value="online">Online</option>
              <option value="blended">Blended</option>
              <option value="weekend">Weekend</option>
              <option value="on-campus">On-campus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
              Total Fee (₹)
            </label>
            <input
              type="number"
              value={formData.totalFee}
              onChange={(e) =>
                setFormData({ ...formData, totalFee: e.target.value })
              }
              className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
              placeholder="Enter fee in rupees"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="h-4 w-4 rounded border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)]"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-semibold text-[color:var(--color-secondary)]"
            >
              Featured Program
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-6 py-3 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProgramsPage() {
  const searchParams = useSearchParams();
  const [programList, setProgramList] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [createForm, setCreateForm] = useState({
    institutionId: "",
    degreeType: "",
    title: "",
    durationMonths: "",
    deliveryMode: "",
    totalFee: "",
    applicationFee: "",
    emiAvailable: false,
    isFeatured: false,
    brochureUrl: "",
    heroImage: "",
    applyUrl: "",
    applicationDeadline: "",
    highlights: "",
    outcomes: "",
    eligibility: "",
    curriculum: "",
    workExperienceMinYears: "",
  });

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await fetch("/api/admin/programs");
        const { data } = (await response.json()) as { data: Program[] };
        setProgramList(data);
        setFilteredPrograms(data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
    }
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") setIsCreateOpen(true);
  }, [searchParams]);

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/admin/institutions");
        const { data } = (await response.json()) as {
          data: Array<{ id: number; name: string }>;
        };
        setInstitutions(data);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      }
    }
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPrograms(programList);
    } else {
      const filtered = programList.filter(
        (program) =>
          program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.degreeType
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          program.institution?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  }, [searchQuery, programList]);

  function handleEdit(program: Program) {
    setEditingProgram(program);
    setIsEditDialogOpen(true);
  }

  function handleCloseEdit() {
    setIsEditDialogOpen(false);
    setEditingProgram(null);
  }

  async function handleSave(formData: EditFormData) {
    if (!editingProgram) return;

    try {
      const payload = {
        title: formData.title,
        degreeType: formData.degreeType,
        deliveryMode: formData.deliveryMode || null,
        totalFee: formData.totalFee ? parseInt(formData.totalFee) : null,
        isFeatured: !!formData.isFeatured,
      };

      const res = await fetch(`/api/admin/programs/${editingProgram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");

      // Refresh the list
      const response = await fetch("/api/admin/programs");
      const { data } = (await response.json()) as { data: Program[] };
      setProgramList(data);
      setFilteredPrograms(data);
      handleCloseEdit();
    } catch (error) {
      console.error("Failed to update program:", error);
    }
  }

  return (
    <section className="bg-[var(--surface-base)] py-4">
      <div className="section-container">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--color-secondary)]">
              Programs
            </h1>
            <p className="mt-2 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
              Manage MBA and PGDM programs in your catalog
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add program
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]" />
            <input
              type="text"
              placeholder="Search programs, institutions, or degree types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] pl-10 pr-4 py-3 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
            />
          </div>
        </div>

        <div className="mt-8">
          {filteredPrograms.length > 0 ? (
            <div className="surface-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Program
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Institution
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((program) => (
                    <tr
                      key={program.id}
                      className="border-b border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] transition hover:bg-[color:color-mix(in_srgb,var(--surface-subtle)_50%,transparent)]"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/programs/${program.id}`}
                          className="font-semibold text-[color:var(--color-secondary)] hover:text-[color:var(--color-accent)]"
                        >
                          {program.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                        {program.institution?.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                        {program.degreeType}
                      </td>
                      <td className="px-6 py-4 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                        {program.deliveryMode || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                        {program.totalFee
                          ? `₹${(program.totalFee / 100000).toFixed(2)}L`
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {program.isFeatured && (
                          <span className="pill text-xs">Featured</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(program)}
                          className="inline-flex items-center gap-2 rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] px-3 py-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)] hover:bg-[color:color-mix(in_srgb,var(--surface-subtle)_88%,white_12%)]"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="surface-card p-12 text-center">
              <p className="text-lg font-semibold text-[color:var(--color-secondary)]">
                {searchQuery ? "No programs found" : "No programs yet"}
              </p>
              <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Add your first program to get started"}
              </p>
              {!searchQuery && (
                <Link
                  href="/admin/programs/new"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
                >
                  Add program
                </Link>
              )}
            </div>
          )}
        </div>

        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]">
              <div className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] p-6">
                <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
                  Add Program
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
                  setCreateError(null);
                  if (
                    !createForm.institutionId ||
                    !createForm.title ||
                    !createForm.degreeType
                  ) {
                    setCreateError(
                      "Institution, Title and Degree Type are required"
                    );
                    return;
                  }
                  setIsSubmittingCreate(true);
                  try {
                    const payload = {
                      institutionId: parseInt(createForm.institutionId, 10),
                      degreeType: createForm.degreeType,
                      title: createForm.title,
                      durationMonths: createForm.durationMonths
                        ? parseInt(createForm.durationMonths, 10)
                        : null,
                      deliveryMode: createForm.deliveryMode || null,
                      totalFee: createForm.totalFee
                        ? parseInt(createForm.totalFee, 10)
                        : null,
                      applicationFee: createForm.applicationFee
                        ? parseInt(createForm.applicationFee, 10)
                        : null,
                      emiAvailable: !!createForm.emiAvailable,
                      isFeatured: !!createForm.isFeatured,
                      brochureUrl: createForm.brochureUrl || null,
                      heroImage: createForm.heroImage || null,
                      applyUrl: createForm.applyUrl || null,
                      applicationDeadline:
                        createForm.applicationDeadline || null,
                      highlights: createForm.highlights || null,
                      outcomes: createForm.outcomes || null,
                      eligibility: createForm.eligibility || null,
                      curriculum: createForm.curriculum || null,
                      workExperienceMinYears: createForm.workExperienceMinYears
                        ? parseInt(createForm.workExperienceMinYears, 10)
                        : null,
                    };

                    const res = await fetch("/api/admin/programs", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    if (!res.ok) {
                      const body = await res.json().catch(() => ({}));
                      setCreateError(
                        (body as { message?: string }).message ||
                          "Failed to create program"
                      );
                      setIsSubmittingCreate(false);
                      return;
                    }

                    // refresh list
                    const response = await fetch("/api/admin/programs");
                    const { data } = (await response.json()) as {
                      data: Program[];
                    };
                    setProgramList(data);
                    setFilteredPrograms(data);
                    setIsCreateOpen(false);
                  } catch (err) {
                    setCreateError("Failed to create program");
                  } finally {
                    setIsSubmittingCreate(false);
                  }
                }}
              >
                {createError && (
                  <div className="rounded-md border border-[color:color-mix(in_srgb,crimson_45%,transparent)] bg-[color:color-mix(in_srgb,crimson_10%,transparent)] p-3 text-sm text-[color:color-mix(in_srgb,crimson_70%,white_30%)]">
                    {createError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Institution
                    </label>
                    <select
                      value={createForm.institutionId}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          institutionId: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      required
                    >
                      <option value="">Select institution</option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.id.toString()}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Degree Type
                    </label>
                    <input
                      type="text"
                      value={createForm.degreeType}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          degreeType: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={createForm.title}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      value={createForm.durationMonths}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          durationMonths: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Delivery Mode
                    </label>
                    <select
                      value={createForm.deliveryMode}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          deliveryMode: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    >
                      <option value="">Select mode</option>
                      <option value="online">Online</option>
                      <option value="blended">Blended</option>
                      <option value="weekend">Weekend</option>
                      <option value="on-campus">On-campus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Total Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={createForm.totalFee}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          totalFee: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Application Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={createForm.applicationFee}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          applicationFee: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                      <input
                        type="checkbox"
                        checked={createForm.emiAvailable}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            emiAvailable: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)]"
                      />
                      EMI Available
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-secondary)]">
                      <input
                        type="checkbox"
                        checked={createForm.isFeatured}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)]"
                      />
                      Featured
                    </label>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                        Brochure URL
                      </label>
                      <input
                        type="text"
                        value={createForm.brochureUrl}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            brochureUrl: e.target.value,
                          })
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
                        value={createForm.heroImage}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            heroImage: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                        Apply URL
                      </label>
                      <input
                        type="text"
                        value={createForm.applyUrl}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            applyUrl: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={createForm.applicationDeadline}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            applicationDeadline: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Highlights
                    </label>
                    <textarea
                      value={createForm.highlights}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          highlights: e.target.value,
                        })
                      }
                      className="min-h-20 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Outcomes
                    </label>
                    <textarea
                      value={createForm.outcomes}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          outcomes: e.target.value,
                        })
                      }
                      className="min-h-20 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Eligibility
                    </label>
                    <textarea
                      value={createForm.eligibility}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          eligibility: e.target.value,
                        })
                      }
                      className="min-h-20 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Curriculum
                    </label>
                    <textarea
                      value={createForm.curriculum}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          curriculum: e.target.value,
                        })
                      }
                      className="min-h-20 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[color:var(--color-secondary)] mb-2">
                      Min Work Exp (years)
                    </label>
                    <input
                      type="number"
                      value={createForm.workExperienceMinYears}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          workExperienceMinYears: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
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
                    disabled={isSubmittingCreate}
                    className="rounded-lg bg-[color:var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isSubmittingCreate ? "Creating..." : "Create Program"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <EditDialog
          program={editingProgram}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEdit}
          onSave={handleSave}
        />
      </div>
    </section>
  );
}

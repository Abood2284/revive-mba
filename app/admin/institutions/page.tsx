"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FileUpload } from "@/components/ui/file-upload";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Image as ImageIcon, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

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

interface InstitutionFormState {
  name: string;
  slug: string;
  location: string;
  accreditation: string;
  website: string;
  heroImage: string;
  logoUrl: string;
  establishedYear: string;
  shortDescription: string;
}

type ImageField = "heroImage" | "logoUrl";

const INITIAL_FORM_STATE: InstitutionFormState = {
  name: "",
  slug: "",
  location: "",
  accreditation: "",
  website: "",
  heroImage: "",
  logoUrl: "",
  establishedYear: "",
  shortDescription: "",
};

const UPLOAD_FOLDERS: Record<ImageField, string> = {
  heroImage: "uni_hero",
  logoUrl: "uni_logo",
};

function buildPayload(form: InstitutionFormState) {
  const payload: Record<string, string | number | null> = {
    name: form.name.trim(),
    slug: form.slug.trim(),
    location: form.location.trim() || null,
    accreditation: form.accreditation.trim() || null,
    website: form.website.trim() || null,
    heroImage: form.heroImage.trim() || null,
    logoUrl: form.logoUrl.trim() || null,
    shortDescription: form.shortDescription.trim() || null,
  };

  const year = form.establishedYear.trim();
  if (year) {
    const numericYear = Number(year);
    payload.establishedYear = Number.isNaN(numericYear) ? null : numericYear;
  } else {
    payload.establishedYear = null;
  }

  return payload;
}

async function uploadToCloudinary(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    url?: string;
    message?: string;
  };

  if (!response.ok || !data.url) {
    throw new Error(data.message || "Failed to upload file");
  }

  return data.url;
}

export default function AdminInstitutionsPage() {
  const searchParams = useSearchParams();
  const [institutions, setInstitutions] = useState<InstitutionRow[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] =
    useState<InstitutionFormState>(INITIAL_FORM_STATE);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createUploading, setCreateUploading] = useState({
    heroImage: false,
    logoUrl: false,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] =
    useState<InstitutionRow | null>(null);
  const [editForm, setEditForm] =
    useState<InstitutionFormState>(INITIAL_FORM_STATE);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editUploading, setEditUploading] = useState({
    heroImage: false,
    logoUrl: false,
  });

  const loadInstitutions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/institutions");
      if (!res.ok) {
        throw new Error("Failed to fetch institutions");
      }
      const { data } = (await res.json()) as { data: InstitutionRow[] };
      setInstitutions(data);
    } catch (error) {
      console.error("Failed to fetch institutions", error);
    }
  }, []);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setCreateError(null);
      setCreateForm(INITIAL_FORM_STATE);
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const institutionCount = useMemo(() => institutions.length, [institutions]);
  const institutionHelper =
    institutionCount === 1 ? "Partner live" : "Partners live";

  const openCreateModal = () => {
    setCreateForm(INITIAL_FORM_STATE);
    setCreateError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (institution: InstitutionRow) => {
    setEditingInstitution(institution);
    setEditForm({
      name: institution.name ?? "",
      slug: institution.slug ?? "",
      location: institution.location ?? "",
      accreditation: institution.accreditation ?? "",
      website: institution.website ?? "",
      heroImage: institution.heroImage ?? "",
      logoUrl: institution.logoUrl ?? "",
      establishedYear: institution.establishedYear
        ? institution.establishedYear.toString()
        : "",
      shortDescription: institution.shortDescription ?? "",
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  const handleCreateImageUpload = async (field: ImageField, files: File[]) => {
    const file = files[0];
    if (!file) return;

    console.log("[CREATE] Starting image upload", {
      field,
      fileName: file.name,
      fileSize: file.size,
    });
    setCreateUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const url = await uploadToCloudinary(file, UPLOAD_FOLDERS[field]);
      console.log("[CREATE] Image upload successful", { field, url });
      setCreateForm((prev) => {
        const newForm = { ...prev, [field]: url };
        console.log("[CREATE] Form state updated", { field, newForm });
        return newForm;
      });
    } catch (error) {
      console.error("[CREATE] Image upload failed", { field, error });
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      setCreateError(message);
    } finally {
      console.log("[CREATE] Upload finished, resetting uploading state", {
        field,
      });
      setCreateUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleEditImageUpload = async (field: ImageField, files: File[]) => {
    const file = files[0];
    if (!file) return;

    console.log("[EDIT] Starting image upload", {
      field,
      fileName: file.name,
      fileSize: file.size,
    });
    setEditUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const url = await uploadToCloudinary(file, UPLOAD_FOLDERS[field]);
      console.log("[EDIT] Image upload successful", { field, url });
      setEditForm((prev) => {
        const newForm = { ...prev, [field]: url };
        console.log("[EDIT] Form state updated", { field, newForm });
        return newForm;
      });
    } catch (error) {
      console.error("[EDIT] Image upload failed", { field, error });
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      setEditError(message);
    } finally {
      console.log("[EDIT] Upload finished, resetting uploading state", {
        field,
      });
      setEditUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleCreateClearImage = (field: ImageField) => {
    setCreateForm((prev) => ({ ...prev, [field]: "" }));
  };

  const handleEditClearImage = (field: ImageField) => {
    setEditForm((prev) => ({ ...prev, [field]: "" }));
  };

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log("[CREATE] Form submission started");
      setCreateError(null);

      if (!createForm.name.trim() || !createForm.slug.trim()) {
        console.log("[CREATE] Validation failed: Name and slug are required");
        setCreateError("Name and slug are required");
        return;
      }

      if (createUploading.heroImage || createUploading.logoUrl) {
        console.log("[CREATE] Upload in progress, preventing submission", {
          createUploading,
        });
        setCreateError("Please wait for uploads to finish");
        return;
      }

      console.log("[CREATE] Form validation passed, building payload", {
        form: createForm,
      });
      setIsSubmittingCreate(true);

      const payload = buildPayload(createForm);
      console.log("[CREATE] Payload built", { payload });

      const res = await fetch("/api/admin/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("[CREATE] Response received", {
        status: res.status,
        ok: res.ok,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
          (body as { message?: string }).message ||
          "Failed to create institution";
        console.error("[CREATE] Request failed", {
          status: res.status,
          body,
          message,
        });
        throw new Error(message);
      }

      console.log("[CREATE] Success, refreshing institutions list");
      await loadInstitutions();
      toast("Institution created.");
      setIsCreateOpen(false);
      setCreateForm(INITIAL_FORM_STATE);
    } catch (error) {
      console.error("[CREATE] Unexpected error occurred", error);
      setCreateError(
        error instanceof Error ? error.message : "Failed to create institution"
      );
      const message =
        error instanceof Error ? error.message : "Failed to create institution";
      toast.error(message);
    } finally {
      setIsSubmittingCreate(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log("[EDIT] Form submission started");

      if (!editingInstitution) {
        console.error("[EDIT] No editing institution found");
        setEditError("No institution selected for editing");
        return;
      }

      console.log("[EDIT] Editing institution", {
        id: editingInstitution.id,
        name: editingInstitution.name,
      });
      setEditError(null);

      if (!editForm.name.trim() || !editForm.slug.trim()) {
        console.log("[EDIT] Validation failed: Name and slug are required");
        setEditError("Name and slug are required");
        return;
      }

      if (editUploading.heroImage || editUploading.logoUrl) {
        console.log("[EDIT] Upload in progress, preventing submission", {
          editUploading,
        });
        setEditError("Please wait for uploads to finish");
        return;
      }

      console.log("[EDIT] Form validation passed, building payload", {
        form: editForm,
      });
      setIsSubmittingEdit(true);

      const payload = buildPayload(editForm);
      console.log("[EDIT] Payload built", { payload });

      const res = await fetch(
        `/api/admin/institutions/${editingInstitution.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("[EDIT] Response received", {
        status: res.status,
        ok: res.ok,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
          (body as { message?: string }).message ||
          "Failed to update institution";
        console.error("[EDIT] Request failed", {
          status: res.status,
          body,
          message,
        });
        throw new Error(message);
      }

      console.log("[EDIT] Success, refreshing institutions list");
      await loadInstitutions();
      toast("Institution updated.");
      setIsEditOpen(false);
      setEditingInstitution(null);
    } catch (error) {
      console.error("[EDIT] Unexpected error occurred", error);
      setEditError(
        error instanceof Error ? error.message : "Failed to update institution"
      );
      const message =
        error instanceof Error ? error.message : "Failed to update institution";
      toast.error(message);
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Institutions"
        description="Manage partner universities and schools."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add institution
          </button>
        }
        stats={[
          {
            label: "Institutions",
            value: institutionCount.toString(),
            helper: institutionHelper,
          },
        ]}
      />

      <section className="section-container space-y-8">
        {institutions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution) => {
              const accreditation = institution.accreditation ?? "";
              const showAccreditation =
                accreditation &&
                !accreditation.toLowerCase().includes("ugc entitl");

              return (
                <div
                  key={institution.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] shadow-[0_28px_72px_-48px_rgba(16,19,26,0.52)] transition hover:-translate-y-1 hover:shadow-[0_32px_80px_-44px_rgba(16,19,26,0.55)]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[color:color-mix(in_srgb,var(--surface-muted)_50%,white_50%)]">
                    {institution.heroImage ? (
                      <img
                        src={institution.heroImage}
                        alt={`${institution.name} hero`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[color:color-mix(in_srgb,var(--color-secondary)_55%,white_45%)]">
                        <ImageIcon className="h-10 w-10" />
                      </div>
                    )}
                    {institution.logoUrl ? (
                      <img
                        src={institution.logoUrl}
                        alt={`${institution.name} logo`}
                        className="absolute bottom-3 left-3 h-12 w-12 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-white p-1 shadow-[0_8px_20px_-12px_rgba(16,19,26,0.55)]"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[color:var(--color-secondary)]">
                        {institution.name}
                      </h3>
                      <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                        {institution.location || "Location not specified"}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <Link
                        href={`/admin/institutions/${institution.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:text-[color:color-mix(in_srgb,var(--color-accent)_85%,white_15%)]"
                      >
                        View profile
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(institution)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_94%,white_6%)] px-3 py-1.5 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] transition hover:text-[color:var(--color-secondary)]"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              type="button"
              onClick={openCreateModal}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
            >
              Add institution
            </button>
          </div>
        )}
      </section>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]">
            <div className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] p-6">
              <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
                Add Institution
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
              >
                Close
              </button>
            </div>
            <form
              className="p-6 space-y-6"
              onSubmit={(e) => {
                console.log("[CREATE] Form onSubmit event fired");
                handleCreateSubmit(e);
              }}
            >
              {createError ? (
                <div className="rounded-md border border-[color:color-mix(in_srgb,crimson_45%,transparent)] bg-[color:color-mix(in_srgb,crimson_10%,transparent)] p-3 text-sm text-[color:color-mix(in_srgb,crimson_70%,white_30%)]">
                  {createError}
                </div>
              ) : null}

              <InstitutionFormFields
                form={createForm}
                onChange={setCreateForm}
                onImageUpload={handleCreateImageUpload}
                onClearImage={handleCreateClearImage}
                uploading={createUploading}
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmittingCreate ||
                    createUploading.heroImage ||
                    createUploading.logoUrl
                  }
                  onClick={(e) => {
                    console.log("[CREATE] Submit button clicked", {
                      disabled:
                        isSubmittingCreate ||
                        createUploading.heroImage ||
                        createUploading.logoUrl,
                      isSubmittingCreate,
                      createUploading,
                    });
                  }}
                  className="rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90 disabled:opacity-60"
                >
                  {createUploading.heroImage || createUploading.logoUrl
                    ? "Uploading image..."
                    : isSubmittingCreate
                    ? "Adding…"
                    : "Create Institution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && editingInstitution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]">
            <div className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] p-6">
              <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
                Edit Institution
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingInstitution(null);
                }}
                className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
              >
                Close
              </button>
            </div>
            <form
              className="p-6 space-y-6"
              onSubmit={(e) => {
                console.log("[EDIT] Form onSubmit event fired");
                handleEditSubmit(e);
              }}
            >
              {editError ? (
                <div className="rounded-md border border-[color:color-mix(in_srgb,crimson_45%,transparent)] bg-[color:color-mix(in_srgb,crimson_10%,transparent)] p-3 text-sm text-[color:color-mix(in_srgb,crimson_70%,white_30%)]">
                  {editError}
                </div>
              ) : null}

              <InstitutionFormFields
                form={editForm}
                onChange={setEditForm}
                onImageUpload={handleEditImageUpload}
                onClearImage={handleEditClearImage}
                uploading={editUploading}
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingInstitution(null);
                  }}
                  className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmittingEdit ||
                    editUploading.heroImage ||
                    editUploading.logoUrl
                  }
                  onClick={(e) => {
                    console.log("[EDIT] Submit button clicked", {
                      disabled:
                        isSubmittingEdit ||
                        editUploading.heroImage ||
                        editUploading.logoUrl,
                      isSubmittingEdit,
                      editUploading,
                    });
                  }}
                  className="rounded-lg bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90 disabled:opacity-60"
                >
                  {editUploading.heroImage || editUploading.logoUrl
                    ? "Uploading image..."
                    : isSubmittingEdit
                    ? "Saving…"
                    : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface InstitutionFormFieldsProps {
  form: InstitutionFormState;
  onChange: Dispatch<SetStateAction<InstitutionFormState>>;
  onImageUpload: (field: ImageField, files: File[]) => void;
  onClearImage: (field: ImageField) => void;
  uploading: Partial<Record<ImageField, boolean>>;
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  field: ImageField;
  uploading: boolean;
  previewClassName: string;
  onUpload: (field: ImageField, files: File[]) => void;
  onClear: (field: ImageField) => void;
}

function ImageUploadField({
  label,
  value,
  field,
  uploading,
  previewClassName,
  onUpload,
  onClear,
}: ImageUploadFieldProps) {
  return (
    <div className="col-span-2 space-y-3">
      <label className="block text-sm font-semibold text-[color:var(--color-secondary)]">
        {label}
      </label>
      {value ? (
        <div className="flex items-center gap-4">
          <img
            src={value}
            alt={`${label} preview`}
            className={previewClassName}
          />
          <button
            type="button"
            onClick={() => onClear(field)}
            className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] px-3 py-1.5 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] transition hover:text-[color:var(--color-secondary)]"
          >
            Remove
          </button>
        </div>
      ) : null}
      <div
        className={`rounded-lg border border-dashed border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_96%,white_4%)] p-4 ${
          uploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <FileUpload
          key={`${field}-${value || "empty"}`}
          onChange={(files) => onUpload(field, files)}
        />
      </div>
      {uploading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--color-accent)] border-t-transparent"></div>
          <p className="text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
            Uploading {label.toLowerCase()}…
          </p>
        </div>
      ) : null}
    </div>
  );
}

function InstitutionFormFields({
  form,
  onChange,
  onImageUpload,
  onClearImage,
  uploading,
}: InstitutionFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Slug
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, slug: e.target.value }))
          }
          className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Location
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, location: e.target.value }))
          }
          className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Accreditation
        </label>
        <input
          type="text"
          value={form.accreditation}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, accreditation: e.target.value }))
          }
          className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Website URL
        </label>
        <input
          type="url"
          value={form.website}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, website: e.target.value }))
          }
          className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
        />
      </div>
      <ImageUploadField
        label="Hero image"
        value={form.heroImage}
        field="heroImage"
        uploading={uploading.heroImage ?? false}
        previewClassName="h-20 w-36 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] object-cover"
        onUpload={onImageUpload}
        onClear={onClearImage}
      />
      <ImageUploadField
        label="Logo"
        value={form.logoUrl}
        field="logoUrl"
        uploading={uploading.logoUrl ?? false}
        previewClassName="h-16 w-16 rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] bg-white object-contain"
        onUpload={onImageUpload}
        onClear={onClearImage}
      />
      <div>
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Established year
        </label>
        <input
          type="number"
          value={form.establishedYear}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              establishedYear: e.target.value,
            }))
          }
          className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
          min={1800}
          max={new Date().getFullYear()}
        />
      </div>
      <div className="col-span-2">
        <label className="mb-2 block text-sm font-semibold text-[color:var(--color-secondary)]">
          Short description
        </label>
        <textarea
          value={form.shortDescription}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              shortDescription: e.target.value,
            }))
          }
          className="min-h-24 w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
        />
      </div>
    </div>
  );
}

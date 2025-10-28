"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

interface LeadRow {
  id: number;
  fullName: string;
  gender: string | null;
  email: string;
  phone: string;
  dob: string | null;
  state: string | null;
  city: string | null;
  employmentStatus: string | null;
  salaryBand: string | null;
  highestQualification: string | null;
  lastScorePercent: string | null;
  degreeInterest: string | null;
  coursePreference: string | null;
  specialisationInterest: string | null;
  goal: string | null;
  budgetRange: string | null;
  wantsEmi: boolean;
  category: string | null;
  experienceYears: string | null;
  preferredMode: string | null;
  source: string | null;
  utmCampaign: string | null;
  consentedAt: string;
  notes: string | null;
  status: "new" | "pending" | "reached_out" | "completed" | "closed";
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [query, setQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [tagValue, setTagValue] = useState<LeadRow["status"]>("new");

  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/admin/leads");
        const { data } = (await res.json()) as { data: LeadRow[] };
        setLeads(data);
      } catch (e) {
        console.error("Failed to fetch leads", e);
      }
    }
    fetchLeads();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return leads;
    const q = query.toLowerCase();
    return leads.filter((l) =>
      [
        l.fullName,
        l.email,
        l.phone,
        l.degreeInterest,
        l.coursePreference,
        l.specialisationInterest,
        l.city,
        l.state,
        l.category,
        l.source,
        l.status,
        l.notes ?? "",
      ]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q))
    );
  }, [leads, query]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-IN"), []);

  const statusCounts = useMemo(() => {
    const base: Record<LeadRow["status"], number> = {
      new: 0,
      pending: 0,
      reached_out: 0,
      completed: 0,
      closed: 0,
    };
    for (const lead of leads) {
      base[lead.status] += 1;
    }
    return base;
  }, [leads]);

  const totalLeadCount = leads.length;
  const newLeadCount = statusCounts.new;
  const inProgressCount = statusCounts.pending + statusCounts.reached_out;

  function getStatusClasses(status: LeadRow["status"]) {
    // Smaller, high-contrast tag-like styles per status
    const base =
      "inline-flex items-center rounded-full border text-[10px] px-2 py-0.5 font-semibold";
    switch (status) {
      case "new":
        return `${base} border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-subtle)_92%,white_8%)] text-[color:var(--color-secondary)]`;
      case "pending":
        return `${base} border-[color:color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-accent)_12%,transparent)] text-[color:color-mix(in_srgb,var(--color-accent)_70%,white_30%)]`;
      case "reached_out":
        return `${base} border-[color:color-mix(in_srgb,var(--color-secondary)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_10%,transparent)] text-[color:color-mix(in_srgb,var(--color-secondary)_80%,white_20%)]`;
      case "completed":
        return `${base} border-[color:color-mix(in_srgb,green_45%,transparent)] bg-[color:color-mix(in_srgb,green_12%,transparent)] text-[color:color-mix(in_srgb,green_70%,white_30%)]`;
      case "closed":
        return `${base} border-[color:color-mix(in_srgb,crimson_45%,transparent)] bg-[color:color-mix(in_srgb,crimson_12%,transparent)] text-[color:color-mix(in_srgb,crimson_70%,white_30%)]`;
      default:
        return base;
    }
  }

  async function updateStatus(leadId: number, status: LeadRow["status"]) {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // Refresh list
      const listRes = await fetch("/api/admin/leads");
      const { data } = (await listRes.json()) as { data: LeadRow[] };
      setLeads(data);
      // If dialog is open, update selected lead locally
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function openDetails(lead: LeadRow) {
    setSelectedLead(lead);
    setIsDialogOpen(true);
    setIsEditingTag(false);
    setTagValue(lead.status);
  }

  function closeDetails() {
    setIsDialogOpen(false);
    setSelectedLead(null);
    setIsEditingTag(false);
  }

  return (
  <>
    <AdminPageHeader
      title="Leads"
      description="Monitor submissions and keep follow-ups on track."
      stats={[
        {
          label: "Total leads",
          value: numberFormatter.format(totalLeadCount),
          helper: "All captured submissions",
        },
        {
          label: "New",
          value: numberFormatter.format(newLeadCount),
          helper: "Awaiting triage",
        },
        {
          label: "In progress",
          value: numberFormatter.format(inProgressCount),
          helper: "Pending follow-up",
        },
      ]}
    />

    <section className="section-container space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_62%,white_38%)]">
          Showing {numberFormatter.format(filtered.length)} of {numberFormatter.format(totalLeadCount)} leads
        </p>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]" />
          <input
            type="text"
            placeholder="Search by name, email, phone, interest, city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--surface-subtle)] py-3 pl-10 pr-4 text-[color:var(--color-secondary)] focus:outline-2 focus:outline-[var(--color-ring)]"
          />
        </div>
      </div>

      <div>
        {filtered.length > 0 ? (
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] transition hover:bg-[color:color-mix(in_srgb,var(--surface-subtle)_50%,transparent)]"
                  >
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-[color:var(--color-secondary)] hover:text-[color:var(--color-accent)]"
                      >
                        {lead.fullName}
                      </Link>
                      <div className="mt-1 text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
                        {lead.city || ""} {lead.state ? `• ${lead.state}` : ""}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-3 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                      {lead.degreeInterest || lead.coursePreference || "—"}
                    </td>
                    <td className="px-6 py-3 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                      {lead.budgetRange || "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`${getStatusClasses(lead.status)} capitalize`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[color:color-mix(in_srgb,var(--color-secondary)_65%,white_35%)]">
                      {lead.consentedAt
                        ? dateFmt.format(new Date(lead.consentedAt))
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => openDetails(lead)}
                        className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
                      >
                        View
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
              No leads yet
            </p>
            <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_60%,white_40%)]">
              Lead submissions will appear here once users complete the form
            </p>
          </div>
        )}
      </div>
    </section>

    {selectedLead && isDialogOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] bg-[var(--surface-subtle)]">
          <div className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] p-6">
            <h2 className="text-xl font-bold text-[color:var(--color-secondary)]">
              Lead details
            </h2>
            <button
              onClick={closeDetails}
              className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
            >
              Close
            </button>
          </div>
          <div className="grid max-h-[70vh] grid-cols-2 gap-6 overflow-y-auto p-6">
            <div>
              <h3 className="label mb-3">Profile</h3>
              <div className="space-y-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                <div>
                  <strong>Name:</strong> {selectedLead.fullName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedLead.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedLead.phone}
                </div>
                <div>
                  <strong>Location:</strong> {selectedLead.city || "—"}
                  {selectedLead.state ? `, ${selectedLead.state}` : ""}
                </div>
                <div>
                  <strong>Preferred Mode:</strong> {selectedLead.preferredMode || "—"}
                </div>
                <div>
                  <strong>Needs EMI:</strong> {selectedLead.wantsEmi ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <div>
              <h3 className="label mb-3">Programme Fit</h3>
              <div className="space-y-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                <div>
                  <strong>Degree Interest:</strong> {selectedLead.degreeInterest || "—"}
                </div>
                <div>
                  <strong>Course Preference:</strong> {selectedLead.coursePreference || "—"}
                </div>
                <div>
                  <strong>Specialisation:</strong> {selectedLead.specialisationInterest || "—"}
                </div>
                <div>
                  <strong>Budget Range:</strong> {selectedLead.budgetRange || "—"}
                </div>
                <div>
                  <strong>Goal:</strong> {selectedLead.goal || "—"}
                </div>
              </div>
            </div>
            <div>
              <h3 className="label mb-3">Education & Work</h3>
              <div className="space-y-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                <div>
                  <strong>Highest Qualification:</strong> {selectedLead.highestQualification || "—"}
                </div>
                <div>
                  <strong>Last Score:</strong> {selectedLead.lastScorePercent || "—"}
                </div>
                <div>
                  <strong>Employment:</strong> {selectedLead.employmentStatus || "—"}
                </div>
                <div>
                  <strong>Experience:</strong> {selectedLead.experienceYears || "—"}
                </div>
                <div>
                  <strong>Salary Band:</strong> {selectedLead.salaryBand || "—"}
                </div>
              </div>
            </div>
            <div>
              <h3 className="label mb-3">Attribution</h3>
              <div className="space-y-2 text-sm text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white_30%)]">
                <div>
                  <strong>Source:</strong> {selectedLead.source || "—"}
                </div>
                <div>
                  <strong>UTM:</strong> {selectedLead.utmCampaign || "—"}
                </div>
                <div>
                  <strong>Consented:</strong> {selectedLead.consentedAt
                    ? dateFmt.format(new Date(selectedLead.consentedAt))
                    : "—"}
                </div>
                <div className="flex items-center gap-3">
                  <strong>Status:</strong>
                  {!isEditingTag ? (
                    <>
                      <span className="pill text-xs capitalize">
                        {selectedLead.status.replace("_", " ")}
                      </span>
                      <button
                        onClick={() => setIsEditingTag(true)}
                        className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-2 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
                      >
                        Edit tag
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={tagValue}
                        onChange={(e) =>
                          setTagValue(e.target.value as LeadRow["status"])
                        }
                        className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-transparent px-2 py-1 text-xs"
                      >
                        <option value="new">New</option>
                        <option value="pending">Pending</option>
                        <option value="reached_out">Reached out</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={async () => {
                          if (!selectedLead) return;
                          await updateStatus(selectedLead.id, tagValue);
                          setIsEditingTag(false);
                        }}
                        className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-2 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setTagValue(selectedLead.status);
                          setIsEditingTag(false);
                        }}
                        className="rounded-md border border-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] px-2 py-1 text-xs font-semibold text-[color:color-mix(in_srgb,var(--color-secondary)_75%,white_25%)] hover:text-[color:var(--color-secondary)]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <strong>Notes:</strong> {selectedLead.notes || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
}

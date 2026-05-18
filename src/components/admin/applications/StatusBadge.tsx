"use client";

import { ApplicationStatus } from "@/lib/interfaces/core";

const STATUS_STYLES: Record<string, string> = {
  ENDORSED: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
  PENDING_ENDORSEMENT: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  AWARDED: "bg-green-100 text-green-800 ring-1 ring-green-200",
  IN_REVIEW: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
  INTERVIEW: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
  REJECTED: "bg-red-100 text-red-800 ring-1 ring-red-200",
  REJECTED_BY_WING: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

const DEFAULT_STYLE = "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
}

/**
 * Renders a styled pill badge for an application status.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${
        STATUS_STYLES[status] || DEFAULT_STYLE
      }`}
    >
      {status}
    </span>
  );
}

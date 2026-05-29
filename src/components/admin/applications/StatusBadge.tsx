"use client";

import { ApplicationStatus } from "@/lib/interfaces/core";
import { getStatusConfig } from "@/lib/constants/statusConfig";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, badgeClass } = getStatusConfig(status);
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${badgeClass}`}>
      {label}
    </span>
  );
}

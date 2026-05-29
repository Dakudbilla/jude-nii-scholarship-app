import { ApplicationStatus } from "@/lib/interfaces/core";

interface StatusConfig {
  label: string;
  badgeClass: string;
  description: string;
}

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  PENDING_ENDORSEMENT: {
    label: "Pending Endorsement",
    badgeClass: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    description: "Waiting for wing head endorsement.",
  },
  ENDORSED: {
    label: "Endorsed",
    badgeClass: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
    description: "Endorsed by wing head. Awaiting internal review.",
  },
  REJECTED_BY_WING: {
    label: "Rejected by Wing",
    badgeClass: "bg-red-100 text-red-800 ring-1 ring-red-200",
    description: "Application denied by the wing head.",
  },
  IN_REVIEW: {
    label: "In Review",
    badgeClass: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
    description: "Currently being reviewed and scored.",
  },
  INTERVIEW: {
    label: "Shortlisted for Interview",
    badgeClass: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
    description: "Shortlisted for interview stage.",
  },
  REJECTED: {
    label: "Not Selected",
    badgeClass: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    description: "Not selected this cycle.",
  },
  AWARDED: {
    label: "Awarded",
    badgeClass: "bg-green-100 text-green-800 ring-1 ring-green-200",
    description: "Congratulations! You have been awarded the scholarship.",
  },
};

export function getStatusConfig(status: string): StatusConfig {
  return (
    APPLICATION_STATUS_CONFIG[status as ApplicationStatus] ?? {
      label: status,
      badgeClass: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      description: "",
    }
  );
}

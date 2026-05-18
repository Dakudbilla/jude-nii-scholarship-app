"use client";

import { ApplicationStatus } from "@/lib/interfaces/core";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

const STAGES = [
  { id: "PENDING_ENDORSEMENT", label: "Endorsement" },
  { id: "IN_REVIEW", label: "Review" },
  { id: "INTERVIEW", label: "Interview" },
  { id: "DECISION", label: "Decision" },
] as const;

function getStageState(status: ApplicationStatus): {
  currentIndex: number;
  isRejected: boolean;
} {
  switch (status) {
    case "PENDING_ENDORSEMENT": return { currentIndex: 0, isRejected: false };
    case "REJECTED_BY_WING":   return { currentIndex: 0, isRejected: true };
    case "ENDORSED":           return { currentIndex: 1, isRejected: false };
    case "IN_REVIEW":          return { currentIndex: 1, isRejected: false };
    case "INTERVIEW":          return { currentIndex: 2, isRejected: false };
    case "AWARDED":            return { currentIndex: 3, isRejected: false };
    case "REJECTED":           return { currentIndex: 3, isRejected: true };
    default:                   return { currentIndex: 0, isRejected: false };
  }
}

interface ApplicationStageStepperProps {
  status: ApplicationStatus;
}

export function ApplicationStageStepper({ status }: ApplicationStageStepperProps) {
  const { currentIndex, isRejected } = getStageState(status);

  return (
    <div className="relative flex items-center justify-between w-full">
      {/* Background track */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0" />

      {/* Active track */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500 ${
          isRejected ? "bg-red-500" : "bg-primary"
        }`}
        style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
      />

      {STAGES.map((stage, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;

        let NodeIcon = Circle;
        let iconClass = "w-6 h-6 text-slate-300 fill-white";
        let labelClass = "text-slate-400 font-medium";

        if (isPast) {
          NodeIcon = CheckCircle2;
          iconClass = "w-7 h-7 text-primary fill-primary/10";
          labelClass = "text-primary font-bold";
        } else if (isCurrent) {
          if (isRejected) {
            NodeIcon = XCircle;
            iconClass = "w-8 h-8 text-red-500 fill-white bg-white rounded-full ring-4 ring-red-50";
            labelClass = "text-red-600 font-bold";
          } else {
            NodeIcon = Circle;
            iconClass = "w-8 h-8 text-primary fill-white stroke-[4px] bg-white rounded-full ring-4 ring-primary/10";
            labelClass = "text-primary font-extrabold";
          }
        }

        return (
          <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3 bg-white px-2">
            <div className="h-8 flex items-center justify-center">
              <NodeIcon className={iconClass} />
            </div>
            <span className={`text-xs uppercase tracking-wider ${labelClass}`}>
              {stage.label}
              {isCurrent && stage.id === "DECISION" && (isRejected ? " (Rejected)" : " (Awarded)")}
              {isCurrent && status === "REJECTED_BY_WING" && " (Declined)"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

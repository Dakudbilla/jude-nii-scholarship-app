"use client";

import { YearStatus } from "@/lib/interfaces/core";
import { CheckCircle2, CircleDashed } from "lucide-react";

const STAGES = [
  { id: "SETUP", label: "Setup" },
  { id: "OPEN", label: "Applications Open" },
  { id: "REVIEW", label: "Review & Scoring" },
  { id: "CLOSED", label: "Archived" },
] as const;

interface CycleTimelineProps {
  currentStatus: YearStatus;
}

/**
 * Renders the 4-step visual timeline for a cycle's lifecycle.
 */
export function CycleTimeline({ currentStatus }: CycleTimelineProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStatus);

  return (
    <div className="flex items-center justify-between relative">
      {/* Connecting Line */}
      <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 z-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{
            width: currentIndex === -1 ? "0%" : `${(currentIndex / (STAGES.length - 1)) * 100}%`,
          }}
        />
      </div>

      {STAGES.map((stage, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;

        let iconClass = "text-slate-300 bg-white border-slate-200";
        let labelClass = "text-slate-400";
        let IconComponent = CircleDashed;

        if (isPast) {
          iconClass = "text-white bg-primary border-primary";
          labelClass = "text-slate-600 font-bold";
          IconComponent = CheckCircle2;
        } else if (isCurrent) {
          iconClass = "text-primary bg-white border-primary ring-4 ring-primary/20";
          labelClass = "text-primary font-extrabold";
          IconComponent = CheckCircle2;
        }

        return (
          <div key={stage.id} className="relative z-10 flex flex-col items-center gap-4 bg-white px-4">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${iconClass}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <span className={`text-xs uppercase tracking-widest ${labelClass}`}>{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}

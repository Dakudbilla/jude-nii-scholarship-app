"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/**
 * Shared empty state component with icon, title, and optional CTA.
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-4">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-slate-50/50">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-1 text-sm max-w-sm mx-auto">{description}</p>
      </div>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

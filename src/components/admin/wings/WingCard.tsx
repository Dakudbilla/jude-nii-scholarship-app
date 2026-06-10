"use client";

import { Wing } from "@/lib/interfaces/core";
import { Users, Mail, Phone, Pencil, ShieldCheck, ShieldOff } from "lucide-react";

interface WingCardProps {
  wing: Wing;
  onEdit: () => void;
  onToggleActive: () => void;
  isUpdating: boolean;
}

export function WingCard({ wing, onEdit, onToggleActive, isUpdating }: WingCardProps) {
  return (
    <div
      className={`bg-white border rounded-3xl p-6 shadow-sm transition-all ${
        wing.isActive ? "border-slate-100" : "border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              wing.isActive ? "bg-primary/10" : "bg-slate-100"
            }`}
          >
            <Users className={`w-5 h-5 ${wing.isActive ? "text-primary" : "text-slate-400"}`} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">{wing.name}</h3>
            <span
              className={`text-xs font-bold uppercase tracking-wider mt-1 block ${
                wing.isActive ? "text-green-600" : "text-slate-400"
              }`}
            >
              {wing.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            aria-label="Edit wing"
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleActive}
            disabled={isUpdating}
            aria-label={wing.isActive ? "Deactivate wing" : "Activate wing"}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              wing.isActive
                ? "hover:bg-red-50 text-slate-400 hover:text-red-500"
                : "hover:bg-green-50 text-slate-400 hover:text-green-500"
            }`}
          >
            {wing.isActive ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <WingContactRow icon={<Users className="w-3.5 h-3.5 text-slate-500" />}>
          {wing.headName || <span className="text-slate-400 font-normal italic">No name set</span>}
        </WingContactRow>
        <WingContactRow icon={<Mail className="w-3.5 h-3.5 text-slate-500" />}>
          {wing.headEmail || <span className="text-slate-400 italic">No email set</span>}
        </WingContactRow>
        <WingContactRow icon={<Phone className="w-3.5 h-3.5 text-slate-500" />}>
          {wing.headPhone || <span className="text-slate-400 italic">No phone set</span>}
        </WingContactRow>
      </div>
    </div>
  );
}

function WingContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="font-semibold text-slate-800 truncate">{children}</span>
    </div>
  );
}

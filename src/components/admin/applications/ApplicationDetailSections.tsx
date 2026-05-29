import { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function DetailSection({ title, icon, children }: DetailSectionProps) {
  return (
    <div className="bg-white border border-slate-100 text-left p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
      <h3 className="text-xl font-bold border-b border-slate-100 pb-4 text-slate-900 tracking-tight flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

interface InfoTileProps {
  label: string;
  value: ReactNode;
}

export function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl">
      <span className="text-slate-500 block font-medium text-xs mb-1">{label}</span>
      <span className="font-bold text-slate-900">
        {value ?? <span className="text-slate-400 font-normal">—</span>}
      </span>
    </div>
  );
}

interface EssayBlockProps {
  label: string;
  text?: string;
}

export function EssayBlock({ label, text }: EssayBlockProps) {
  return (
    <div>
      <span className="text-secondary block text-xs font-bold uppercase tracking-widest mb-3">{label}</span>
      <p className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-slate-700 text-base leading-relaxed italic">
        {text ?? <span className="text-slate-400 not-italic">Not provided.</span>}
      </p>
    </div>
  );
}

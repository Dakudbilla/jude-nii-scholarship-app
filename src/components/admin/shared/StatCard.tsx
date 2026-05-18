"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}

/**
 * Displays a single dashboard metric with icon, label, and value.
 */
export function StatCard({ title, value, icon, bg }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${bg}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

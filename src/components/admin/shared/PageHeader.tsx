"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // for action buttons on the right
}

/**
 * Shared page header used across all admin pages.
 * Renders a consistent h1 + subtitle layout with optional right-side actions.
 */
export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 mt-2 font-medium">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
}

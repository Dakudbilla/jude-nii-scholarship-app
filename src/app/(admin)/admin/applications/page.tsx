"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCycle } from "@/providers/CycleProvider";
import { useApplications } from "@/hooks/useApplications";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatusBadge } from "@/components/admin/applications/StatusBadge";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [filterStr, setFilterStr] = useState("");
  const { selectedCycle } = useCycle();
  const { applications, isLoading, isError } = useApplications(selectedCycle?.id);

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading applications...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Failed to load applications.</div>;

  const filteredApps = (applications || []).filter((app: any) =>
    app.studentId?.toLowerCase().includes(filterStr.toLowerCase()) ||
    app.personalInfo?.fullName?.toLowerCase().includes(filterStr.toLowerCase()) ||
    app.status?.toLowerCase().includes(filterStr.toLowerCase())
  );

  return (
    <div className="p-10 space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Applications"
        subtitle="Review and score incoming scholarship applications."
      />

      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <input
            type="text"
            placeholder="Search by name, ID, or status..."
            className="flex h-12 w-full md:max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={filterStr}
            onChange={(e) => setFilterStr(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100/80">
              <tr>
                <th className="px-8 py-5 font-bold tracking-wider">Applicant</th>
                <th className="px-6 py-5 font-bold tracking-wider">Programme</th>
                <th className="px-6 py-5 font-bold tracking-wider">Status</th>
                <th className="px-8 py-5 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-500 font-medium">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app: any) => (
                  <tr
                    key={app.id}
                    onClick={() => router.push(`/admin/applications/${app.id}`)}
                    className="hover:bg-slate-50/80 hover:cursor-pointer transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 text-base">{app.personalInfo?.fullName}</div>
                      <div className="text-slate-500 text-xs font-medium mt-0.5">{app.studentId} • {app.email}</div>
                    </td>
                    <td className="px-6 py-5 font-medium">
                      {app.academicInfo?.programme}{" "}
                      <span className="text-slate-400 font-normal whitespace-nowrap">(Yr {app.academicInfo?.year})</span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:border-secondary hover:text-secondary shadow-sm text-slate-700 font-bold h-10 px-6 text-sm">
                        Review
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

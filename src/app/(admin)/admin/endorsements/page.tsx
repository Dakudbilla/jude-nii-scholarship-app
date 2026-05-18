"use client";

import { useCycle } from "@/providers/CycleProvider";
import { useApplications } from "@/hooks/useApplications";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { CopyLinkButton } from "@/components/admin/applications/CopyLinkButton";

export default function AdminEndorsementsPage() {
  const { selectedCycle } = useCycle();
  const { applications: allApps, isLoading, isError } = useApplications(selectedCycle?.id);

  const applications = (allApps || []).filter((a: any) => a.status === "PENDING_ENDORSEMENT");

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading pending endorsements...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Failed to load. Please check your connection.</div>;

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Endorsements"
        subtitle="Track wing head responses and pending approvals."
      />

      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 font-bold tracking-wider">Applicant</th>
                <th className="px-6 py-5 font-bold tracking-wider">Wing ID</th>
                <th className="px-6 py-5 font-bold tracking-wider">Submitted</th>
                <th className="px-6 py-5 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500 font-medium">
                    No pending endorsements.
                  </td>
                </tr>
              ) : (
                applications.map((app: any) => (
                  <tr key={app.id} className="border-b hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900">{app.personalInfo?.fullName}</div>
                      <div className="text-slate-500 text-xs font-medium mt-0.5">{app.studentId} • {app.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-700">{app.wingId || "–"}</span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-xs">
                      {app.createdAt?.toDate?.()?.toLocaleDateString() ?? "—"}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {app.endorsementToken ? (
                        <CopyLinkButton token={app.endorsementToken} />
                      ) : (
                        <span className="text-xs text-slate-400">No token</span>
                      )}
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

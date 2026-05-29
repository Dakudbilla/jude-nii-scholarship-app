"use client";

import { useCycle } from "@/providers/CycleProvider";
import { useApplications } from "@/hooks/useApplications";
import { useWings } from "@/hooks/useWings";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { CopyLinkButton } from "@/components/admin/applications/CopyLinkButton";
import { AlertCircle, Clock } from "lucide-react";
import { Application, Wing } from "@/lib/interfaces/core";

import { toDate, formatDate } from "@/lib/utils/date";

function getExpiryInfo(expiresAt: unknown): { label: string; isExpired: boolean; isSoon: boolean } {
  const date = toDate(expiresAt);
  if (!date) return { label: "No expiry", isExpired: false, isSoon: false };
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) return { label: "Expired", isExpired: true, isSoon: false };
  if (diffHrs < 12) return { label: `Expires in ${Math.ceil(diffHrs)}h`, isExpired: false, isSoon: true };
  return {
    label: `Expires ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
    isExpired: false,
    isSoon: false,
  };
}

export default function AdminEndorsementsPage() {
  const { selectedCycle } = useCycle();
  const { applications: allApps, isLoading, isError } = useApplications(selectedCycle?.id);
  const { wings } = useWings(selectedCycle?.id);

  const wingMap = Object.fromEntries((wings as Wing[]).map((w) => [w.id, w.name]));
  const applications = (allApps as Application[] ?? []).filter((a) => a.status === "PENDING_ENDORSEMENT");

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading pending endorsements...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Failed to load. Please check your connection.</div>;

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Endorsements"
        subtitle={`${applications.length} pending wing head approval${applications.length !== 1 ? "s" : ""}.`}
      />

      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 font-bold tracking-wider">Applicant</th>
                <th className="px-6 py-5 font-bold tracking-wider">Wing</th>
                <th className="px-6 py-5 font-bold tracking-wider">Submitted</th>
                <th className="px-6 py-5 font-bold tracking-wider">Token Expiry</th>
                <th className="px-6 py-5 font-bold tracking-wider text-right">Endorsement Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle className="w-8 h-8" />
                      <span className="font-medium">No pending endorsements.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const expiry = getExpiryInfo(app.endorsementTokenExpiresAt);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900">{app.personalInfo?.fullName}</div>
                        <div className="text-slate-500 text-xs font-medium mt-0.5">
                          {app.studentId} • {app.email}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-medium text-slate-700">
                          {wingMap[app.wingId] || app.wingId || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-500 text-xs">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            expiry.isExpired
                              ? "bg-red-100 text-red-700"
                              : expiry.isSoon
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {expiry.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {app.endorsementToken && !expiry.isExpired ? (
                          <CopyLinkButton token={app.endorsementToken} />
                        ) : expiry.isExpired ? (
                          <span className="text-xs text-red-400 font-medium">Token expired</span>
                        ) : (
                          <span className="text-xs text-slate-400">No token</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCycle } from "@/providers/CycleProvider";
import { useApplications } from "@/hooks/useApplications";
import { useWings } from "@/hooks/useWings";
import { useDashboard } from "@/hooks/useDashboard";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants/statusConfig";
import { ApplicationStatus, Application, Wing } from "@/lib/interfaces/core";
import { formatDate } from "@/lib/utils/date";

// Bar-chart colour per status — kept local since it's display-only
const STATUS_BAR_COLOR: Record<ApplicationStatus, string> = {
  PENDING_ENDORSEMENT: "bg-amber-500",
  ENDORSED:            "bg-blue-500",
  REJECTED_BY_WING:    "bg-red-500",
  IN_REVIEW:           "bg-indigo-500",
  INTERVIEW:           "bg-purple-500",
  REJECTED:            "bg-slate-400",
  AWARDED:             "bg-green-500",
};

export default function AdminReportsPage() {
  const { selectedCycle } = useCycle();
  const { applications, isLoading } = useApplications(selectedCycle?.id);
  const { wings } = useWings(selectedCycle?.id);
  const { stats } = useDashboard(selectedCycle?.id);

  if (!selectedCycle) {
    return <div className="p-8 text-center text-slate-500">No cycle selected.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const apps = (applications ?? []) as Application[];
  const wingsArr = (wings ?? []) as Wing[];

  // Status breakdown
  const statusCounts = (Object.keys(APPLICATION_STATUS_CONFIG) as ApplicationStatus[]).map((status) => ({
    status,
    count: apps.filter((a) => a.status === status).length,
  }));

  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  interface WingStat { id: string; name: string; total: number; endorsed: number }
  const ENDORSED_STATUSES: ApplicationStatus[] = ["ENDORSED", "IN_REVIEW", "INTERVIEW", "AWARDED"];

  const wingStats: WingStat[] = wingsArr
    .filter((w) => w.isActive)
    .map((w) => {
      const wingApps = apps.filter((a) => a.wingId === w.id);
      return {
        id: w.id,
        name: w.name,
        total: wingApps.length,
        endorsed: wingApps.filter((a) => ENDORSED_STATUSES.includes(a.status)).length,
      };
    })
    .sort((a, b) => b.total - a.total);

  const scoredApps = apps.filter((a) => a.reviewScore != null);
  const avgScore =
    scoredApps.length > 0
      ? scoredApps.reduce((sum, a) => sum + (a.reviewScore ?? 0), 0) / scoredApps.length
      : null;

  const handleExportCSV = () => {
    const headers = ["Name", "Student ID", "Email", "Programme", "Year", "Wing", "Status", "Review Score", "Submitted"];
    const wingsMap = Object.fromEntries(wingsArr.map((w) => [w.id, w.name]));
    const rows = apps.map((a) => [
      a.personalInfo?.fullName ?? "",
      a.studentId,
      a.email,
      a.academicInfo?.programme ?? "",
      a.academicInfo?.year ?? "",
      wingsMap[a.wingId] ?? a.wingId,
      a.status,
      a.reviewScore ?? "",
      formatDate(a.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCycle.label.replace(/\s+/g, "_")}_applications.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <PageHeader
          title="Reports"
          subtitle={`Analytics for the ${selectedCycle.label} cycle.`}
        />
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Applications", value: stats?.totalApplications ?? apps.length, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Reviewed (scored)", value: scoredApps.length, color: "text-indigo-700", bg: "bg-indigo-50" },
          { label: "Avg Review Score", value: avgScore != null ? avgScore.toFixed(1) : "—", color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Awarded", value: stats?.awarded ?? 0, color: "text-green-700", bg: "bg-green-50" },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} rounded-3xl p-6`}>
            <div className={`text-3xl font-extrabold ${item.color}`}>{item.value}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Status Breakdown</h2>
        <div className="space-y-3">
          {statusCounts.map(({ status, count }) => {
            const { label } = APPLICATION_STATUS_CONFIG[status];
            const barColor = STATUS_BAR_COLOR[status];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={status} className="flex items-center gap-4">
                <div className="w-44 text-sm font-medium text-slate-600 shrink-0">{label}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-8 text-right text-sm font-bold text-slate-700">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wing Breakdown */}
      {wingStats.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Wing Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left pb-3 font-bold">Wing</th>
                  <th className="text-right pb-3 font-bold">Applicants</th>
                  <th className="text-right pb-3 font-bold">Endorsed / In Progress</th>
                  <th className="text-right pb-3 font-bold">Endorsement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {wingStats.map((w) => (
                  <tr key={w.id} className="py-3">
                    <td className="py-3 font-bold text-slate-800">{w.name}</td>
                    <td className="py-3 text-right text-slate-600">{w.total}</td>
                    <td className="py-3 text-right text-slate-600">{w.endorsed}</td>
                    <td className="py-3 text-right">
                      {w.total > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {Math.round((w.endorsed / w.total) * 100)}%
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

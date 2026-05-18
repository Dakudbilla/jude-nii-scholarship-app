"use client";

import { useCycle } from "@/providers/CycleProvider";
import { useDashboard } from "@/hooks/useDashboard";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatCard } from "@/components/admin/shared/StatCard";
import { FileText, ShieldCheck, Clock, Award } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { selectedCycle } = useCycle();
  const { stats, isLoading, isError } = useDashboard(selectedCycle?.id);

  if (!selectedCycle) {
    return <div className="p-8 text-center text-slate-500">No cycle selected.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return <div className="p-8 text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Dashboard Overview"
        subtitle={`Summary for the ${selectedCycle.label} cycle.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Pending Endorsement"
          value={stats.pendingEndorsement}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          bg="bg-amber-50"
        />
        <StatCard
          title="Ready for Review"
          value={stats.endorsed}
          icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
          bg="bg-green-50"
        />
        <StatCard
          title="Shortlisted / Awarded"
          value={`${stats.shortlisted} / ${stats.awarded}`}
          icon={<Award className="w-6 h-6 text-purple-600" />}
          bg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/applications"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors font-medium text-slate-700"
            >
              View All Applications <span className="text-slate-400">&rarr;</span>
            </Link>
            <Link
              href="/admin/endorsements"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors font-medium text-slate-700"
            >
              Manage Pending Endorsements <span className="text-slate-400">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Wings Configuration</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
              {stats.activeWings} Active
            </span>
          </div>
          <p className="text-slate-500 mb-6">
            There are {stats.totalWings} wings configured for this cycle. Wing heads must be active to endorse applicants.
          </p>
          <Link href="/admin/wings" className="text-primary font-bold hover:underline">
            Manage Wings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

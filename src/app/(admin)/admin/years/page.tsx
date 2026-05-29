"use client";

import { useYears } from "@/hooks/useYears";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AcademicYear } from "@/lib/interfaces/core";
import { formatDate } from "@/lib/utils/date";

export default function GlobalYearsDirectoryPage() {
  const { years, isLoading, isError } = useYears();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading global cycle data...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load academic years. Please check your connection.</div>;
  }

  const activeYear = years.find((y) => y.status !== "CLOSED");
  const pastYears = years.filter((y) => y.status === "CLOSED");

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link href="/admin" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cycle Selection
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">System Cycles</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Manage the global progression of scholarship cycles.</p>
          </div>
          {!activeYear && (
            <Link
              href="/admin/setup/new"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-slate-50 hover:bg-slate-800 h-12 px-6 font-bold shadow-lg transition-colors gap-2"
            >
              <Plus className="w-5 h-5" />
              New Academic Cycle
            </Link>
          )}
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              Current Active Cycle
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            </h2>
            {activeYear ? (
              <YearCard year={activeYear} />
            ) : (
              <div className="bg-white border-2 border-slate-200 border-dashed rounded-3xl p-12 text-center text-slate-500 font-medium">
                No active cycle. The system is currently idle. Start by creating a new setup.
              </div>
            )}
          </div>

          {pastYears.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-800">Archived Cycles</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {pastYears.map((year) => (
                  <YearCard key={year.id} year={year} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function YearCard({ year }: { year: AcademicYear }) {
  const isClosed = year.status === "CLOSED";
  
  return (
    <div className={`p-8 border rounded-3xl shadow-sm transition-all hover:shadow-md ${isClosed ? "bg-slate-50/50 border-slate-200" : "bg-white border-slate-100"}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">{year.label}</h3>
          <p className="text-sm text-slate-500 truncate max-w-sm mt-1 font-medium">{year.description}</p>
        </div>
        <StatusBadge status={year.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase tracking-wider font-bold">Opens</span>
          <span className="font-bold text-slate-800">{formatDate(year.openDate) || "Not set"}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1 text-xs uppercase tracking-wider font-bold">Deadline</span>
          <span className="font-bold text-slate-800">{formatDate(year.deadline) || "Not set"}</span>
        </div>
      </div>

      <div className="flex">
        <Link href={`/admin/years/${year.id}`} className="w-full">
          <Button variant={isClosed ? "secondary" : "primary"} className="w-full h-12 text-base font-bold rounded-xl shadow-sm">
            {isClosed ? "View Archive" : "Manage Cycle Progression"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AcademicYear["status"] }) {
  let colorClass = "";
  
  switch (status) {
    case "SETUP": colorClass = "bg-slate-100 text-slate-700 ring-1 ring-slate-200"; break;
    case "OPEN": colorClass = "bg-green-100 text-green-800 ring-1 ring-green-200"; break;
    case "REVIEW": colorClass = "bg-amber-100 text-amber-800 ring-1 ring-amber-200"; break;
    case "CLOSED": colorClass = "bg-slate-100 text-slate-500 ring-1 ring-slate-200"; break;
  }

  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${colorClass}`}>
      {status}
    </span>
  );
}

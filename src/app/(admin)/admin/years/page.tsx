"use client";

import { useYears } from "@/hooks/useYears";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AcademicYear } from "@/lib/interfaces/core";

export default function YearsPage() {
  const { years, isLoading, isError } = useYears();

  if (isLoading) {
    return <div className="p-8">Loading academic years...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load academic years. Please check your connection.</div>;
  }

  const activeYear = years.find((y) => y.status !== "CLOSED");
  const pastYears = years.filter((y) => y.status === "CLOSED");

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Years</h1>
          <p className="text-slate-500 mt-1">Manage cycles, setup forms, and monitor application windows.</p>
        </div>
        {!activeYear && (
          <Link
            href="/admin/setup/new"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 text-sm font-medium transition-colors gap-2"
          >
            <Plus className="w-4 h-4" />
            New Academic Year
          </Link>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Current Cycle</h2>
          {activeYear ? (
            <YearCard year={activeYear} />
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-8 text-center text-slate-500">
              No active academic year found. Start by creating a new setup.
            </div>
          )}
        </div>

        {pastYears.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Past Cycles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastYears.map((year) => (
                <YearCard key={year.id} year={year} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function YearCard({ year }: { year: AcademicYear }) {
  const isClosed = year.status === "CLOSED";
  
  return (
    <div className={`p-6 border rounded-xl shadow-sm ${isClosed ? "bg-slate-50" : "bg-white"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{year.label}</h3>
          <p className="text-sm text-slate-500 truncate max-w-xs">{year.description}</p>
        </div>
        <StatusBadge status={year.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <span className="text-slate-500 block mb-1">Opens</span>
          <span className="font-medium text-slate-800">
            {year.openDate && typeof year.openDate === "object" && "toDate" in year.openDate 
              ? year.openDate.toDate().toLocaleDateString() 
              : "Not set"}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block mb-1">Deadline</span>
          <span className="font-medium text-slate-800">
            {year.deadline && typeof year.deadline === "object" && "toDate" in year.deadline 
              ? year.deadline.toDate().toLocaleDateString() 
              : "Not set"}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant={isClosed ? "secondary" : "primary"} className="w-full">
          {isClosed ? "View Archive" : "Manage"}
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AcademicYear["status"] }) {
  let colorClass = "";
  
  switch (status) {
    case "SETUP": colorClass = "bg-slate-100 text-slate-700 border-slate-200"; break;
    case "OPEN": colorClass = "bg-green-100 text-green-800 border-green-200"; break;
    case "REVIEW": colorClass = "bg-blue-100 text-blue-800 border-blue-200"; break;
    case "CLOSED": colorClass = "bg-slate-100 text-slate-500 border-slate-200"; break;
  }

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colorClass}`}>
      {status}
    </span>
  );
}

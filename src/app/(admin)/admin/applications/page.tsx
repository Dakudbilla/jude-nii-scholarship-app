"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { authFetch } from "@/lib/api/authFetch";

// For brevity, using a simpler mapped table instead of fully bootstrapping @tanstack/react-table here, 
// though the architectural pattern is similar.

export default function AdminApplicationsPage() {
  const [filterStr, setFilterStr] = useState("");
  
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ["applications", "active"],
    queryFn: async () => {
      const res = await authFetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    }
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading applications...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Failed to load applications.</div>;

  const filteredApps = (applications || []).filter((app: any) => 
    app.studentId?.toLowerCase().includes(filterStr.toLowerCase()) || 
    app.personalInfo?.fullName?.toLowerCase().includes(filterStr.toLowerCase()) ||
    app.status?.toLowerCase().includes(filterStr.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Applications</h1>
          <p className="text-slate-500 mt-1">Review and score incoming applications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Export CSV</Button>
          <Button variant="secondary">Send Reminders</Button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex gap-4">
          <input 
            type="text" 
            placeholder="Search by name, ID, or status..." 
            className="flex h-10 w-full md:max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            value={filterStr}
            onChange={(e) => setFilterStr(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Applicant</th>
                <th className="px-6 py-4 font-semibold">Programme</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Blind ID</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app: any) => (
                  <tr key={app.id} className="border-b hover:bg-slate-50 hover:cursor-pointer transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{app.personalInfo?.fullName}</div>
                      <div className="text-slate-500 text-xs">{app.studentId} • {app.email}</div>
                    </td>
                    <td className="px-6 py-4">{app.academicInfo?.programme} (Yr {app.academicInfo?.year})</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === "ENDORSED" ? "bg-blue-100 text-blue-800" :
                        app.status === "PENDING_ENDORSEMENT" ? "bg-amber-100 text-amber-800" :
                        app.status === "AWARDED" ? "bg-green-100 text-green-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{app.blindId}</td>
                    <td className="px-6 py-4 text-right">
                     <Link href={`/admin/applications/${app.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-900 h-9 px-3 text-sm font-medium">Review</Link>
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

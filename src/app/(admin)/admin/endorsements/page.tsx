"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function AdminEndorsementsPage() {
  // In a real implementation we would fetch applications filtered by PENDING_ENDORSEMENT
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ["applications", "pending-endorsements"],
    queryFn: async () => {
      const res = await fetch("/api/applications"); // Should really be /api/endorsements but re-using 
      const json = await res.json();
      return (json.data || []).filter((a: any) => a.status === "PENDING_ENDORSEMENT");
    }
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading pending endorsements...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Failed to load.</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Endorsements</h1>
          <p className="text-slate-500 mt-1">Track wing head responses and pending approvals.</p>
        </div>
        <Button variant="secondary">Send Reminders to All Pending</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Applicant</th>
                <th className="px-6 py-4 font-semibold">Wing</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    No pending endorsements.
                  </td>
                </tr>
              ) : (
                applications?.map((app: any) => (
                  <tr key={app.id} className="border-b hover:bg-slate-50 hover:cursor-pointer transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{app.personalInfo?.fullName}</div>
                      <div className="text-slate-500 text-xs">{app.studentId} • {app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{app.wingSelection}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm">Remind Wing Head</Button>
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

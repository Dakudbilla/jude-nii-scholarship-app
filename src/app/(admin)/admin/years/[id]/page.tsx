"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useYears } from "@/hooks/useYears";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CycleTimeline } from "@/components/admin/years/CycleTimeline";
import { yearService } from "@/lib/services/client/yearService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, Rocket, CheckCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { YearStatus } from "@/lib/interfaces/core";

export default function CycleProgressionPage() {
  const params = useParams();
  const yearId = params.id as string;
  const queryClient = useQueryClient();
  const toast = useToast();
  const { years, isLoading, isError } = useYears();

  const year = years.find((y) => y.id === yearId);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "default";
    confirmLabel?: string;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  const closeConfirm = () => setConfirm((prev) => ({ ...prev, open: false }));

  const updateMutation = useMutation({
    mutationFn: (status: YearStatus) => yearService.updateStatus(yearId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.YEARS] });
      toast.success("Cycle status updated successfully.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-16 text-center">Loading cycle...</div>;
  if (isError || !year) return <div className="p-16 text-center text-red-500">Cycle not found.</div>;

  const currentStatus = year.status;
  const isMutating = updateMutation.isPending;

  const requestTransition = (status: YearStatus, title: string, description: string, variant: "danger" | "warning" | "default" = "default", confirmLabel = "Confirm") => {
    setConfirm({
      open: true,
      title,
      description,
      variant,
      confirmLabel,
      onConfirm: () => {
        updateMutation.mutate(status);
        closeConfirm();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <ConfirmDialog {...confirm} onCancel={closeConfirm} isLoading={isMutating} />

        <Link href="/admin/years" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Cycles
        </Link>

        <div>
          <div className="inline-block px-4 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-full ring-1 ring-slate-200 shadow-sm mb-4 tracking-widest uppercase">
            Cycle Progression
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">{year.label}</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium max-w-2xl">{year.description}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <CycleTimeline currentStatus={currentStatus} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Current Phase Actions</h2>

          {currentStatus === "SETUP" && (
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2">
                    <Rocket className="w-6 h-6" /> Ready for Launch
                  </h3>
                  <p className="text-blue-800 mt-2 font-medium max-w-lg">
                    This cycle is in setup mode. Opening the portal will make the application form visible to students.
                    <br /><br />
                    <strong>Note:</strong> Opening this cycle will automatically close any currently active cycles.
                  </p>
                </div>
                <Button
                  onClick={() => requestTransition("OPEN", "Open Application Portal", "Are you sure you want to open the portal? This will close any other active cycles.", "warning", "Open Portal")}
                  disabled={isMutating}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20 whitespace-nowrap"
                >
                  {isMutating ? "Opening..." : "Open Application Portal"}
                </Button>
              </div>
            </div>
          )}

          {currentStatus === "OPEN" && (
            <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-amber-900 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6" /> Form is Live
                  </h3>
                  <p className="text-amber-800 mt-2 font-medium max-w-lg">
                    Students are currently submitting applications. Advancing to the Review Phase will close the application form and lock submissions.
                  </p>
                </div>
                <Button
                  onClick={() => requestTransition("REVIEW", "Begin Review Phase", "Close the portal to students and begin the review phase?", "warning", "Begin Review")}
                  disabled={isMutating}
                  className="bg-amber-600 hover:bg-amber-700 text-white h-14 px-8 font-bold text-lg rounded-xl shadow-lg shadow-amber-600/20 whitespace-nowrap"
                >
                  {isMutating ? "Processing..." : "Begin Review Phase"}
                </Button>
              </div>
            </div>
          )}

          {currentStatus === "REVIEW" && (
            <div className="bg-purple-50 border border-purple-200 p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-purple-900 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" /> Review Ongoing
                  </h3>
                  <p className="text-purple-800 mt-2 font-medium max-w-lg">
                    Wing heads are endorsing, and admins are scoring and interviewing. Once all awards are finalized, archive this cycle.
                  </p>
                </div>
                <Button
                  onClick={() => requestTransition("CLOSED", "Archive Cycle", "Are you sure? This will permanently close the cycle.", "danger", "Finalize & Archive")}
                  disabled={isMutating}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-14 px-8 font-bold text-lg rounded-xl shadow-lg shadow-purple-600/20 whitespace-nowrap"
                >
                  {isMutating ? "Archiving..." : "Finalize & Archive Cycle"}
                </Button>
              </div>
            </div>
          )}

          {currentStatus === "CLOSED" && (
            <div className="bg-slate-100 border border-slate-200 p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Cycle Archived</h3>
              <p className="text-slate-500 font-medium max-w-lg mx-auto mb-6">
                This cycle has been finalized. All data is preserved for historical reporting.
              </p>
              <Button
                variant="secondary"
                onClick={() => requestTransition("REVIEW", "Re-open Cycle", "Are you absolutely sure you want to reopen an archived cycle? This may override currently active cycles.", "danger", "Emergency Re-open")}
                disabled={isMutating}
                className="font-bold border-slate-300 text-slate-600 hover:bg-white"
              >
                Emergency Re-open to Review Phase
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

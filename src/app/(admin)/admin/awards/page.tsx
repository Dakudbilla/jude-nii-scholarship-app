"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCycle } from "@/providers/CycleProvider";
import { apiClient } from "@/lib/api/apiClient";
import { dashboardService } from "@/lib/services/client/dashboardService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { Award, Users, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AdminAwardsPublishPage() {
  const router = useRouter();
  const { selectedCycle } = useCycle();
  const toast = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [publishResult, setPublishResult] = useState<{ count: number; publishedAt: string } | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD(selectedCycle?.id || ""),
    queryFn: () => dashboardService.getStats(selectedCycle!.id),
    enabled: !!selectedCycle,
  });

  const publishMutation = useMutation({
    mutationFn: () =>
      apiClient.post<{ count: number; publishedAt: string }>("/api/awards/publish", {
        yearId: selectedCycle!.id,
      }),
    onSuccess: (data) => {
      setPublishResult(data);
      setStep(3);
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setStep(1);
    },
  });

  if (!selectedCycle) {
    return (
      <div className="p-12 text-center text-slate-500">
        No academic cycle selected. Please select a cycle first.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto mt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-100">
          <Award className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Publish Awards</h1>
        <p className="text-slate-500 mt-2">
          Cycle: <span className="font-bold text-slate-700">{selectedCycle.label}</span>
        </p>
      </div>

      {step === 1 && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 space-y-6">
          {/* Stats preview */}
          {statsLoading ? (
            <div className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-5 rounded-2xl text-center">
                <div className="text-3xl font-extrabold text-purple-700">{stats.shortlisted}</div>
                <div className="text-sm text-purple-600 font-medium mt-1">Shortlisted for Interview</div>
              </div>
              <div className="bg-green-50 p-5 rounded-2xl text-center">
                <div className="text-3xl font-extrabold text-green-700">{stats.awarded}</div>
                <div className="text-sm text-green-600 font-medium mt-1">Already Awarded</div>
              </div>
            </div>
          ) : null}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-blue-800 text-sm font-medium leading-relaxed">
              Publishing awards will mark all <strong>Shortlisted for Interview</strong> applicants
              as <strong>Awarded</strong> and transition this cycle to <strong>CLOSED</strong>.
              This action cannot be undone.
            </p>
          </div>

          {stats?.shortlisted === 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-amber-800 text-sm font-medium">
                No applicants are currently shortlisted for interview. Move applicants to the
                &ldquo;Shortlisted for Interview&rdquo; status before publishing.
              </p>
            </div>
          )}

          <Button
            className="w-full h-14 text-lg font-bold rounded-xl"
            onClick={() => setStep(2)}
            disabled={!stats || stats.shortlisted === 0}
          >
            Begin Publishing Process
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <h2 className="text-2xl font-bold text-amber-900">Are you absolutely sure?</h2>
          </div>

          <div className="bg-white/70 rounded-2xl p-5 space-y-3 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
              <Users className="w-4 h-4" />
              <span>
                <strong>{stats?.shortlisted} applicants</strong> will be awarded and notified.
              </span>
            </div>
            <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
              <Award className="w-4 h-4" />
              <span>
                The <strong>{selectedCycle.label}</strong> cycle will be permanently closed.
              </span>
            </div>
          </div>

          <p className="text-amber-800 text-sm font-medium">
            This action cannot be undone. Official notifications will be recorded immediately.
          </p>

          <div className="flex gap-4 pt-2">
            <Button
              variant="ghost"
              className="flex-1 text-slate-700 border border-slate-200"
              onClick={() => setStep(1)}
              disabled={publishMutation.isPending}
            >
              Go Back
            </Button>
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => publishMutation.mutate()}
              isLoading={publishMutation.isPending}
            >
              Yes, Publish Awards Now
            </Button>
          </div>
        </div>
      )}

      {step === 3 && publishResult && (
        <div className="bg-green-50 border border-green-200 rounded-3xl shadow-sm p-8 space-y-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-green-900 mb-2">Awards Published!</h2>
            <p className="text-green-800 font-medium">
              <strong>{publishResult.count} scholarships</strong> have been awarded and the{" "}
              <strong>{selectedCycle.label}</strong> cycle is now closed.
            </p>
          </div>

          <div className="bg-white/70 rounded-2xl p-4 text-sm text-green-700 border border-green-100">
            Published at:{" "}
            {new Date(publishResult.publishedAt).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>

          <Button
            variant="ghost"
            className="text-slate-700 border border-slate-200"
            onClick={() => router.push("/admin/dashboard")}
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

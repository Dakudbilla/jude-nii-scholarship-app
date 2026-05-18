"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { applicationService } from "@/lib/services/client/applicationService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { ApplicationStageStepper } from "@/components/admin/applications/StageStepper";
import { StageControlPanel } from "@/components/admin/applications/StageControlPanel";
import { ApplicationStatus } from "@/lib/interfaces/core";
import type { PersonalInfo, AcademicInfo, FinancialInfo } from "@/lib/interfaces/application";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING_ENDORSEMENT: "Pending Endorsement",
  ENDORSED: "Endorsed",
  REJECTED_BY_WING: "Rejected by Wing",
  IN_REVIEW: "In Review",
  INTERVIEW: "Shortlisted for Interview",
  REJECTED: "Rejected",
  AWARDED: "Awarded",
};

export default function ApplicationReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const appId = params.id as string;

  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.APPLICATION(appId),
    queryFn: () => applicationService.getById(appId),
  });

  useEffect(() => {
    if (data?.myScore) {
      setCriteriaScores(data.myScore.criteriaScores || {});
      setComments(data.myScore.comments || "");
    } else if (data?.rubric) {
      const initScores: Record<string, number> = {};
      data.rubric.forEach((r) => (initScores[r.name] = 0));
      setCriteriaScores(initScores);
    }
  }, [data]);

  const scoreMutation = useMutation({
    mutationFn: () => applicationService.submitScore(appId, { criteriaScores, comments }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATION(appId) });
      toast.success("Score saved successfully!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ApplicationStatus) => applicationService.updateStatus(appId, status),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATION(appId) });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success(`Status updated to: ${STATUS_LABELS[status]}`);
      router.push("/admin/applications");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading application...</div>;
  if (isError || !data?.application) return <div className="p-12 text-center text-red-500">Failed to load application.</div>;

  const app = data.application;
  const rubric = data.rubric || [];
  const isBlind = data.isBlind;
  const personalInfo: PersonalInfo = app.personalInfo ?? {};
  const academicInfo: AcademicInfo = app.academicInfo ?? {};
  const financialInfo: FinancialInfo = app.financialInfo ?? {};

  const totalScore = Object.values(criteriaScores).reduce((a, b) => a + Number(b), 0);
  const potentialMaxScore = rubric.reduce((a, b) => a + Number(b.weight), 0);
  const isMutating = statusMutation.isPending || scoreMutation.isPending;

  return (
    <div className="p-8 space-y-6">
      <div className="mb-4">
        <Link href="/admin/applications" className="text-sm font-medium text-slate-500 hover:text-slate-800">
          ← Back to Applications
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          {isBlind ? (
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 font-mono bg-slate-100 px-3 py-1 rounded inline-block">
              {app.blindId || "ANON-????"}
            </h1>
          ) : (
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              {personalInfo.fullName}
            </h1>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-slate-500 text-sm font-medium">
              {isBlind ? "Student ID Hidden" : app.studentId} • {academicInfo.programme} (Yr {academicInfo.year})
            </span>
            {isBlind && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full ring-1 ring-indigo-200 font-bold uppercase tracking-wider">
                Blind Review Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stage Progress + Control Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Application Progress</h3>
        <ApplicationStageStepper status={app.status as ApplicationStatus} />
        <div className="mt-8 pt-8 border-t border-slate-100">
          <StageControlPanel
            app={app}
            onStatusChange={(status) => statusMutation.mutate(status)}
            isMutating={isMutating}
          />
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <DetailSection title="Financial Hardship">
            <div className="grid grid-cols-2 gap-6 text-sm mb-4">
              <InfoTile label="Sponsor Status" value={financialInfo.sponsorStatus} />
              <InfoTile label="Other Scholarship" value={financialInfo.hasOtherScholarship ? "Yes" : "No"} />
            </div>
            <EssayBlock label="Hardship Essay" text={financialInfo.hardshipEssay} />
          </DetailSection>

          <DetailSection title="Church Activeness">
            <EssayBlock label="Essay / Explanation" text={financialInfo.churchEssay} />
            {app.wingHeadComments && (
              <div className="mt-6">
                <span className="text-blue-600 block text-xs font-bold uppercase tracking-widest mb-3">
                  Wing Head Endorsement Comments
                </span>
                <p className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl text-blue-900 text-base leading-relaxed font-medium">
                  {app.wingHeadComments}
                </p>
              </div>
            )}
          </DetailSection>
        </div>

        {/* Right Column: Scorecard */}
        <div className="bg-white border text-left p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-8 self-start sticky top-8 border-primary/10">
          <h3 className="text-2xl font-extrabold tracking-tight text-primary mb-2 border-b border-slate-100 pb-4">
            Rubric Scorecard
          </h3>

          {rubric.length === 0 ? (
            <p className="text-slate-500 text-sm">No Rubric defined for this cycle.</p>
          ) : (
            <div className="space-y-8">
              {rubric.map((r) => (
                <div key={r.name} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <Label className="font-bold text-slate-800 text-base">{r.name}</Label>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-black rounded-lg">
                      {criteriaScores[r.name] || 0} / {r.weight}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{r.description}</p>
                  <input
                    type="range"
                    min="0"
                    max={r.weight}
                    value={criteriaScores[r.name] || 0}
                    onChange={(e) =>
                      setCriteriaScores((prev) => ({ ...prev, [r.name]: parseInt(e.target.value) }))
                    }
                    className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    disabled={scoreMutation.isPending}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="flex justify-between items-center text-lg bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="font-extrabold text-slate-700 tracking-wide uppercase text-sm">Total Score</span>
              <span className="font-black text-primary text-3xl">
                {totalScore} <span className="text-lg text-slate-400 font-bold">/ {potentialMaxScore}</span>
              </span>
            </div>

            <div className="space-y-3">
              <Label className="font-bold text-slate-700">Internal Reviewer Comments</Label>
              <textarea
                className="flex w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-4 py-3 text-sm min-h-[100px] outline-none resize-y"
                placeholder="Private notes..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={scoreMutation.isPending}
              />
            </div>

            <Button
              className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
              onClick={() => scoreMutation.mutate()}
              isLoading={scoreMutation.isPending}
            >
              {data?.myScore ? "Update Scorecard" : "Save Final Score"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Local presentational sub-components (pure display, no logic) ──────────

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 text-left p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
      <h3 className="text-2xl font-bold border-b border-slate-100 pb-4 text-slate-900 tracking-tight">{title}</h3>
      {children}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl">
      <span className="text-slate-500 block font-medium mb-1">{label}</span>
      <span className="font-bold text-lg text-slate-900">{value}</span>
    </div>
  );
}

function EssayBlock({ label, text }: { label: string; text?: string }) {
  return (
    <div>
      <span className="text-secondary block text-xs font-bold uppercase tracking-widest mb-3">{label}</span>
      <p className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-slate-700 text-base leading-relaxed italic">
        {text || <span className="text-slate-400 not-italic">Not provided.</span>}
      </p>
    </div>
  );
}

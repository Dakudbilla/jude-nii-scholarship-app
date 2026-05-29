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
import type { ReviewScore } from "@/lib/repositories/ReviewScoreRepository";
import { DetailSection, InfoTile, EssayBlock } from "@/components/admin/applications/ApplicationDetailSections";
import { getStatusConfig } from "@/lib/constants/statusConfig";
import { User, GraduationCap, DollarSign, Church, Star } from "lucide-react";

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
      setCriteriaScores(data.myScore.criteriaScores ?? {});
      setComments(data.myScore.comments ?? "");
    } else if (data?.rubric) {
      const initial: Record<string, number> = {};
      data.rubric.forEach((r) => (initial[r.name] = 0));
      setCriteriaScores(initial);
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
      toast.success(`Status updated to: ${getStatusConfig(status).label}`);
      router.push("/admin/applications");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading application...</div>;
  if (isError || !data?.application) return <div className="p-12 text-center text-red-500">Failed to load application.</div>;

  const app = data.application;
  const rubric = data.rubric ?? [];
  const isBlind = data.isBlind;
  const scores: ReviewScore[] = (data as { scores?: ReviewScore[] }).scores ?? [];
  const personalInfo = (app.personalInfo ?? {}) as PersonalInfo;
  const academicInfo = (app.academicInfo ?? {}) as AcademicInfo & { cwa?: number };
  const financialInfo = (app.financialInfo ?? {}) as FinancialInfo;

  const totalScore = Object.values(criteriaScores).reduce((a, b) => a + Number(b), 0);
  const maxScore = rubric.reduce((a, b) => a + Number(b.weight), 0);
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
              {app.blindId ?? "ANON-????"}
            </h1>
          ) : (
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              {personalInfo.fullName}
            </h1>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {!isBlind && (
              <span className="text-slate-500 text-sm font-medium">
                {app.studentId} • {app.email}
              </span>
            )}
            {isBlind && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full ring-1 ring-indigo-200 font-bold uppercase tracking-wider">
                Blind Review Active
              </span>
            )}
            {app.reviewScore != null && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full ring-1 ring-amber-200 font-bold">
                <Star className="w-3 h-3" /> Avg Score: {app.reviewScore} / {maxScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stage Progress + Control Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
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
        <div className="lg:col-span-2 space-y-8">

          {/* Personal Information */}
          {!isBlind && (
            <DetailSection title="Personal Information" icon={<User className="w-5 h-5 text-slate-400" />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <InfoTile label="Full Name"     value={personalInfo.fullName} />
                <InfoTile label="Date of Birth" value={personalInfo.dateOfBirth} />
                <InfoTile label="Gender"        value={personalInfo.gender} />
                <InfoTile label="Hometown"      value={personalInfo.hometown} />
                <InfoTile label="Phone Number"  value={personalInfo.phoneNumber} />
                <InfoTile label="Guardian Name" value={personalInfo.guardianName} />
                <InfoTile label="Guardian Phone" value={personalInfo.guardianPhone} />
              </div>
            </DetailSection>
          )}

          {/* Academic Information */}
          <DetailSection title="Academic Information" icon={<GraduationCap className="w-5 h-5 text-slate-400" />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <InfoTile label="Programme"    value={academicInfo.programme} />
              <InfoTile label="Year"         value={academicInfo.year ? `Year ${academicInfo.year}` : undefined} />
              <InfoTile label="Index Number" value={isBlind ? "Hidden" : (academicInfo.indexNumber ?? "—")} />
              <InfoTile label="Faculty"      value={academicInfo.faculty} />
              {academicInfo.cwa != null && <InfoTile label="CWA" value={String(academicInfo.cwa)} />}
            </div>
          </DetailSection>

          {/* Financial Hardship */}
          <DetailSection title="Financial Hardship" icon={<DollarSign className="w-5 h-5 text-slate-400" />}>
            <div className="grid grid-cols-2 gap-6 text-sm mb-4">
              <InfoTile label="Sponsor Status"    value={financialInfo.sponsorStatus} />
              <InfoTile label="Other Scholarship" value={financialInfo.hasOtherScholarship ? "Yes" : "No"} />
            </div>
            <EssayBlock label="Hardship Essay" text={financialInfo.hardshipEssay} />
          </DetailSection>

          {/* Church Activeness */}
          <DetailSection title="Church Activeness" icon={<Church className="w-5 h-5 text-slate-400" />}>
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

          {/* All Reviewer Scores */}
          {scores.length > 0 && (
            <DetailSection title="All Reviewer Scores" icon={<Star className="w-5 h-5 text-slate-400" />}>
              <div className="space-y-3">
                {scores.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{s.adminName}</div>
                      {s.comments && <div className="text-slate-500 text-xs mt-1 italic">{s.comments}</div>}
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-black rounded-lg">
                      {s.totalScore} / {maxScore}
                    </span>
                  </div>
                ))}
                {scores.length > 1 && (
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="font-bold text-amber-800 text-sm uppercase tracking-wider">Average Score</span>
                    <span className="px-3 py-1 bg-amber-200 text-amber-900 text-sm font-black rounded-lg">
                      {(scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length).toFixed(1)} / {maxScore}
                    </span>
                  </div>
                )}
              </div>
            </DetailSection>
          )}
        </div>

        {/* Scorecard (sticky right column) */}
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
                      {criteriaScores[r.name] ?? 0} / {r.weight}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{r.description}</p>
                  <input
                    type="range"
                    min="0"
                    max={r.weight}
                    value={criteriaScores[r.name] ?? 0}
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
                {totalScore} <span className="text-lg text-slate-400 font-bold">/ {maxScore}</span>
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
              disabled={rubric.length === 0}
            >
              {data?.myScore ? "Update Scorecard" : "Save Final Score"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authFetch } from "@/lib/api/authFetch";

export default function ApplicationReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const appId = params.id as string;

  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["application", appId],
    queryFn: async () => {
      const res = await authFetch(`/api/applications/${appId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return json.data;
    }
  });

  // Pre-fill score if exists
  useEffect(() => {
    if (data?.myScore) {
      setCriteriaScores(data.myScore.criteriaScores || {});
      setComments(data.myScore.comments || "");
    } else if (data?.rubric) {
      const initScores: Record<string, number> = {};
      data.rubric.forEach((r: any) => initScores[r.name] = 0);
      setCriteriaScores(initScores);
    }
  }, [data]);

  const scoreMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`/api/applications/${appId}/score`, {
        method: "POST",
        body: JSON.stringify({ criteriaScores, comments })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", appId] });
      alert("Score saved successfully!");
    },
    onError: (e: any) => alert(e.message)
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      // Missing proper endpoint for changing status but mocking implementation here
      // Real app has `api/applications/...`
      alert("Application status mapped to: " + status);
      router.push("/admin/applications");
    }
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading application...</div>;
  if (isError || !data?.application) return <div className="p-12 text-center text-red-500">Failed to load application.</div>;

  const app = data.application;
  const rubric = data.rubric || [];
  const isBlind = data.isBlind;

  const totalScore = Object.values(criteriaScores).reduce((a, b) => a + Number(b), 0);
  const potentialMaxScore = rubric.reduce((a: number, b: any) => a + Number(b.weight), 0);

  return (
    <div className="p-8 space-y-6">
      
      <div className="mb-4">
        <Link href="/admin/applications" className="text-sm font-medium text-slate-500 hover:text-slate-800">
          &larr; Back to Applications
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          {isBlind ? (
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1 font-mono">{app.blindId || "ANON-8822"}</h1>
          ) : (
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{app.personalInfo?.fullName}</h1>
          )}
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md shadow-sm border font-semibold">
              {app.status}
            </span>
            <span className="text-slate-500 text-sm">
              {isBlind ? "Student ID Hidden" : app.studentId} • {app.academicInfo?.programme} (Yr {app.academicInfo?.year})
            </span>
            {isBlind && <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded border font-semibold">BLIND REVIEW ACTIVE</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => statusMutation.mutate("REJECTED")}>Reject</Button>
          <Button variant="secondary" onClick={() => statusMutation.mutate("INTERVIEW")}>Shortlist for Interview</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Data */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border text-left p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Financial Hardship</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
               <div><span className="text-slate-500 block">Sponsor Status</span><span className="font-semibold">{app.financialInfo?.sponsorStatus}</span></div>
               <div><span className="text-slate-500 block">Other Scholarship</span><span className="font-semibold">{app.financialInfo?.hasOtherScholarship ? "Yes" : "No"}</span></div>
            </div>
            <div>
              <span className="text-slate-500 block text-xs font-semibold uppercase tracking-wider mb-2">Hardship Essay</span>
              <p className="bg-slate-50 border p-4 rounded-md text-slate-700 text-sm italic">{app.financialInfo?.hardshipEssay}</p>
            </div>
          </div>

          <div className="bg-white border text-left p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Church Activeness</h3>
            <div>
              <span className="text-slate-500 block text-xs font-semibold uppercase tracking-wider mb-2">Essay / Explanation</span>
              <p className="bg-slate-50 border p-4 rounded-md text-slate-700 text-sm italic">{app.financialInfo?.churchEssay}</p>
            </div>
            {app.wingHeadComments && (
              <div className="mt-4">
                <span className="text-amber-600 block text-xs font-semibold uppercase tracking-wider mb-2">Wing Head Secret Endorsement Comments</span>
                <p className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-900 text-sm font-medium">{app.wingHeadComments}</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Scorecard */}
        <div className="bg-white border text-left p-6 rounded-xl shadow-sm space-y-6 self-start sticky top-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Rubric Scorecard</h3>
          
          {rubric.length === 0 ? (
            <p className="text-slate-500 text-sm">No Rubric defined for this cycle.</p>
          ) : (
            <div className="space-y-6">
              {rubric.map((r: any) => (
                <div key={r.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Label className="font-semibold text-slate-800">{r.name}</Label>
                    <span className="text-xs font-bold text-slate-500">{criteriaScores[r.name] || 0} / {r.weight}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{r.description}</p>
                  <input 
                    type="range" 
                    min="0" 
                    max={r.weight} 
                    value={criteriaScores[r.name] || 0}
                    onChange={(e) => setCriteriaScores({ ...criteriaScores, [r.name]: parseInt(e.target.value) })}
                    className="w-full accent-slate-900"
                    disabled={scoreMutation.isPending}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-slate-700">Total Score</span>
              <span className="font-bold text-slate-900 text-2xl">{totalScore} <span className="text-base text-slate-400 font-normal">/ {potentialMaxScore}</span></span>
            </div>
            
            <div className="space-y-2">
              <Label>Internal Reviewer Comments</Label>
              <textarea 
                className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px]"
                placeholder="Private notes..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={scoreMutation.isPending}
              />
            </div>

            <Button className="w-full" onClick={() => scoreMutation.mutate()} isLoading={scoreMutation.isPending}>
              {data?.myScore ? "Update Scorecard" : "Save Final Score"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

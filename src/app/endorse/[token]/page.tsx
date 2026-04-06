"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EndorsementPortalPage() {
  const params = useParams();
  const token = params.token as string;
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: application, isLoading, isError, error } = useQuery({
    queryKey: ["endorsement", token],
    queryFn: async () => {
      const res = await fetch(`/api/endorse/${token}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to load application");
      return json.data;
    },
    enabled: !!token,
    retry: false, // Don't retry so we show 404 immediately
  });

  const endorseMutation = useMutation({
    mutationFn: async (decision: "ENDORSED" | "REJECTED_BY_WING") => {
      const res = await fetch(`/api/endorse/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, comments })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Action failed");
      return json.data;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: any) => {
      alert("Error: " + err.message);
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading secure portal...</div>;
  }

  if (isError || submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-xl border shadow-sm max-w-md w-full text-center">
          {submitted ? (
            <>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Decision Submitted</h2>
              <p className="text-slate-600">Thank you for endorsing/reviewing this applicant. You may now close this window.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Link Invalid or Expired</h2>
              <p className="text-slate-500 text-sm">
                {(error as Error)?.message || "This endorsement link has already been processed, expired, or does not exist."}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Applicant Endorsement</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            You have securely logged in as a Wing Head. Please review the applicant's record of church activeness and provide your honest endorsement.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border shadow-sm space-y-8">
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-b pb-8">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Name</span>
              <span className="text-lg font-medium text-slate-900">{application.studentName}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Reference</span>
              <span className="text-lg font-medium text-slate-900">{application.studentId}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Programme of Study</span>
              <span className="text-lg font-medium text-slate-900">{application.programme}</span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="block text-sm font-semibold text-slate-800">Applicant's Church Activeness Essay</span>
            <div className="bg-slate-50 p-4 rounded-md border text-slate-700 italic leading-relaxed text-sm">
              "{application.churchEssay}"
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <span className="block text-sm font-semibold text-slate-800">Your Optional Comments (Visible to Reviewers)</span>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="E.g., They are highly dedicated and attend meetings regularly..."
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[100px]"
              disabled={endorseMutation.isPending}
            />
          </div>

          <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
            <Button 
              variant="soft-warning" 
              className="flex-1" 
              onClick={() => endorseMutation.mutate("REJECTED_BY_WING")}
              isLoading={endorseMutation.isPending}
            >
              Decline Endorsement
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700" 
              onClick={() => endorseMutation.mutate("ENDORSED")}
              isLoading={endorseMutation.isPending}
            >
              Officially Endorse Applicant
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

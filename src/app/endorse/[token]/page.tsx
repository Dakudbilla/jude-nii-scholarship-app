"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck, XCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

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
    onError: (err: Error) => {
      alert("Error: " + err.message);
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 uppercase tracking-widest font-black text-slate-400">Loading Secure Portal...</div>;
  }

  if (isError || submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 noise relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] max-w-lg w-full text-center relative z-10">
          {submitted ? (
            <>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
                <ShieldCheck className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Decision Recorded</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Thank you. Your endorsement decision has been securely saved and the scholarship committee has been notified.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-sm"
              >
                Return to Home
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Link Invalid or Expired</h2>
              <p className="text-slate-500 font-medium mb-8">
                {(error as Error)?.message || "This endorsement link has already been used, expired, or does not exist."}
              </p>
              <p className="text-xs text-slate-400">
                If you believe this is an error, please contact the scholarship administrator to request a new link.
              </p>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-50 py-16 px-4 sm:px-6 relative noise overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white text-slate-800 text-sm font-bold rounded-full ring-1 ring-slate-200 shadow-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-green-600" /> Secure Wing Head Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Applicant Endorsement</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg">
            Please review the applicant&apos;s record of church activeness below and provide your honest endorsement.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary" />
          
          {/* Student Info Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-lg">Applicant Identity</h3>
             </div>
             <div className="grid sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</span>
                  <span className="text-lg font-extrabold text-slate-900">{application.studentName}</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Ref Number</span>
                  <span className="text-lg font-extrabold text-slate-900">{application.studentId}</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Programme</span>
                  <span className="text-base font-bold text-slate-900">{application.programme}</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Year of Study</span>
                  <span className="text-base font-bold text-slate-900">{application.year ? `Year ${application.year}` : "—"}</span>
                </div>
                {application.wingName && (
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Selected Wing</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-bold ring-1 ring-secondary/20">
                      {application.wingName}
                    </span>
                  </div>
                )}
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
               <FileText className="w-5 h-5 text-primary" />
               <span className="block font-bold text-lg text-slate-800">Applicant&apos;s Church Activeness Statement</span>
            </div>
            <div className="bg-slate-50/80 p-8 rounded-2xl border border-slate-200 text-slate-700 italic leading-relaxed text-base shadow-inner">
              &ldquo;{application.churchEssay || "The applicant did not provide a statement."}&rdquo;
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <span className="block font-bold mt-4 text-slate-800">Your Optional Comments <span className="text-slate-400 font-normal">(Visible only to Reviewers)</span></span>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="E.g., They are highly dedicated and attend meetings regularly..."
              className="input-premium flex w-full min-h-[120px] resize-y p-4"
              disabled={endorseMutation.isPending}
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button 
               variant="ghost"
               className="flex-1 h-14 text-lg font-bold rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" 
               onClick={() => endorseMutation.mutate("REJECTED_BY_WING")}
               isLoading={endorseMutation.isPending}
               disabled={endorseMutation.isPending}
            >
               Decline Applicant
            </Button>
            <Button 
               className="flex-1 h-14 text-lg font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20" 
               onClick={() => endorseMutation.mutate("ENDORSED")}
               isLoading={endorseMutation.isPending}
               disabled={endorseMutation.isPending}
            >
               Officially Endorse
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

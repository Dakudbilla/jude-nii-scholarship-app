"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Search, GraduationCap } from "lucide-react";

export default function StatusPage() {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  
  const statusMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, email })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to check status");
      return json.data;
    }
  });

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case "PENDING_ENDORSEMENT": return { text: "Waiting for Wing Head Endorsement", style: "badge-pending" };
      case "ENDORSED": return { text: "Endorsed. Waiting for Review.", style: "badge-endorsed" };
      case "REJECTED_BY_WING": return { text: "Application Denied by Wing Head", style: "badge-rejected" };
      case "IN_REVIEW": return { text: "Currently Being Reviewed", style: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200" };
      case "INTERVIEW": return { text: "Shortlisted for Interview", style: "badge-interview" };
      case "REJECTED": return { text: "Not Selected This Cycle", style: "bg-slate-100 text-slate-700 ring-1 ring-slate-200" };
      case "AWARDED": return { text: "Congratulations! You have been awarded.", style: "badge-awarded" };
      default: return { text: "Unknown Status", style: "badge-default" };
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 py-12 px-4 sm:px-6 flex flex-col items-center noise">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full max-w-3xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 mb-8 mt-12">
        <Link href="/apply" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm ring-1 ring-slate-200/50">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>
      </div>

      {!statusMutation.data ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.04)] max-w-md w-full relative">
          <div className="mb-8">
             <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-slate-100">
               <Search className="w-6 h-6 text-slate-600" />
             </div>
             <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Track Status</h1>
             <p className="text-slate-500 text-base font-medium">Verify your application state using your credentials.</p>
          </div>
          
          {statusMutation.isError && (
            <div className="bg-red-50 text-red-800 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-100">
               {statusMutation.error.message}
            </div>
          )}
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (studentId && email) statusMutation.mutate();
            }} 
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Student ID or Ref Number</Label>
              <Input 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                placeholder="e.g. 20600000" 
                disabled={statusMutation.isPending}
                className="input-premium"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Application Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@edu.gh" 
                disabled={statusMutation.isPending}
                className="input-premium"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full h-14 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20" isLoading={statusMutation.isPending}>
                Track Submission
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] max-w-lg w-full text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Status Report</h2>
          
          {statusMutation.data.exists ? (
            <div className="space-y-6 pt-4 border-t border-b border-slate-100 py-8">
              <div className="flex justify-between items-center text-base bg-slate-50 p-4 rounded-2xl">
                 <span className="text-slate-500 font-medium">Applicant ID:</span>
                 <span className="font-bold text-slate-900">{studentId}</span>
              </div>
              <div className="flex justify-between items-center text-base bg-slate-50 p-4 rounded-2xl">
                 <span className="text-slate-500 font-medium">Academic Cycle:</span>
                 <span className="font-bold text-slate-900">{statusMutation.data.yearLabel}</span>
              </div>
              
              <div className="pt-6">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-black mb-4">Pipeline Status</div>
                <div className={`px-6 py-4 rounded-2xl text-lg font-bold shadow-sm ${getStatusDisplay(statusMutation.data.status).style}`}>
                   {getStatusDisplay(statusMutation.data.status).text}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-900 p-8 rounded-2xl border border-amber-200 text-left">
              <div className="flex gap-4 items-start">
                 <GraduationCap className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
                 <div>
                    <h4 className="font-bold text-lg mb-2">No Final Submission Found</h4>
                    <p className="text-amber-800/80 font-medium leading-relaxed">
                      We couldn't find a submitted application in the active cycle for these credentials. If you started a draft, please return to the Application Portal to complete and submit it.
                    </p>
                 </div>
              </div>
            </div>
          )}
          
          <Button variant="ghost" className="h-12 px-6 font-bold text-slate-500 hover:text-slate-800 rounded-xl" onClick={() => statusMutation.reset()}>Check Another</Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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
      case "PENDING_ENDORSEMENT": return { text: "Waiting for Wing Head Endorsement", color: "text-amber-600 bg-amber-50 border-amber-200" };
      case "ENDORSED": return { text: "Endorsed. Waiting for Review.", color: "text-blue-600 bg-blue-50 border-blue-200" };
      case "REJECTED_BY_WING": return { text: "Application Denied by Wing Head", color: "text-red-600 bg-red-50 border-red-200" };
      case "IN_REVIEW": return { text: "Currently Being Reviewed", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
      case "INTERVIEW": return { text: "Shortlisted for Interview", color: "text-purple-600 bg-purple-50 border-purple-200" };
      case "REJECTED": return { text: "Not Selected This Cycle", color: "text-slate-600 bg-slate-100 border-slate-300" };
      case "AWARDED": return { text: "Congratulations! You have been awarded.", color: "text-green-700 bg-green-50 border-green-300" };
      default: return { text: "Unknown Status", color: "text-slate-600 bg-slate-50 border-slate-200" };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 flex flex-col items-center">
      <div className="mb-8">
        <Link href="/apply" className="text-sm font-medium text-slate-500 hover:text-slate-800">
          &larr; Back to Portal
        </Link>
      </div>

      {!statusMutation.data ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Check Application Status</h1>
          <p className="text-slate-500 text-sm mb-6">Enter the credentials you used to submit your application.</p>
          
          {statusMutation.isError && (
            <div className="bg-red-50 text-red-800 text-sm p-3 rounded mb-4">
              {statusMutation.error.message}
            </div>
          )}
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (studentId && email) statusMutation.mutate();
            }} 
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Student Reference / Index Number</Label>
              <Input 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                placeholder="20600000" 
                disabled={statusMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@edu.gh" 
                disabled={statusMutation.isPending}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={statusMutation.isPending}>
              View Status
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-lg w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Application Found</h2>
          
          {statusMutation.data.exists ? (
            <div className="space-y-4 pt-4 border-t border-b py-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Applicant ID:</span>
                <span className="font-semibold">{studentId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Cycle:</span>
                <span className="font-semibold">{statusMutation.data.yearLabel}</span>
              </div>
              
              <div className="pt-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Current Pipeline Status</div>
                <div className={`px-4 py-3 rounded-md border font-medium ${getStatusDisplay(statusMutation.data.status).color}`}>
                   {getStatusDisplay(statusMutation.data.status).text}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-amber-800 bg-amber-50 border p-4 rounded-md">
              <p>No submitted application found for these credentials in the active cycle. If you only started a draft, please return to the Application Portal to complete and submit it.</p>
            </div>
          )}
          
          <Button variant="ghost" onClick={() => statusMutation.reset()}>Check Another</Button>
        </div>
      )}
    </div>
  );
}

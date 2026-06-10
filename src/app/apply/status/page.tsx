"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Search, GraduationCap } from "lucide-react";
import { draftService } from "@/lib/services/client/draftService";
import { getStatusConfig } from "@/lib/constants/statusConfig";

export default function StatusPage() {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");

  const statusMutation = useMutation({
    mutationFn: () => draftService.checkStatus(studentId, email),
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">

      {/* Header */}
      <header className="px-5 sm:px-8 py-4 border-b border-slate-200 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-bold tracking-tight text-primary leading-none">Jude Nii</p>
            <p className="text-[9px] tracking-[0.22em] uppercase text-slate-400 font-semibold mt-0.5">Scholarship Fund</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-5 py-14">

        {!statusMutation.data ? (
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-primary tracking-tight mb-1.5">
                Track Your Application
              </h1>
              <p className="text-slate-500 text-sm">
                Enter your credentials to check your application status.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]">
              {statusMutation.isError && (
                <div className="bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl mb-5 border border-red-100">
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
                <div className="space-y-1.5">
                  <Label className="font-semibold text-slate-700 text-sm">Student ID or Reference Number</Label>
                  <Input
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 20600000"
                    disabled={statusMutation.isPending}
                    className="input-premium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-semibold text-slate-700 text-sm">Application Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@edu.gh"
                    disabled={statusMutation.isPending}
                    className="input-premium"
                  />
                </div>
                <div className="pt-1">
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-white transition-colors"
                    isLoading={statusMutation.isPending}
                  >
                    Check Status
                  </Button>
                </div>
              </form>
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              Need help?{" "}
              <Link href="/apply" className="text-slate-500 hover:text-primary transition-colors underline underline-offset-2">
                Return to portal
              </Link>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]">
              {/* Top accent */}
              <div className="h-1 bg-primary w-full" />

              <div className="p-8 sm:p-10 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-primary">Status Report</h2>

                {statusMutation.data.exists ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-medium">Applicant ID</span>
                        <span className="font-bold text-primary text-sm">{studentId}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-medium">Academic Cycle</span>
                        <span className="font-bold text-primary text-sm">{statusMutation.data.yearLabel}</span>
                      </div>
                    </div>

                    {statusMutation.data.status && (() => {
                      const cfg = getStatusConfig(statusMutation.data.status!);
                      return (
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">
                            Pipeline Status
                          </p>
                          <div className={`px-5 py-3.5 rounded-xl text-sm font-bold ${cfg.badgeClass}`}>
                            {cfg.label}
                          </div>
                          <p className="text-slate-500 text-xs mt-2.5 font-medium leading-relaxed">{cfg.description}</p>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 text-amber-900 p-6 rounded-xl">
                    <div className="flex gap-4 items-start">
                      <GraduationCap className="w-7 h-7 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-base mb-1.5">No Submission Found</h4>
                        <p className="text-amber-800/80 text-sm leading-relaxed">
                          We couldn&apos;t find a submitted application for these credentials in the active cycle.
                          If you started a draft, return to the portal to complete and submit it.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => statusMutation.reset()}
                    className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Check Another
                  </button>
                  <Link
                    href="/"
                    className="flex-1 h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { draftService } from "@/lib/services/client/draftService";
import { publicClient } from "@/lib/api/publicClient";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApplicantLogin } from "@/components/apply/ApplicantLogin";
import { Step1Personal } from "@/components/apply/Step1Personal";
import { Step2Academic } from "@/components/apply/Step2Academic";
import { Step3Financial } from "@/components/apply/Step3Financial";
import { Step4Submit } from "@/components/apply/Step4Submit";
import type { AcademicYear } from "@/lib/interfaces/core";

const STEP_TITLES = ["Personal Info", "Academic Record", "Financial & Essays", "Declaration & Endorse"];

export default function ApplicationFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [applicantAuth, setApplicantAuth] = useState<{ studentId: string; email: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: activeYear, isLoading: yearIsLoading } = useQuery({
    queryKey: [QUERY_KEYS.ACTIVE_YEAR],
    queryFn: () => publicClient.get<AcademicYear>(API_ENDPOINTS.years.active()),
  });

  const { data: draft, isLoading: draftIsLoading } = useQuery({
    queryKey: QUERY_KEYS.DRAFT(applicantAuth?.studentId),
    enabled: !!applicantAuth && !!activeYear?.id,
    queryFn: () =>
      draftService.load(activeYear!.id, applicantAuth!.studentId, applicantAuth!.email),
  });

  const saveMutation = useMutation({
    mutationFn: (updateData: Record<string, unknown>) =>
      draftService.save(activeYear!.id, applicantAuth!.studentId, applicantAuth!.email, updateData as Partial<import("@/lib/interfaces/core").ApplicationDraft>),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DRAFT(applicantAuth?.studentId) }),
  });

  const submitMutation = useMutation({
    mutationFn: (wingId: string) =>
      draftService.submit(activeYear!.id, applicantAuth!.studentId, {
        ...draft,
        wingSelection: wingId,
      }),
    onSuccess: () => {
      router.push("/apply/status");
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  if (yearIsLoading) {
    return <div className="p-12 text-center text-slate-500">Loading secure portal...</div>;
  }
  if (!activeYear || activeYear.status !== "OPEN") {
    return <div className="p-12 text-center text-red-500">Portal is closed.</div>;
  }
  if (!applicantAuth) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 px-6">
        <ApplicantLogin activeYearId={activeYear.id} onLogin={setApplicantAuth} />
      </div>
    );
  }
  if (draftIsLoading || !draft) {
    return <div className="p-12 text-center text-slate-500">Loading your draft securely...</div>;
  }

  const currentStep: number = draft.currentStep || 1;
  const isSaving = saveMutation.isPending;
  const isSubmitting = submitMutation.isPending;

  const handleStepSave = (data: Record<string, unknown>, next: number) => {
    setSubmitError(null);
    saveMutation.mutate({ ...data, currentStep: next });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">Application Form</h1>
            <p className="text-slate-500 text-base mt-2 font-medium">
              Logged in via: <span className="text-slate-700">{applicantAuth.studentId}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/")} className="font-bold text-slate-400 hover:text-slate-700 h-10 px-4 rounded-xl text-sm">
              ← Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => setApplicantAuth(null)}
              className="font-bold border border-slate-200 bg-white hover:bg-slate-50 h-10 px-6 rounded-xl text-slate-600"
            >
              Save &amp; Exit
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            {STEP_TITLES.map((title, idx) => (
              <div
                key={title}
                className={`text-xs font-bold uppercase tracking-wider text-center flex-1 ${
                  currentStep === idx + 1
                    ? "text-primary"
                    : currentStep > idx + 1
                    ? "text-secondary"
                    : "text-slate-400"
                }`}
              >
                <span className="hidden sm:inline">{title}</span>
                <span className="sm:hidden">Step {idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 h-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 rounded-full transition-colors duration-500 ${
                  step === currentStep
                    ? "bg-primary shadow-[0_0_15px_-3px_rgba(30,58,138,0.4)]"
                    : step < currentStep
                    ? "bg-secondary"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {submitError && (
            <div className="bg-red-50 text-red-800 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-100">
              {submitError}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-2xl font-bold mb-8 text-slate-900 border-b border-slate-100 pb-4">
                {STEP_TITLES[currentStep - 1]}
              </h2>

              {currentStep === 1 && (
                <Step1Personal
                  savedData={draft.personalInfo}
                  isLoading={isSaving}
                  onSaveAndNext={(d) => handleStepSave({ personalInfo: d }, 2)}
                />
              )}
              {currentStep === 2 && (
                <Step2Academic
                  savedData={draft.academicInfo}
                  isLoading={isSaving}
                  onBack={() => saveMutation.mutate({ currentStep: 1 })}
                  onSaveAndNext={(d) => handleStepSave({ academicInfo: d }, 3)}
                />
              )}
              {currentStep === 3 && (
                <Step3Financial
                  savedData={draft.financialInfo}
                  isLoading={isSaving}
                  onBack={() => saveMutation.mutate({ currentStep: 2 })}
                  onSaveAndNext={(d) => handleStepSave({ financialInfo: d }, 4)}
                />
              )}
              {currentStep === 4 && (
                <Step4Submit
                  savedWingId={draft.wingSelection}
                  activeYearId={activeYear.id}
                  isLoading={isSubmitting || isSaving}
                  onBack={() => saveMutation.mutate({ currentStep: 3 })}
                  onSubmit={(d) =>
                    saveMutation.mutate(
                      { wingSelection: d.wingId },
                      { onSuccess: () => submitMutation.mutate(d.wingId) }
                    )
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

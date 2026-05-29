"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Step2Wings } from "@/components/admin/setup/Step2Wings";
import { Step3Rubric } from "@/components/admin/setup/Step3Rubric";
import { Step4Templates } from "@/components/admin/setup/Step4Templates";
import { auth } from "@/lib/firebase/client";
import { useToast } from "@/components/ui/toast";

// ── Step 1 schema ─────────────────────────────────────────────────────────────
const basicsSchema = z.object({
  label:       z.string().min(3, "Example: '2025/2026'"),
  openDate:    z.string().min(1, "Open date is required"),
  deadline:    z.string().min(1, "Deadline is required"),
  description: z.string().min(10, "Please provide a short description"),
});
type BasicsFormValues = z.infer<typeof basicsSchema>;

// ── Wizard state ──────────────────────────────────────────────────────────────
interface WizardData {
  basics?:    BasicsFormValues;
  wings?:     unknown[];
  rubric?:    unknown[];
  templates?: unknown;
}

const TOTAL_STEPS = 5;

export default function SetupWizardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});

  const goToYears = () => router.push("/admin/years");

  const createYearMutation = useMutation({
    mutationFn: async (launchStatus: "SETUP" | "OPEN") => {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const res = await fetch("/api/years/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...wizardData, status: launchStatus }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || "Failed to create academic year");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] });
      toast.success("Academic year created successfully.");
      goToYears();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Step 1 form ──────────────────────────────────────────────────────────────
  const { register, handleSubmit, formState: { errors } } = useForm<BasicsFormValues>({
    resolver: zodResolver(basicsSchema),
    defaultValues: wizardData.basics,
  });

  const isPending = createYearMutation.isPending;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Setup Academic Year</h1>
        <p className="text-slate-500 mt-1">Configure the new scholarship cycle step by step.</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full transition-colors ${
              step === currentStep ? "bg-slate-900" : step < currentStep ? "bg-slate-400" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        {/* ── Step 1 ── */}
        {currentStep === 1 && (
          <form
            onSubmit={handleSubmit((data) => {
              setWizardData((prev) => ({ ...prev, basics: data }));
              setCurrentStep(2);
            })}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-slate-800">Step 1: Year Basics</h2>

            <div className="space-y-2">
              <Label htmlFor="label">Academic Year Label</Label>
              <Input id="label" placeholder="2025/2026" {...register("label")} className={errors.label ? "border-red-500" : ""} />
              {errors.label && <p className="text-sm text-red-500">{errors.label.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openDate">Application Open Date</Label>
                <Input id="openDate" type="date" {...register("openDate")} className={errors.openDate ? "border-red-500" : ""} />
                {errors.openDate && <p className="text-sm text-red-500">{errors.openDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" type="date" {...register("deadline")} className={errors.deadline ? "border-red-500" : ""} />
                {errors.deadline && <p className="text-sm text-red-500">{errors.deadline.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Public Description</Label>
              <textarea
                id="description"
                {...register("description")}
                className={`flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 ${errors.description ? "border-red-500" : ""}`}
                placeholder="Shown on the landing page for applicants..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="ghost" onClick={goToYears}>Cancel</Button>
              <Button type="submit">Next Step</Button>
            </div>
          </form>
        )}

        {/* ── Steps 2-4 (extracted components) ── */}
        {currentStep === 2 && (
          <Step2Wings
            initialData={wizardData.wings ? { wings: wizardData.wings as Array<{ name: string; headName: string; headPhone: string; headEmail: string }> } : undefined}
            onNext={(data) => { setWizardData((prev) => ({ ...prev, wings: data.wings })); setCurrentStep(3); }}
            onBack={() => setCurrentStep(1)}
            onCancel={goToYears}
          />
        )}
        {currentStep === 3 && (
          <Step3Rubric
            initialData={wizardData.rubric ? { criteria: wizardData.rubric as Array<{ name: string; weight: number; description: string }> } : undefined}
            onNext={(data) => { setWizardData((prev) => ({ ...prev, rubric: data.criteria })); setCurrentStep(4); }}
            onBack={() => setCurrentStep(2)}
            onCancel={goToYears}
          />
        )}
        {currentStep === 4 && (
          <Step4Templates
            initialData={wizardData.templates as { endorsementRequest: string; dailyReminder: string; applicantConfirmation: string } | undefined}
            onNext={(data) => { setWizardData((prev) => ({ ...prev, templates: data })); setCurrentStep(5); }}
            onBack={() => setCurrentStep(3)}
            onCancel={goToYears}
          />
        )}

        {/* ── Step 5: Review & Launch ── */}
        {currentStep === 5 && (
          <div className="py-12 text-center text-slate-800 space-y-6">
            <h2 className="text-xl font-bold">Review &amp; Launch</h2>
            <p className="text-slate-500">All configurations are set. Launch immediately or save as setup for later.</p>

            <div className="bg-slate-50 border p-4 rounded-md text-left text-sm max-w-sm mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Label:</span>
                <span className="font-semibold">{wizardData.basics?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wings:</span>
                <span className="font-semibold">{(wizardData.wings as unknown[])?.length ?? 0} configured</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rubric:</span>
                <span className="font-semibold">{(wizardData.rubric as unknown[])?.length ?? 0} criteria</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <Button variant="ghost" className="text-slate-400 text-xs" onClick={goToYears} disabled={isPending}>
                Cancel
              </Button>
              <Button variant="ghost" onClick={() => setCurrentStep(4)} disabled={isPending}>
                ← Back
              </Button>
              <Button variant="secondary" onClick={() => createYearMutation.mutate("SETUP")} disabled={isPending} isLoading={isPending}>
                Save as SETUP
              </Button>
              <Button onClick={() => createYearMutation.mutate("OPEN")} disabled={isPending} isLoading={isPending}>
                Launch (OPEN)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

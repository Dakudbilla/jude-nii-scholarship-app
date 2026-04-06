"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Zod Schema for Step 1
const basicsSchema = z.object({
  label: z.string().min(3, "Example: '2025/2026'"),
  openDate: z.string().min(1, "Open date is required"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().min(10, "Please provide a short description"),
});

type BasicsFormValues = z.infer<typeof basicsSchema>;

const wingsSchema = z.object({
  wings: z.array(z.object({
    name: z.string().min(2, "Name required"),
    headName: z.string().min(2, "Head name required"),
    headPhone: z.string().min(10, "Valid phone required"),
    headEmail: z.string().email("Valid email required"),
  })).min(1, "At least one wing is required"),
});

type WingsFormValues = z.infer<typeof wingsSchema>;

function Step2Wings({ initialData, onNext, onBack }: { initialData: any, onNext: (data: any) => void, onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<WingsFormValues>({
    resolver: zodResolver(wingsSchema),
    defaultValues: initialData || { wings: [{ name: "Main Wing", headName: "", headPhone: "", headEmail: "" }] },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Step 2: Wings Configuration</h2>
        <p className="text-sm text-slate-500">Define the organizational wings that applicants can select.</p>
      </div>
      
      {/* Dynamic Field Array Implementation would go here, simplified for now to list 1-3 fixed fields for demonstration, but full implementation requires useFieldArray */}
      <div className="p-4 border rounded-md space-y-4 bg-slate-50">
        <h3 className="font-medium text-slate-800 border-b pb-2">Wing 1</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Wing Name</Label>
            <Input {...register("wings.0.name")} placeholder="e.g. Prayer Wing" />
            {errors.wings?.[0]?.name && <p className="text-xs text-red-500">{errors.wings[0].name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Wing Head Name</Label>
            <Input {...register("wings.0.headName")} placeholder="John Doe" />
            {errors.wings?.[0]?.headName && <p className="text-xs text-red-500">{errors.wings[0].headName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Wing Head Phone</Label>
            <Input {...register("wings.0.headPhone")} placeholder="024XXXXXXX" />
            {errors.wings?.[0]?.headPhone && <p className="text-xs text-red-500">{errors.wings[0].headPhone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Wing Head Email</Label>
            <Input {...register("wings.0.headEmail")} type="email" placeholder="john@example.com" />
            {errors.wings?.[0]?.headEmail && <p className="text-xs text-red-500">{errors.wings[0].headEmail.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onBack}>Back to Basics</Button>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}

const rubricSchema = z.object({
  criteria: z.array(z.object({
    name: z.string().min(2, "Name required"),
    weight: z.number().min(5).max(100),
    description: z.string(),
  })).min(1, "At least one criterion required"),
});

type RubricFormValues = z.infer<typeof rubricSchema>;

function Step3Rubric({ initialData, onNext, onBack }: { initialData: any, onNext: (data: any) => void, onBack: () => void }) {
  const defaultCrit = [
    { name: "Academic Performance", weight: 30, description: "CWA and trajectory" },
    { name: "Financial Need", weight: 25, description: "Demonstrated economic hardship" },
    { name: "Church Activeness", weight: 25, description: "Involvement in NUPS-G" },
    { name: "Leadership", weight: 20, description: "Service and initiative" },
  ];
  const { register, handleSubmit, formState: { errors } } = useForm<RubricFormValues>({
    resolver: zodResolver(rubricSchema),
    defaultValues: initialData || { criteria: defaultCrit },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Step 3: Scoring Rubric</h2>
        <p className="text-sm text-slate-500">Define criteria for reviewing applications. Total weight must be 100.</p>
      </div>
      
      <div className="space-y-4">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="p-4 border rounded-md space-y-4 bg-slate-50">
             <div className="grid grid-cols-4 gap-4">
               <div className="col-span-2 space-y-1">
                 <Label>Criterion Name</Label>
                 <Input {...register(`criteria.${idx}.name` as const)} />
               </div>
               <div className="col-span-1 space-y-1">
                 <Label>Weight (%)</Label>
                 <Input type="number" {...register(`criteria.${idx}.weight` as const, { valueAsNumber: true })} />
               </div>
               <div className="col-span-4 space-y-1">
                 <Label>Description</Label>
                 <Input {...register(`criteria.${idx}.description` as const)} />
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onBack}>Back to Wings</Button>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}

const templatesSchema = z.object({
  endorsementRequest: z.string().min(10),
  dailyReminder: z.string().min(10),
  applicantConfirmation: z.string().min(10),
});

type TemplatesFormValues = z.infer<typeof templatesSchema>;

function Step4Templates({ initialData, onNext, onBack }: { initialData: any, onNext: (data: any) => void, onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TemplatesFormValues>({
    resolver: zodResolver(templatesSchema),
    defaultValues: initialData || {
      endorsementRequest: "Hello {{wing_name}} head, {{applicant_name}} has applied for the scholarship...",
      dailyReminder: "Reminder: You have pending endorsements...",
      applicantConfirmation: "Thank you for your application...",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Step 4: Messaging Templates</h2>
        <p className="text-sm text-slate-500">Variables available: &#123;&#123;applicant_name&#125;&#125;, &#123;&#123;wing_name&#125;&#125;, &#123;&#123;endorse_link&#125;&#125;</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Endorsement Request (SMS to Wing Head)</Label>
          <textarea {...register("endorsementRequest")} className="flex w-full rounded-md border min-h-[80px] p-2 text-sm" />
        </div>
        <div className="space-y-2">
          <Label>Daily Reminder (SMS to Wing Head)</Label>
          <textarea {...register("dailyReminder")} className="flex w-full rounded-md border min-h-[80px] p-2 text-sm" />
        </div>
        <div className="space-y-2">
          <Label>Applicant Confirmation (Email to Applicant)</Label>
          <textarea {...register("applicantConfirmation")} className="flex w-full rounded-md border min-h-[80px] p-2 text-sm" />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onBack}>Back to Rubric</Button>
        <Button type="submit">Preview & Launch</Button>
      </div>
    </form>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase/client";

// ... [previous schema and step definitions remain the same] ...

export default function SetupWizardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<any>({});

  const createYearMutation = useMutation({
    mutationFn: async (launchStatus: "SETUP" | "OPEN") => {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const payload = { ...wizardData, status: launchStatus };

      const res = await fetch("/api/years/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create academic year");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["years"] });
      router.push("/admin/years");
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to create year.");
    }
  });

  // Form for Step 1
  const { register, handleSubmit, formState: { errors } } = useForm<BasicsFormValues>({
    resolver: zodResolver(basicsSchema),
    defaultValues: wizardData.basics || {},
  });

  const onBasicsSubmit = (data: BasicsFormValues) => {
    setWizardData({ ...wizardData, basics: data });
    setCurrentStep(2);
  };

  const onWingsSubmit = (data: any) => {
    setWizardData({ ...wizardData, wings: data.wings });
    setCurrentStep(3);
  };

  const onRubricSubmit = (data: any) => {
    setWizardData({ ...wizardData, rubric: data.criteria });
    setCurrentStep(4);
  };

  const onTemplatesSubmit = (data: any) => {
    setWizardData({ ...wizardData, templates: data });
    setCurrentStep(5);
  };

  const handleCreate = (status: "SETUP" | "OPEN") => {
    createYearMutation.mutate(status);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Setup Academic Year</h1>
        <p className="text-slate-500 mt-1">Configure the new scholarship cycle. This wizard walks you through all steps.</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step} 
            className={`h-2 flex-1 rounded-full ${
              step === currentStep ? "bg-slate-900" : step < currentStep ? "bg-slate-400" : "bg-slate-200"
            }`} 
          />
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(onBasicsSubmit)} className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Step 1: Year Basics</h2>
            
            <div className="space-y-2">
              <Label htmlFor="label">Academic Year Label</Label>
              <Input 
                id="label" 
                placeholder="2025/2026" 
                {...register("label")} 
                className={errors.label ? "border-red-500" : ""}
              />
              {errors.label && <p className="text-sm text-red-500">{errors.label.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openDate">Application Open Date</Label>
                <Input 
                  id="openDate" 
                  type="date"
                  {...register("openDate")} 
                  className={errors.openDate ? "border-red-500" : ""}
                />
                {errors.openDate && <p className="text-sm text-red-500">{errors.openDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  {...register("deadline")} 
                  className={errors.deadline ? "border-red-500" : ""}
                />
                {errors.deadline && <p className="text-sm text-red-500">{errors.deadline.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Public Description</Label>
              <textarea 
                id="description" 
                {...register("description")} 
                className={`flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                placeholder="Shown on the landing page for applicants..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/years")}>
                Cancel
              </Button>
              <Button type="submit">Next Step</Button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <Step2Wings 
            initialData={wizardData.wings ? { wings: wizardData.wings } : undefined}
            onNext={onWingsSubmit}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Rubric 
            initialData={wizardData.rubric ? { criteria: wizardData.rubric } : undefined}
            onNext={onRubricSubmit}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4Templates 
            initialData={wizardData.templates}
            onNext={onTemplatesSubmit}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <div className="py-12 text-center text-slate-800 space-y-6">
            <h2 className="text-xl font-bold">Review & Launch</h2>
            <p className="text-slate-500">All configurations are set. You can launch immediately or save as setup and open later.</p>
            
            <div className="bg-slate-50 border p-4 rounded-md text-left text-sm max-w-sm mx-auto space-y-2">
               <div className="flex justify-between"><span className="text-slate-500">Label:</span><span className="font-semibold">{wizardData.basics?.label}</span></div>
               <div className="flex justify-between"><span className="text-slate-500">Wings:</span><span className="font-semibold">{wizardData.wings?.length} configured</span></div>
               <div className="flex justify-between"><span className="text-slate-500">Rubric:</span><span className="font-semibold">{wizardData.rubric?.length} criteria</span></div>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <Button variant="ghost" onClick={() => setCurrentStep(4)} disabled={createYearMutation.isPending}>Back</Button>
              <Button variant="secondary" onClick={() => handleCreate("SETUP")} disabled={createYearMutation.isPending}>
                Save as SETUP
              </Button>
              <Button onClick={() => handleCreate("OPEN")} disabled={createYearMutation.isPending}>
                Launch (OPEN)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

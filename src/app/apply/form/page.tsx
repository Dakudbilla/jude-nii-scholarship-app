"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function ApplicantLogin({ activeYearId, onLogin }: { activeYearId: string, onLogin: (auth: { studentId: string, email: string }) => void }) {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.length < 5 || !email.includes("@")) {
      setError("Please provide a valid Student ID and Email");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearId: activeYearId, studentId, email })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to initialize application");
      
      onLogin({ studentId, email });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Resume or Start</h2>
      <p className="text-slate-500 text-sm mb-6">Enter your credentials to securely access your draft. Your progress auto-saves as you go.</p>
      
      {error && <div className="bg-red-50 text-red-800 text-sm p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Student Reference / Index Number</Label>
          <Input 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
            placeholder="e.g. 20600000" 
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="john@edu.gh" 
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>Access Portal</Button>
      </form>
    </div>
  );
}

// ======================
// STEP 1
// ======================
const personalSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone required"),
  dob: z.string().min(1, "Date of birth required"),
});
type PersonalFormValues = z.infer<typeof personalSchema>;
function Step1Personal({ draft, onSaveAndNext, isLoading }: { draft: any, onSaveAndNext: (data: any) => void, isLoading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: draft.personalInfo || {},
  });
  return (
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left max-w-lg mx-auto">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-slate-800">1. Personal Information</h3>
      <div className="space-y-2"><Label>Full Legal Name</Label><Input {...register("fullName")} disabled={isLoading} />{errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}</div>
      <div className="space-y-2"><Label>Phone Number</Label><Input {...register("phone")} disabled={isLoading} />{errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}</div>
      <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" {...register("dob")} disabled={isLoading} />{errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}</div>
      <div className="pt-6"><Button type="submit" className="w-full" isLoading={isLoading}>Save & Continue</Button></div>
    </form>
  );
}

// ======================
// STEP 2
// ======================
const academicSchema = z.object({
  programme: z.string().min(2, "Programme required"),
  year: z.enum(["1", "2", "3", "4", "5", "6"]),
  cwa: z.number().min(0).max(100),
});
type AcademicFormValues = z.infer<typeof academicSchema>;
function Step2Academic({ draft, onSaveAndNext, onBack, isLoading }: { draft: any, onSaveAndNext: (data: any) => void, onBack: () => void, isLoading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<AcademicFormValues>({
    resolver: zodResolver(academicSchema),
    defaultValues: draft.academicInfo || {},
  });
  return (
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left max-w-lg mx-auto">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-slate-800">2. Academic Information</h3>
      <div className="space-y-2"><Label>Degree Programme</Label><Input {...register("programme")} disabled={isLoading} />{errors.programme && <p className="text-sm text-red-500">{errors.programme.message}</p>}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Current Year</Label>
          <select {...register("year")} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" disabled={isLoading}>
            <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option><option value="5">Year 5</option><option value="6">Year 6</option>
          </select>
        </div>
        <div className="space-y-2"><Label>Current CWA</Label><Input type="number" step="0.01" {...register("cwa", { valueAsNumber: true })} disabled={isLoading} /></div>
      </div>
      <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-md">Note: You must bring a transcript to your interview.</div>
      <div className="pt-6 flex justify-between"><Button type="button" variant="ghost" onClick={onBack} disabled={isLoading}>Back</Button><Button type="submit" isLoading={isLoading}>Save & Continue</Button></div>
    </form>
  );
}

// ======================
// STEP 3
// ======================
const financialSchema = z.object({
  sponsorStatus: z.enum(["SELF", "PARENTS", "RELATIVE", "OTHER"]),
  hasOtherScholarship: z.boolean(),
  hardshipEssay: z.string().min(50, "At least 50 characters required"),
  churchEssay: z.string().min(50, "At least 50 characters required"),
});
type FinancialFormValues = z.infer<typeof financialSchema>;
function Step3Financial({ draft, onSaveAndNext, onBack, isLoading }: { draft: any, onSaveAndNext: (data: any) => void, onBack: () => void, isLoading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FinancialFormValues>({
    resolver: zodResolver(financialSchema),
    defaultValues: draft.financialInfo || { hasOtherScholarship: false },
  });
  return (
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-slate-800">3. Financial Need & Essays</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Who pays your fees?</Label>
          <select {...register("sponsorStatus")} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="PARENTS">Parents</option><option value="RELATIVE">Relative</option><option value="SELF">Self-Sponsored</option><option value="OTHER">Other</option>
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-center">
          <Label className="flex items-center gap-2 cursor-pointer mt-4"><input type="checkbox" {...register("hasOtherScholarship")} className="w-4 h-4" /> I have another scholarship</Label>
        </div>
      </div>
      <div className="space-y-2"><Label>Financial Hardship explanation</Label><textarea {...register("hardshipEssay")} className="flex w-full rounded-md border p-3 text-sm min-h-[100px]" />{errors.hardshipEssay && <p className="text-sm text-red-500">{errors.hardshipEssay.message}</p>}</div>
      <div className="space-y-2"><Label>Church Activeness explanation</Label><textarea {...register("churchEssay")} className="flex w-full rounded-md border p-3 text-sm min-h-[100px]" />{errors.churchEssay && <p className="text-sm text-red-500">{errors.churchEssay.message}</p>}</div>
      <div className="pt-6 flex justify-between"><Button type="button" variant="ghost" onClick={onBack} disabled={isLoading}>Back</Button><Button type="submit" isLoading={isLoading}>Save & Continue</Button></div>
    </form>
  );
}

// ======================
// STEP 4
// ======================
const wingSchema = z.object({
  wingId: z.string().min(1, "You must select your primary wing"),
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration",
  }),
});
type WingFormValues = z.infer<typeof wingSchema>;
function Step4Submit({ draft, activeYear, onSubmit, onBack, isLoading }: { draft: any, activeYear: any, onSubmit: (data: any) => void, onBack: () => void, isLoading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<WingFormValues>({
    resolver: zodResolver(wingSchema),
    defaultValues: { wingId: draft.wingSelection || "", declaration: undefined as unknown as true },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left max-w-lg mx-auto">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-slate-800">4. Wing Endorsement & Submit</h3>
      <div className="space-y-2"><Label>Primary Wing For Endorsement</Label>
        <select {...register("wingId")} className="flex h-10 w-full rounded-md border px-3 py-2 text-sm">
          <option value="">-- Select Wing --</option><option value="wing_1">Evangelism</option><option value="wing_2">Prayer</option>
        </select>
        {errors.wingId && <p className="text-sm text-red-500">{errors.wingId.message}</p>}
      </div>
      <div className="p-4 bg-yellow-50 text-sm text-yellow-800 border rounded-md">
        <Label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register("declaration")} className="mt-1" />
          <span>I declare all info is accurate and accept disqualification rules for false data.</span>
        </Label>
        {errors.declaration && <p className="text-sm text-red-500">{errors.declaration.message}</p>}
      </div>
      <div className="pt-6 flex justify-between"><Button type="button" variant="ghost" onClick={onBack} disabled={isLoading}>Back</Button><Button type="submit" isLoading={isLoading} className="bg-green-600">Submit Application</Button></div>
    </form>
  );
}

export default function ApplicationFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [applicantAuth, setApplicantAuth] = useState<{ studentId: string, email: string } | null>(null);

  const { data: activeYear, isLoading: yearIsLoading } = useQuery({
    queryKey: ["activeYear"],
    queryFn: async () => { const res = await fetch("/api/years/active"); return (await res.json()).data; }
  });

  const { data: draft, isLoading: draftIsLoading } = useQuery({
    queryKey: ["draft", applicantAuth?.studentId],
    enabled: !!applicantAuth && !!activeYear?.id,
    queryFn: async () => {
      const res = await fetch("/api/drafts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearId: activeYear.id, studentId: applicantAuth!.studentId, email: applicantAuth!.email })
      });
      return (await res.json()).data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const res = await fetch("/api/drafts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearId: activeYear!.id, studentId: applicantAuth!.studentId, email: applicantAuth!.email, updateData })
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["draft", applicantAuth?.studentId] })
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: { wingId: string }) => {
      const res = await fetch("/api/applications/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearId: activeYear!.id, studentId: applicantAuth!.studentId, draftPayload: { ...draft, wingSelection: payload.wingId }})
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to submit");
      return json.data;
    },
    onSuccess: () => { alert("Application successfully submitted!"); router.push("/apply/status"); },
    onError: (err: any) => alert(err.message)
  });

  if (yearIsLoading) return <div className="p-12 text-center text-slate-500">Loading secure portal...</div>;
  if (!activeYear || activeYear.status !== "OPEN") return <div className="p-12 text-center text-red-500">Portal is closed.</div>;
  if (!applicantAuth) return <div className="min-h-screen bg-slate-50 py-24 px-6"><ApplicantLogin activeYearId={activeYear.id} onLogin={setApplicantAuth} /></div>;
  if (draftIsLoading || !draft) return <div className="p-12 text-center">Loading your draft securely...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Application Form</h1><p className="text-slate-500 text-sm">Draft auto-saves securely for {applicantAuth.studentId}</p></div>
          <Button variant="ghost" onClick={() => setApplicantAuth(null)}>Exit Portal</Button>
        </div>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => <div key={step} className={`h-2 flex-1 rounded-full ${step === draft.currentStep ? "bg-slate-900" : step < draft.currentStep ? "bg-slate-400" : "bg-slate-200"}`} />)}
        </div>
        <div className="bg-white border rounded-xl p-8 shadow-sm">
          {draft.currentStep === 1 && <Step1Personal draft={draft} isLoading={saveMutation.isPending} onSaveAndNext={(d) => saveMutation.mutate({ personalInfo: d, currentStep: 2 })} />}
          {draft.currentStep === 2 && <Step2Academic draft={draft} isLoading={saveMutation.isPending} onBack={() => saveMutation.mutate({ currentStep: 1 })} onSaveAndNext={(d) => saveMutation.mutate({ academicInfo: d, currentStep: 3 })} />}
          {draft.currentStep === 3 && <Step3Financial draft={draft} isLoading={saveMutation.isPending} onBack={() => saveMutation.mutate({ currentStep: 2 })} onSaveAndNext={(d) => saveMutation.mutate({ financialInfo: d, currentStep: 4 })} />}
          {draft.currentStep === 4 && <Step4Submit draft={draft} activeYear={activeYear} isLoading={submitMutation.isPending || saveMutation.isPending} onBack={() => saveMutation.mutate({ currentStep: 3 })} onSubmit={(d) => { saveMutation.mutate({ wingSelection: d.wingId }, { onSuccess: () => submitMutation.mutate({ wingId: d.wingId }) }) }} />}
        </div>
      </div>
    </div>
  );
}

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
import { motion, AnimatePresence } from "framer-motion";
import { Wing } from "@/lib/interfaces/core";

// ======================
// APPLICANT LOGIN
// ======================
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
      // initialise draft via POST (legacy path)
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-lg mx-auto">
      <h2 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">Resume or Start</h2>
      <p className="text-slate-500 text-base mb-8 leading-relaxed">Enter your credentials to securely access your application draft. Your progress auto-saves securely.</p>

      {error && <div className="bg-red-50 text-red-800 text-sm p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Student Reference / Index Number</Label>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 20600000"
            disabled={loading}
            className="h-12 bg-slate-50 focus:bg-white rounded-xl text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Email Address</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@edu.gh"
            disabled={loading}
            className="h-12 bg-slate-50 focus:bg-white rounded-xl text-lg"
          />
        </div>
        <div className="pt-4">
          <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20" isLoading={loading}>Access Portal</Button>
        </div>
      </form>
    </motion.div>
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
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left w-full h-full">
      <div className="space-y-2"><Label className="font-semibold text-slate-700">Full Legal Name</Label><Input {...register("fullName")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />{errors.fullName && <p className="text-sm text-red-500 font-medium">{errors.fullName.message}</p>}</div>
      <div className="space-y-2"><Label className="font-semibold text-slate-700">Phone Number</Label><Input {...register("phone")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />{errors.phone && <p className="text-sm text-red-500 font-medium">{errors.phone.message}</p>}</div>
      <div className="space-y-2"><Label className="font-semibold text-slate-700">Date of Birth</Label><Input type="date" {...register("dob")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />{errors.dob && <p className="text-sm text-red-500 font-medium">{errors.dob.message}</p>}</div>
      <div className="pt-6"><Button type="submit" className="w-full h-12 text-base rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" isLoading={isLoading}>Save &amp; Continue</Button></div>
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
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left w-full h-full">
      <div className="space-y-2"><Label className="font-semibold text-slate-700">Degree Programme</Label><Input {...register("programme")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />{errors.programme && <p className="text-sm text-red-500 font-medium">{errors.programme.message}</p>}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label className="font-semibold text-slate-700">Current Year</Label>
          <select {...register("year")} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-3 py-2 text-sm outline-none" disabled={isLoading}>
            <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option><option value="5">Year 5</option><option value="6">Year 6</option>
          </select>
        </div>
        <div className="space-y-2"><Label className="font-semibold text-slate-700">Current CWA</Label><Input type="number" step="0.01" {...register("cwa", { valueAsNumber: true })} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" /></div>
      </div>
      <div className="p-4 bg-secondary/10 border border-secondary/20 text-slate-900 text-sm rounded-xl font-medium">📋 Note: You must be able to securely provide your current terminal semester transcript upon request.</div>
      <div className="pt-6 flex justify-between gap-4"><Button type="button" variant="ghost" onClick={onBack} disabled={isLoading} className="h-12 w-32 rounded-xl border font-bold">Back</Button><Button type="submit" className="h-12 flex-1 text-base rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" isLoading={isLoading}>Save &amp; Continue</Button></div>
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
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left w-full h-full">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2"><Label className="font-semibold text-slate-700">Who primarily pays your fees?</Label>
          <select {...register("sponsorStatus")} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-3 py-2 text-sm outline-none">
            <option value="PARENTS">Parents</option><option value="RELATIVE">Relative</option><option value="SELF">Self-Sponsored</option><option value="OTHER">Other</option>
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-center">
          <Label className="flex items-center gap-3 cursor-pointer mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <input type="checkbox" {...register("hasOtherScholarship")} className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
            <span className="font-semibold text-slate-700">I have another scholarship</span>
          </Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Financial Hardship explanation</Label>
        <textarea {...register("hardshipEssay")} placeholder="Explain your current financial situation in detail..." className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-4 py-3 text-sm min-h-[120px] outline-none resize-y" />
        {errors.hardshipEssay && <p className="text-sm text-red-500 font-medium">{errors.hardshipEssay.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Church Activeness explanation</Label>
        <textarea {...register("churchEssay")} placeholder="Detail your spiritual involvement and wing activities..." className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-4 py-3 text-sm min-h-[120px] outline-none resize-y" />
        {errors.churchEssay && <p className="text-sm text-red-500 font-medium">{errors.churchEssay.message}</p>}
      </div>
      <div className="pt-6 flex justify-between gap-4"><Button type="button" variant="ghost" onClick={onBack} disabled={isLoading} className="h-12 w-32 rounded-xl border font-bold">Back</Button><Button type="submit" className="h-12 flex-1 text-base rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" isLoading={isLoading}>Save &amp; Continue</Button></div>
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

  // Fetch wings dynamically from the database
  const { data: wings, isLoading: wingsLoading } = useQuery<Wing[]>({
    queryKey: ["wings", activeYear.id],
    queryFn: async () => {
      const res = await fetch(`/api/wings?yearId=${activeYear.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to load wings");
      return json.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left w-full h-full">
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Primary Wing For Endorsement</Label>
        {wingsLoading ? (
          <div className="h-12 bg-slate-100 animate-pulse rounded-xl" />
        ) : (
          <select {...register("wingId")} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-3 py-2 text-sm outline-none" disabled={isLoading || wingsLoading}>
            <option value="">-- Select Wing --</option>
            {(wings || []).map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        )}
        {errors.wingId && <p className="text-sm text-red-500 font-medium">{errors.wingId.message}</p>}
      </div>
      <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-xl space-y-4">
        <Label className="flex items-start gap-4 cursor-pointer">
          <input type="checkbox" {...register("declaration")} className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
          <span className="font-semibold text-slate-800 leading-tight block">I declare that all information provided is accurate and verifiable. I accept that providing false data is grounds for disqualification and disciplinary action.</span>
        </Label>
        {errors.declaration && <p className="text-sm text-red-500 font-medium pl-9">{errors.declaration.message}</p>}
      </div>
      <div className="pt-6 flex justify-between gap-4"><Button type="button" variant="ghost" onClick={onBack} disabled={isLoading} className="h-12 w-32 rounded-xl border font-bold">Back</Button><Button type="submit" isLoading={isLoading} className="h-12 flex-1 text-base rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">Submit Application</Button></div>
    </form>
  );
}

// ======================
// MAIN PAGE
// ======================
export default function ApplicationFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [applicantAuth, setApplicantAuth] = useState<{ studentId: string, email: string } | null>(null);

  const { data: activeYear, isLoading: yearIsLoading } = useQuery({
    queryKey: ["activeYear"],
    queryFn: async () => {
      const res = await fetch("/api/years/active");
      return (await res.json()).data;
    }
  });

  // Use GET to load draft (correct caching semantics)
  const { data: draft, isLoading: draftIsLoading } = useQuery({
    queryKey: ["draft", applicantAuth?.studentId],
    enabled: !!applicantAuth && !!activeYear?.id,
    queryFn: async () => {
      const params = new URLSearchParams({
        yearId: activeYear.id,
        studentId: applicantAuth!.studentId,
        email: applicantAuth!.email,
      });
      const res = await fetch(`/api/drafts?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to load draft");
      return json.data;
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
        body: JSON.stringify({ yearId: activeYear!.id, studentId: applicantAuth!.studentId, draftPayload: { ...draft, wingSelection: payload.wingId } })
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

  const stepTitles = ["Personal Info", "Academic Record", "Financial & Essays", "Declaration & Endorse"];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">Application Form</h1>
            <p className="text-slate-500 text-base mt-2 font-medium">Logged in via: <span className="text-slate-700">{applicantAuth.studentId}</span></p>
          </div>
          <Button variant="ghost" onClick={() => setApplicantAuth(null)} className="font-bold border border-slate-200 bg-white hover:bg-slate-50 h-10 px-6 rounded-xl text-slate-600">Save &amp; Exit</Button>
        </div>

        {/* Progress Tracker */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4 px-2">
            {stepTitles.map((title, idx) => (
              <div key={title} className={`text-xs font-bold uppercase tracking-wider text-center flex-1 ${draft.currentStep === idx + 1 ? "text-primary" : draft.currentStep > idx + 1 ? "text-secondary" : "text-slate-400"}`}>
                <span className="hidden sm:inline">{title}</span>
                <span className="sm:hidden">Step {idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 h-2">
            {[1, 2, 3, 4].map((step) => <div key={step} className={`h-full flex-1 rounded-full transition-colors duration-500 ${step === draft.currentStep ? "bg-primary shadow-[0_0_15px_-3px_rgba(30,58,138,0.4)]" : step < draft.currentStep ? "bg-secondary" : "bg-slate-200"}`} />)}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={draft.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full pb-2"
            >
              <h2 className="text-2xl font-bold mb-8 text-slate-900 border-b border-slate-100 pb-4">{stepTitles[draft.currentStep - 1]}</h2>
              {draft.currentStep === 1 && <Step1Personal draft={draft} isLoading={saveMutation.isPending} onSaveAndNext={(d) => saveMutation.mutate({ personalInfo: d, currentStep: 2 })} />}
              {draft.currentStep === 2 && <Step2Academic draft={draft} isLoading={saveMutation.isPending} onBack={() => saveMutation.mutate({ currentStep: 1 })} onSaveAndNext={(d) => saveMutation.mutate({ academicInfo: d, currentStep: 3 })} />}
              {draft.currentStep === 3 && <Step3Financial draft={draft} isLoading={saveMutation.isPending} onBack={() => saveMutation.mutate({ currentStep: 2 })} onSaveAndNext={(d) => saveMutation.mutate({ financialInfo: d, currentStep: 4 })} />}
              {draft.currentStep === 4 && <Step4Submit draft={draft} activeYear={activeYear} isLoading={submitMutation.isPending || saveMutation.isPending} onBack={() => saveMutation.mutate({ currentStep: 3 })} onSubmit={(d) => { saveMutation.mutate({ wingSelection: d.wingId }, { onSuccess: () => submitMutation.mutate({ wingId: d.wingId }) }) }} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

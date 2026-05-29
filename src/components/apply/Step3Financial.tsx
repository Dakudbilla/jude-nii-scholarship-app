"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { financialSchema, FinancialFormValues } from "./formSchemas";
import type { FinancialInfo } from "@/lib/interfaces/application";

interface Step3Props {
  savedData?: Partial<FinancialInfo>;
  onSaveAndNext: (data: FinancialFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Step3Financial({ savedData, onSaveAndNext, onBack, isLoading }: Step3Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FinancialFormValues>({
    resolver: zodResolver(financialSchema),
    defaultValues: (savedData as FinancialFormValues | undefined) ?? { hasOtherScholarship: false },
  });

  return (
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left w-full">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">Who primarily pays your fees?</Label>
          <select
            {...register("sponsorStatus")}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-3 py-2 text-sm outline-none"
          >
            <option value="PARENTS">Parents</option>
            <option value="RELATIVE">Relative</option>
            <option value="SELF">Self-Sponsored</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-center">
          <Label className="flex items-center gap-3 cursor-pointer mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              {...register("hasOtherScholarship")}
              className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300"
            />
            <span className="font-semibold text-slate-700">I have another scholarship</span>
          </Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Financial Hardship explanation</Label>
        <textarea
          {...register("hardshipEssay")}
          placeholder="Explain your current financial situation in detail..."
          className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-4 py-3 text-sm min-h-[120px] outline-none resize-y"
        />
        {errors.hardshipEssay && <p className="text-sm text-red-500 font-medium">{errors.hardshipEssay.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Church Activeness explanation</Label>
        <textarea
          {...register("churchEssay")}
          placeholder="Detail your spiritual involvement and wing activities..."
          className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-4 py-3 text-sm min-h-[120px] outline-none resize-y"
        />
        {errors.churchEssay && <p className="text-sm text-red-500 font-medium">{errors.churchEssay.message}</p>}
      </div>
      <div className="pt-6 flex justify-between gap-4">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isLoading} className="h-12 w-32 rounded-xl border font-bold">Back</Button>
        <Button type="submit" className="h-12 flex-1 text-base rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" isLoading={isLoading}>
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}

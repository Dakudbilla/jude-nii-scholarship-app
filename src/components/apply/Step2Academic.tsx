"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { academicSchema, AcademicFormValues } from "./formSchemas";
import type { AcademicInfo } from "@/lib/interfaces/application";

interface Step2Props {
  savedData?: Partial<AcademicInfo & { cwa?: number }>;
  onSaveAndNext: (data: AcademicFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Step2Academic({ savedData, onSaveAndNext, onBack, isLoading }: Step2Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<AcademicFormValues>({
    resolver: zodResolver(academicSchema),
    defaultValues: savedData as AcademicFormValues | undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left w-full">
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Degree Programme</Label>
        <Input {...register("programme")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />
        {errors.programme && <p className="text-sm text-red-500 font-medium">{errors.programme.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">Current Year</Label>
          <select
            {...register("year")}
            disabled={isLoading}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-3 py-2 text-sm outline-none"
          >
            {["1", "2", "3", "4", "5", "6"].map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">Current CWA</Label>
          <Input
            type="number"
            step="0.01"
            {...register("cwa", { valueAsNumber: true })}
            disabled={isLoading}
            className="h-12 bg-slate-50 focus:bg-white rounded-xl"
          />
        </div>
      </div>
      <div className="p-4 bg-secondary/10 border border-secondary/20 text-slate-900 text-sm rounded-xl font-medium">
        📋 Note: You must be able to securely provide your current terminal semester transcript upon request.
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

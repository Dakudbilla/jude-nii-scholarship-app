"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { wingSchema, WingFormValues } from "./formSchemas";
import { useWings } from "@/hooks/useWings";

interface Step4Props {
  savedWingId?: string;
  activeYearId: string;
  onSubmit: (data: WingFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Step4Submit({ savedWingId, activeYearId, onSubmit, onBack, isLoading }: Step4Props) {
  const { wings, isLoading: wingsLoading } = useWings(activeYearId);

  const { register, handleSubmit, formState: { errors } } = useForm<WingFormValues>({
    resolver: zodResolver(wingSchema),
    defaultValues: { wingId: savedWingId ?? "", declaration: undefined as unknown as true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left w-full">
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Primary Wing For Endorsement</Label>
        {wingsLoading ? (
          <div className="h-12 bg-slate-100 animate-pulse rounded-xl" />
        ) : (
          <select
            {...register("wingId")}
            disabled={isLoading || wingsLoading}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-3 py-2 text-sm outline-none"
          >
            <option value="">-- Select Wing --</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        )}
        {errors.wingId && <p className="text-sm text-red-500 font-medium">{errors.wingId.message}</p>}
      </div>

      <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-xl space-y-4">
        <Label className="flex items-start gap-4 cursor-pointer">
          <input
            type="checkbox"
            {...register("declaration")}
            className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary border-slate-300"
          />
          <span className="font-semibold text-slate-800 leading-tight block">
            I declare that all information provided is accurate and verifiable. I accept that providing
            false data is grounds for disqualification and disciplinary action.
          </span>
        </Label>
        {errors.declaration && <p className="text-sm text-red-500 font-medium pl-9">{errors.declaration.message}</p>}
      </div>

      <div className="pt-6 flex justify-between gap-4">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isLoading} className="h-12 w-32 rounded-xl border font-bold">
          Back
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="h-12 flex-1 text-base rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
        >
          Submit Application
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { personalSchema, PersonalFormValues } from "./formSchemas";
import type { PersonalInfo } from "@/lib/interfaces/application";

interface Step1Props {
  savedData?: Partial<PersonalInfo>;
  onSaveAndNext: (data: PersonalFormValues) => void;
  isLoading: boolean;
}

export function Step1Personal({ savedData, onSaveAndNext, isLoading }: Step1Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: savedData as PersonalFormValues | undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSaveAndNext)} className="space-y-6 text-left w-full">
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Full Legal Name</Label>
        <Input {...register("fullName")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />
        {errors.fullName && <p className="text-sm text-red-500 font-medium">{errors.fullName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Phone Number</Label>
        <Input {...register("phoneNumber")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />
        {errors.phoneNumber && <p className="text-sm text-red-500 font-medium">{errors.phoneNumber.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Date of Birth</Label>
        <Input type="date" {...register("dateOfBirth")} disabled={isLoading} className="h-12 bg-slate-50 focus:bg-white rounded-xl" />
        {errors.dateOfBirth && <p className="text-sm text-red-500 font-medium">{errors.dateOfBirth.message}</p>}
      </div>
      <div className="pt-6">
        <Button
          type="submit"
          className="w-full h-12 text-base rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          isLoading={isLoading}
        >
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}

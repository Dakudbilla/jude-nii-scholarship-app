"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  endorsementRequest:      z.string().min(10),
  dailyReminder:           z.string().min(10),
  applicantConfirmation:   z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

const DEFAULTS: FormValues = {
  endorsementRequest:    "Hello {{wing_name}} head, {{applicant_name}} has applied for the scholarship...",
  dailyReminder:         "Reminder: You have pending endorsements...",
  applicantConfirmation: "Thank you for your application...",
};

interface Props {
  initialData?: Partial<FormValues>;
  onNext:   (data: FormValues) => void;
  onBack:   () => void;
  onCancel: () => void;
}

export function Step4Templates({ initialData, onNext, onBack, onCancel }: Props) {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...DEFAULTS, ...initialData },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Step 4: Messaging Templates</h2>
        <p className="text-sm text-slate-500">
          Variables: <code>{"{{applicant_name}}"}</code>, <code>{"{{wing_name}}"}</code>, <code>{"{{endorse_link}}"}</code>
        </p>
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
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onBack}>← Back</Button>
          <Button type="button" variant="ghost" className="text-slate-400 hover:text-slate-600 text-xs" onClick={onCancel}>Cancel Setup</Button>
        </div>
        <Button type="submit">Preview &amp; Launch</Button>
      </div>
    </form>
  );
}

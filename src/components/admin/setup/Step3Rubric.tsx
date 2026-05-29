"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  criteria: z
    .array(
      z.object({
        name:        z.string().min(2, "Name required"),
        weight:      z.number().min(5).max(100),
        description: z.string(),
      })
    )
    .min(1, "At least one criterion required"),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_CRITERIA = [
  { name: "Academic Performance", weight: 30, description: "CWA and trajectory" },
  { name: "Financial Need",        weight: 25, description: "Demonstrated economic hardship" },
  { name: "Church Activeness",     weight: 25, description: "Involvement in NUPS-G" },
  { name: "Leadership",            weight: 20, description: "Service and initiative" },
];

interface Props {
  initialData?: Partial<FormValues>;
  onNext:   (data: FormValues) => void;
  onBack:   () => void;
  onCancel: () => void;
}

export function Step3Rubric({ initialData, onNext, onBack, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? { criteria: DEFAULT_CRITERIA },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Step 3: Scoring Rubric</h2>
        <p className="text-sm text-slate-500">Define criteria for reviewing applications. Total weight should equal 100.</p>
      </div>

      <div className="space-y-4">
        {([0, 1, 2, 3] as const).map((idx) => (
          <div key={idx} className="p-4 border rounded-md space-y-4 bg-slate-50">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2 space-y-1">
                <Label>Criterion Name</Label>
                <Input {...register(`criteria.${idx}.name`)} />
                {errors.criteria?.[idx]?.name && <p className="text-xs text-red-500">{errors.criteria[idx]?.name?.message}</p>}
              </div>
              <div className="col-span-1 space-y-1">
                <Label>Weight (%)</Label>
                <Input type="number" {...register(`criteria.${idx}.weight`, { valueAsNumber: true })} />
              </div>
              <div className="col-span-4 space-y-1">
                <Label>Description</Label>
                <Input {...register(`criteria.${idx}.description`)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onBack}>← Back</Button>
          <Button type="button" variant="ghost" className="text-slate-400 hover:text-slate-600 text-xs" onClick={onCancel}>Cancel Setup</Button>
        </div>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}

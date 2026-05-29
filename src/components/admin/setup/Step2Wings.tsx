"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  wings: z
    .array(
      z.object({
        name:      z.string().min(2, "Name required"),
        headName:  z.string().min(2, "Head name required"),
        headPhone: z.string().min(10, "Valid phone required"),
        headEmail: z.string().email("Valid email required"),
      })
    )
    .min(1, "At least one wing is required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initialData?: Partial<FormValues>;
  onNext:   (data: FormValues) => void;
  onBack:   () => void;
  onCancel: () => void;
}

export function Step2Wings({ initialData, onNext, onBack, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      wings: [{ name: "Main Wing", headName: "", headPhone: "", headEmail: "" }],
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Step 2: Wings Configuration</h2>
        <p className="text-sm text-slate-500">Define the organisational wings that applicants can select.</p>
      </div>

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
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onBack}>← Back</Button>
          <Button type="button" variant="ghost" className="text-slate-400 hover:text-slate-600 text-xs" onClick={onCancel}>Cancel Setup</Button>
        </div>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}

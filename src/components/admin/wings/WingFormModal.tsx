"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wing } from "@/lib/interfaces/core";
import { X, Check, Plus } from "lucide-react";

type WingFormData = {
  name: string;
  headName: string;
  headEmail: string;
  headPhone: string;
};

interface WingFormModalProps {
  /** Pass an existing wing to put the modal in "edit" mode; omit for "add" mode. */
  wing?: Wing;
  onSave: (data: WingFormData) => void;
  onClose: () => void;
  isSaving: boolean;
}

/**
 * A single unified modal that handles both creating and editing a wing.
 * Replaces the two near-identical EditWingModal and AddWingModal components.
 */
export function WingFormModal({ wing, onSave, onClose, isSaving }: WingFormModalProps) {
  const isEditing = !!wing;

  const [form, setForm] = useState<WingFormData>({
    name: wing?.name ?? "",
    headName: wing?.headName ?? "",
    headEmail: wing?.headEmail ?? "",
    headPhone: wing?.headPhone ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.headEmail) return;
    onSave(form);
  };

  const set = (key: keyof WingFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isEditing ? "Edit Wing" : "Add Wing"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isEditing
                ? "Update the contact details for this wing head."
                : "Configure a new wing for this cycle."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Wing Name <span className="text-red-500">*</span></Label>
            <Input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Prayer Wing"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Wing Head Name</Label>
            <Input value={form.headName} onChange={set("headName")} placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <Label>Wing Head Email <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              value={form.headEmail}
              onChange={set("headEmail")}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Wing Head Phone</Label>
            <Input value={form.headPhone} onChange={set("headPhone")} placeholder="024XXXXXXX" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1" disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1 gap-2">
              {isSaving ? (
                isEditing ? "Saving..." : "Adding..."
              ) : isEditing ? (
                <><Check className="w-4 h-4" /> Save Changes</>
              ) : (
                <><Plus className="w-4 h-4" /> Add Wing</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

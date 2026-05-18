"use client";

import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VARIANT_STYLES = {
  danger: {
    icon: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
  },
  default: {
    icon: "bg-slate-100 text-slate-600",
    button: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${styles.icon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1 border border-slate-200"
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 shadow-lg font-bold ${styles.button}`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

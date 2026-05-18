"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CopyLinkButton } from "./CopyLinkButton";
import { ApplicationStatus } from "@/lib/interfaces/core";

// We use a partial Application shape here to keep the interface lean
interface AppStub {
  status: ApplicationStatus;
  endorsementToken?: string;
}

interface StageControlPanelProps {
  app: AppStub;
  onStatusChange: (status: ApplicationStatus) => void;
  isMutating: boolean;
}

/**
 * Context-driven control panel that renders the appropriate stage action
 * based on the application's current status.
 *
 * Replaces the scattered Reject/Shortlist buttons with a guided, linear workflow.
 */
export function StageControlPanel({ app, onStatusChange, isMutating }: StageControlPanelProps) {
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "default";
    confirmLabel?: string;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  const closeConfirm = () => setConfirm((prev) => ({ ...prev, open: false }));

  const requestConfirm = (opts: typeof confirm) => setConfirm({ ...opts, open: true });

  const s = app.status;

  return (
    <>
      <ConfirmDialog
        {...confirm}
        onCancel={closeConfirm}
        isLoading={isMutating}
      />

      {s === "PENDING_ENDORSEMENT" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Awaiting Wing Head Endorsement</h4>
            <p className="text-sm text-amber-800 max-w-xl">
              Waiting for the wing head to review. Share the secure link or manually endorse if needed.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            {app.endorsementToken && <CopyLinkButton token={app.endorsementToken} />}
            <Button
              variant="secondary"
              className="bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold"
              disabled={isMutating}
              onClick={() =>
                requestConfirm({
                  open: true,
                  title: "Force Endorsement",
                  description: "Are you sure you want to endorse this application without the Wing Head? This action is logged.",
                  variant: "warning",
                  confirmLabel: "Force Endorse",
                  onConfirm: () => { onStatusChange("ENDORSED"); closeConfirm(); },
                })
              }
            >
              Force Endorsement
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              disabled={isMutating}
              onClick={() =>
                requestConfirm({
                  open: true,
                  title: "Reject Application",
                  description: "Are you sure you want to reject this application? This cannot be easily undone.",
                  variant: "danger",
                  confirmLabel: "Reject",
                  onConfirm: () => { onStatusChange("REJECTED"); closeConfirm(); },
                })
              }
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {s === "ENDORSED" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Endorsed — Ready for Review</h4>
            <p className="text-sm text-blue-800 max-w-xl">
              The wing head has approved this application. It is now ready for internal scoring.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => onStatusChange("IN_REVIEW")} disabled={isMutating}>
              Begin Review
            </Button>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => onStatusChange("REJECTED")} disabled={isMutating}>
              Reject
            </Button>
          </div>
        </div>
      )}

      {s === "IN_REVIEW" && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Currently In Review</h4>
            <p className="text-sm text-slate-500 max-w-xl">
              Application is being scored. Shortlist for interview or reject.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8" onClick={() => onStatusChange("INTERVIEW")} disabled={isMutating}>
              Shortlist for Interview
            </Button>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => onStatusChange("REJECTED")} disabled={isMutating}>
              Reject
            </Button>
          </div>
        </div>
      )}

      {s === "INTERVIEW" && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-indigo-900 mb-1">Shortlisted for Interview</h4>
            <p className="text-sm text-indigo-800 max-w-xl">
              Record the final decision after the applicant has been interviewed.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8"
              onClick={() =>
                requestConfirm({
                  open: true,
                  title: "Award Scholarship",
                  description: "You are about to award the scholarship to this applicant. This is a final decision.",
                  variant: "default",
                  confirmLabel: "Award Scholarship",
                  onConfirm: () => { onStatusChange("AWARDED"); closeConfirm(); },
                })
              }
              disabled={isMutating}
            >
              Award Scholarship
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50 font-bold px-8 border border-red-200"
              onClick={() =>
                requestConfirm({
                  open: true,
                  title: "Reject Application",
                  description: "Are you sure you want to reject this application at the interview stage?",
                  variant: "danger",
                  confirmLabel: "Reject",
                  onConfirm: () => { onStatusChange("REJECTED"); closeConfirm(); },
                })
              }
              disabled={isMutating}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {(s === "AWARDED" || s === "REJECTED" || s === "REJECTED_BY_WING") && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-sm font-medium text-slate-500">
            This application has reached a final decision. No further actions are available.
          </p>
        </div>
      )}
    </>
  );
}

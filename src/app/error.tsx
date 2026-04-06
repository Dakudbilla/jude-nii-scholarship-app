"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our logging service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-lg w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
        <p className="text-slate-500 mb-6 font-mono text-sm break-words bg-slate-100 p-2 rounded">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-4 pt-2">
          <Button onClick={() => window.location.href = "/"} variant="secondary" className="flex-1">
            Back to Home
          </Button>
          <Button onClick={() => reset()} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

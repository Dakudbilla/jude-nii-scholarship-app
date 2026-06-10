"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { draftService } from "@/lib/services/client/draftService";

interface ApplicantLoginProps {
  activeYearId: string;
  onLogin: (auth: { studentId: string; email: string }) => void;
}

export function ApplicantLogin({ activeYearId, onLogin }: ApplicantLoginProps) {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.length < 5 || !email.includes("@")) {
      setError("Please provide a valid Student ID and Email");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await draftService.init(activeYearId, studentId, email);
      onLogin({ studentId, email });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initialize application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-lg mx-auto"
    >
      <h2 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">Resume or Start</h2>
      <p className="text-slate-500 text-base mb-8 leading-relaxed">
        Enter your credentials to securely access your application draft. Your progress auto-saves securely.
      </p>

      {error && (
        <div className="bg-red-50 text-red-800 text-sm p-4 rounded-xl mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Student Reference / Index Number</Label>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 20600000"
            disabled={loading}
            className="h-12 bg-slate-50 focus:bg-white rounded-xl text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Email Address</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@edu.gh"
            disabled={loading}
            className="h-12 bg-slate-50 focus:bg-white rounded-xl text-lg"
          />
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
            isLoading={loading}
          >
            Access Portal
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

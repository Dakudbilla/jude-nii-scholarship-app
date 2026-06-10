"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { draftService } from "@/lib/services/client/draftService";
import { KeyRound } from "lucide-react";

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
      setError("Please provide a valid Student ID and email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await draftService.init(activeYearId, studentId, email);
      onLogin({ studentId, email });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initialize application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
          <KeyRound className="w-6 h-6 text-secondary" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-primary tracking-tight mb-1.5">
          Resume or Start
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          Enter your credentials to access your application draft. Progress auto-saves as you go.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl mb-5 border border-red-100 leading-snug">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700">
              Student Reference / Index Number
            </Label>
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. 20600000"
              disabled={loading}
              className="input-premium"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@edu.gh"
              disabled={loading}
              className="input-premium"
            />
          </div>
          <div className="pt-1">
            <Button
              type="submit"
              className="w-full h-12 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors"
              isLoading={loading}
            >
              Access Portal
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, PartyPopper, ArrowLeft, CheckCircle2, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

function EligibilityQuiz({ onPassed }: { onPassed: () => void }) {
  const [step, setStep] = useState(1);
  const [failed, setFailed] = useState(false);

  const questions = [
    { question: "Are you an active, registered member of NUPS-G KNUST?", passValue: true },
    { question: "Have you fully paid your wing dues for the academic year?", passValue: true },
    { question: "Are you a final year student currently on university scholarship?", passValue: false },
  ];

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = questions[step - 1];
    if (!currentQuestion) return;
    if (answer !== currentQuestion.passValue) {
      setFailed(true);
      return;
    }
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      onPassed();
    }
  };

  if (failed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-red-100 p-8 sm:p-12 rounded-2xl text-center max-w-lg mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]"
      >
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-primary mb-2">Not Eligible</h3>
        <p className="text-slate-500 leading-relaxed text-sm mb-8">
          Based on your answers, you do not currently meet the eligibility requirements for the Jude Nii Scholarship.
        </p>
        <button
          onClick={() => { setStep(1); setFailed(false); }}
          className="w-full h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[step - 1];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl max-w-lg mx-auto overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]">
      {/* Progress bar */}
      <div className="h-1 bg-slate-100 w-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(step / questions.length) * 100}%` }}
          className="h-full bg-primary"
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="p-8 sm:p-12 text-center space-y-8">
        <p className="text-xs font-semibold text-slate-400 tracking-[0.15em] uppercase">
          Eligibility Check · {step} of {questions.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="min-h-[100px] flex items-center justify-center"
          >
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary leading-tight">
              {currentQ?.question}
            </h3>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 h-12 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            No
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplyGatePage() {
  const router = useRouter();
  const [quizPassed, setQuizPassed] = useState(false);

  const { data: yearData, isLoading, isError } = useQuery({
    queryKey: ["activeYear"],
    queryFn: async () => {
      const res = await fetch("/api/years/active");
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      return json.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">Loading portal…</p>
        </div>
      </div>
    );
  }

  // Portal not open
  if (isError || !yearData || yearData.status !== "OPEN") {
    const status = yearData?.status;
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-7 h-7 text-slate-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2 tracking-tight">
            {status === "SETUP" ? "Coming Soon" : status === "REVIEW" ? "Under Review" : "Portal Closed"}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            {status === "SETUP"
              ? "The application cycle is currently being prepared by the committee."
              : status === "REVIEW"
              ? "The application window has closed. Submissions are under review."
              : "We are not currently accepting applications."}
          </p>
          <div className="space-y-3">
            <Link
              href="/apply/status"
              className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Check Application Status
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Portal open
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">

      {/* Header */}
      <header className="px-5 sm:px-8 py-4 border-b border-slate-200 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-bold tracking-tight text-primary leading-none">Jude Nii</p>
            <p className="text-[9px] tracking-[0.22em] uppercase text-slate-400 font-semibold mt-0.5">Scholarship Fund</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-14 space-y-14">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-5"
        >
          <div className="inline-flex items-center gap-2">
            <div className="w-5 h-px bg-secondary" />
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-500">
              Applications Open · {yearData.label}
            </span>
            <div className="w-5 h-px bg-secondary" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
            Jude Nii Scholarship
          </h1>

          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {yearData.description}
          </p>

          {/* Date cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Opens</span>
              </div>
              <p className="font-bold text-primary text-sm">
                {formatDate(yearData.openDate, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) || "Not Set"}
              </p>
            </div>
            <div className="bg-white border border-red-100 rounded-xl px-6 py-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Deadline</span>
              </div>
              <p className="font-bold text-red-600 text-sm">
                {formatDate(yearData.deadline, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) || "Not Set"}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/apply/status"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors border-b border-slate-300 pb-0.5"
            >
              Already applied? Check your status
            </Link>
          </div>
        </motion.div>

        {/* Quiz or success */}
        {quizPassed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 p-10 sm:p-12 text-center max-w-lg w-full mx-auto rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-green-50/50">
              <PartyPopper className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-primary mb-2">You&apos;re Eligible!</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
              Proceed to the secure portal to resume or start your application draft.
            </p>
            <button
              onClick={() => router.push("/apply/form")}
              className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Enter Application Portal
            </button>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 tracking-[0.15em] uppercase mb-2">Before You Begin</p>
              <h2 className="font-serif text-2xl font-bold text-primary">Eligibility Check</h2>
            </div>
            <EligibilityQuiz onPassed={() => setQuizPassed(true)} />
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-2">
              {["Active NUPS-G member", "Wing dues paid", "Not on university scholarship"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

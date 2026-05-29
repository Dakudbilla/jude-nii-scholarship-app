"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, PartyPopper, ArrowLeft } from "lucide-react";
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-900 p-8 sm:p-12 rounded-3xl border border-red-100 text-center max-w-lg mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-extrabold mb-3 tracking-tight">Not Eligible</h3>
        <p className="mb-10 text-red-700/80 leading-relaxed font-medium">Based on your answers, you do not currently meet the eligibility requirements for the Jude Nii Scholarship.</p>
        <Button variant="secondary" onClick={() => { setStep(1); setFailed(false); }} className="w-full h-14 bg-white text-red-900 font-bold hover:bg-slate-50 border-red-100 rounded-xl shadow-sm">
          Retake Quiz
        </Button>
      </motion.div>
    );
  }

  const currentQ = questions[step - 1];

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] max-w-lg mx-auto text-center space-y-8 relative overflow-hidden">
      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / questions.length) * 100}%` }}
          className="h-full bg-primary"
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="text-xs font-bold text-primary tracking-widest uppercase pt-2">
        Eligibility Check • Step {step} of {questions.length}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[120px] flex items-center justify-center"
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{currentQ?.question}</h3>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button variant="ghost" size="lg" onClick={() => handleAnswer(false)} className="w-full sm:w-1/2 h-14 text-lg font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors">
          No
        </Button>
        <Button size="lg" onClick={() => handleAnswer(true)} className="w-full sm:w-1/2 h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all">
          Yes
        </Button>
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
    return <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 font-bold text-slate-400 uppercase tracking-widest">Loading portal...</div>;
  }

  // Not OPEN states
  if (isError || !yearData || yearData.status !== "OPEN") {
    const status = yearData?.status;
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50 p-6 noise relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-md bg-white p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.06)] relative z-10 w-full">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <ShieldAlert className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {status === "SETUP" ? "Coming Soon" : status === "REVIEW" ? "Under Review" : "Closed Portal"}
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            {status === "SETUP" ? "The application cycle is currently being prepared." :
             status === "REVIEW" ? "The application window has closed. Submissions are under review." :
             "We are not currently accepting applications."}
          </p>
          <div className="space-y-3">
            <Link href="/apply/status" className="inline-flex items-center justify-center w-full h-14 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-lg transition-all">
              Check Application Status
            </Link>
            <Link href="/" className="inline-flex items-center justify-center w-full h-12 rounded-xl text-slate-500 hover:text-slate-800 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // OPEN State
  return (
    <div className="min-h-[100dvh] bg-slate-50 py-16 px-4 sm:px-6 relative overflow-hidden noise">

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10 mt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm ring-1 ring-slate-200/50">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-block px-5 py-2 bg-white text-slate-800 text-sm font-bold rounded-full ring-1 ring-slate-200 shadow-sm mb-2">
            🚀 Applications Open — {yearData.label}
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Jude Nii Scholarship
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {yearData.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
             <div className="bg-white/60 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-sm">
                <span className="text-slate-500 font-medium block text-xs uppercase tracking-wider mb-1">Applications Open</span>
                <span className="font-extrabold text-slate-900">
                  {formatDate(yearData.openDate, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) || "Not Set"}
                </span>
             </div>
             <div className="bg-white/60 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-sm">
                <span className="text-slate-500 font-medium block text-xs uppercase tracking-wider mb-1">Application Deadline</span>
                <span className="font-extrabold text-red-600">
                  {formatDate(yearData.deadline, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) || "Not Set"}
                </span>
             </div>
          </div>
          <div className="pt-4 flex justify-center pb-8">
            <Link href="/apply/status" className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 text-slate-700 h-12 px-8 text-sm font-bold transition-all">
              Check Existing Status
            </Link>
          </div>
        </motion.div>

        {quizPassed ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 text-center max-w-lg w-full mx-auto rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
               <PartyPopper className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">You&apos;re Eligible!</h3>
            <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">Let&apos;s proceed to the secure application portal to resume or start your draft.</p>
            <Button size="lg" onClick={() => router.push("/apply/form")} className="h-14 px-10 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 w-full">
              Enter Secure Portal
            </Button>
          </motion.div>
        ) : (
           <EligibilityQuiz onPassed={() => setQuizPassed(true)} />
        )}
      </div>
    </div>
  );
}

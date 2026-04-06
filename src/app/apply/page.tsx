"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

function EligibilityQuiz({ onPassed }: { onPassed: () => void }) {
  const [step, setStep] = useState(1);
  const [failed, setFailed] = useState(false);

  const questions = [
    { question: "Are you an active, registered member of NUPS-G KNUST?", passValue: true },
    { question: "Have you fully paid your wing dues for the academic year?", passValue: true },
    { question: "Are you a final year student currently on university scholarship?", passValue: false }, // Fails if true
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
      <div className="bg-red-50 text-red-800 p-8 rounded-xl border border-red-200 text-center max-w-lg mx-auto">
        <h3 className="text-lg font-bold mb-2">Not Eligible</h3>
        <p className="mb-6">Based on your answers, you do not meet the eligibility requirements for the Jude Nii Scholarship.</p>
        <Button variant="secondary" onClick={() => { setStep(1); setFailed(false); }}>
          Retake Quiz
        </Button>
      </div>
    );
  }

  const currentQ = questions[step - 1];

  return (
    <div className="bg-white p-8 rounded-xl border shadow-sm max-w-lg mx-auto text-center space-y-6">
      <div className="text-sm font-semibold text-slate-500 tracking-wider uppercase">
        Eligibility Check (Step {step} of {questions.length})
      </div>
      <h3 className="text-xl font-medium text-slate-900">{currentQ?.question || "No more questions"}</h3>
      <div className="flex justify-center gap-4 pt-4">
        <Button variant="secondary" onClick={() => handleAnswer(false)} className="w-24">No</Button>
        <Button onClick={() => handleAnswer(true)} className="w-24">Yes</Button>
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
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading scholarship portal...</div>;
  }

  if (isError || !yearData || yearData.status === "NONE") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">No Active Cycle</h1>
          <p className="text-slate-500 mb-8">We are not currently accepting applications for the Jude Nii Scholarship. Please check back later.</p>
        </div>
      </div>
    );
  }

  if (yearData.status === "SETUP" || yearData.status === "CLOSED" || yearData.status === "REVIEW") {
    let title = "";
    let msg = "";
    
    if (yearData.status === "SETUP") {
      title = "Coming Soon";
      msg = `The ${yearData.label} application cycle is currently being prepared.`;
    } else if (yearData.status === "REVIEW") {
      title = "Under Review";
      msg = `The ${yearData.label} application window has closed. Submissions are currently under review.`;
    } else {
      title = "Closed";
      msg = `The ${yearData.label} application cycle has concluded.`;
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
          <p className="text-slate-500 mb-8">{msg}</p>
          <Link href="/apply/status" className="inline-flex items-center justify-center rounded-md bg-slate-100 text-slate-900 hover:bg-slate-100/80 h-10 px-4 py-2 text-sm font-medium transition-colors">
            Check Existing Status
          </Link>
        </div>
      </div>
    );
  }

  // If OPEN
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Jude Nii Scholarship</h1>
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-200 mb-2">
            Applications Open — {yearData.label}
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{yearData.description}</p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="/apply/status" className="inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-900 h-10 px-4 py-2 text-sm font-medium transition-colors">
              Check Existing Status
            </Link>
          </div>
        </div>

        {quizPassed ? (
          <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You are eligible!</h3>
            <p className="text-slate-500 mb-6">Click below to begin or resume your application form securely.</p>
            <Button size="lg" onClick={() => router.push("/apply/form")}>Begin Application</Button>
          </div>
        ) : (
           <EligibilityQuiz onPassed={() => setQuizPassed(true)} />
        )}
      </div>
    </div>
  );
}

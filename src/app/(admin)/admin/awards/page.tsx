"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminAwardsPublishPage() {
  const [publishing, setPublishing] = useState(false);
  const [step, setStep] = useState(1);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // Typically calls an API that uses AwardService.publishAwards
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
    } catch (e) {
      alert("Failed to publish awards");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto text-center mt-12">
      
      {step === 1 && (
        <div className="bg-white p-12 border rounded-xl shadow-sm space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Publish Awards</h1>
          <p className="text-slate-600">
            Publishing awards will finalize this academic cycle. Any applicant currently marked as "Shortlisted for Interview" or "Awarded" will be sent an official notification email.
          </p>
          <Button onClick={() => setStep(2)} className="w-full h-12 text-lg mt-4">
            Begin Publishing Process
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-amber-50 p-12 border border-amber-200 rounded-xl shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-amber-900">Are you absolutely sure?</h2>
          <p className="text-amber-800">
            This action cannot be undone. Official emails will be sent immediately to the students.
          </p>
          <div className="flex gap-4 pt-4">
             <Button variant="ghost" className="flex-1 text-slate-700" onClick={() => setStep(1)} disabled={publishing}>
               Cancel
             </Button>
             <Button 
               className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" 
               onClick={handlePublish}
               isLoading={publishing}
             >
               Yes, Publish Now
             </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-green-50 p-12 border border-green-200 rounded-xl shadow-sm space-y-6">
          <div className="text-green-600 text-6xl font-bold">✓</div>
          <h2 className="text-2xl font-bold text-green-900">Awards Published Successfully</h2>
          <p className="text-green-800">
            The scholarship cycle has been functionally concluded. Returning to dashboard...
          </p>
        </div>
      )}

    </div>
  );
}

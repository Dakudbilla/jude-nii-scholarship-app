"use client";

import { useRouter } from "next/navigation";
import { useYears } from "@/hooks/useYears";
import { useCycle } from "@/providers/CycleProvider";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { FolderOpen, Plus, ShieldCheck, Clock, LogOut } from "lucide-react";
import Link from "next/link";

export default function CycleSelectionPage() {
  const { years, isLoading, isError } = useYears();
  const { selectCycle } = useCycle();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 font-medium tracking-widest uppercase animate-pulse text-sm">
          Loading Workspaces...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-red-500 font-medium p-4 bg-red-50 rounded-xl border border-red-100">
          Failed to load academic cycles.
        </div>
      </div>
    );
  }

  const handleSelect = (id: string, label: string) => {
    selectCycle(id, label);
    router.push("/admin/applications"); // Default view for a cycle
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16 flex flex-col relative">
      <div className="absolute top-8 right-8 flex gap-3">
        <Link href="/admin/years">
          <Button variant="secondary" className="border-slate-200 text-slate-700 hover:bg-white bg-white/50 font-bold shadow-sm">
            <FolderOpen className="w-4 h-4 mr-2" /> Manage System Cycles
          </Button>
        </Link>
        <Button variant="ghost" className="text-slate-500 hover:bg-slate-200" onClick={() => auth.signOut()}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
      <div className="max-w-5xl mx-auto w-full space-y-12 mt-8 md:mt-0">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white text-slate-800 text-sm font-bold rounded-full ring-1 ring-slate-200 shadow-sm mx-auto">
            <ShieldCheck className="w-4 h-4 text-primary" /> System Administrator
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Select Academic Cycle
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg">
            Choose a cycle to access its specific applications, endorsements, and awards data.
          </p>
        </div>

        {years.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-16 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-slate-50/50">
               <FolderOpen className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">No Cycles Found</h2>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Get started by setting up the first academic cycle for the scholarship program.
              </p>
            </div>
            <Link href="/admin/setup/new" className="inline-block">
              <Button className="h-14 px-8 text-lg rounded-xl shadow-lg">
                <Plus className="w-5 h-5 mr-2" /> Set Up New Cycle
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {years.map((year) => (
              <div 
                key={year.id}
                onClick={() => handleSelect(year.id, year.label)}
                className="group bg-white border border-slate-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 rounded-3xl p-6 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between min-h-[200px]"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ring-1 ${
                      year.status === "OPEN" ? "bg-green-50 text-green-700 ring-green-200" :
                      year.status === "REVIEW" ? "bg-amber-50 text-amber-700 ring-amber-200" :
                      year.status === "CLOSED" ? "bg-slate-100 text-slate-600 ring-slate-200" :
                      "bg-blue-50 text-blue-700 ring-blue-200"
                    }`}>
                      {year.status}
                    </div>
                    {year.status !== "CLOSED" && (
                      <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                      {year.label}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                      {year.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 group-hover:text-slate-600 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Updated {new Date(year.updatedAt?.seconds ? year.updatedAt.seconds * 1000 : Date.now()).toLocaleDateString()}</span>
                  </div>
                  <span className="font-bold text-sm">Enter Workspace &rarr;</span>
                </div>
              </div>
            ))}

            <Link href="/admin/setup/new" className="block">
              <div className="bg-slate-50/50 border-2 border-slate-200 border-dashed hover:border-primary/50 hover:bg-white rounded-3xl p-6 cursor-pointer transition-all h-full min-h-[200px] flex flex-col items-center justify-center text-center space-y-4 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors text-slate-400">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Set Up New Cycle</h3>
                  <p className="text-sm text-slate-500 mt-1">Configure a new academic year.</p>
                </div>
              </div>
            </Link>

          </div>
        )}
      </div>
    </div>
  );
}

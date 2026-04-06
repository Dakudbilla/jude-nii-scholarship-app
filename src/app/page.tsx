import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans items-center justify-center p-6">
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border p-12 text-center space-y-8">
        
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-800 text-sm font-semibold tracking-wide border border-blue-100">
            NUPS-G KNUST
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Jude Nii Scholarship
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
            Supporting the financial and spiritual development of our dedicated members. View application timelines or manage the pipeline.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-slate-100 mt-8">
          <Link href="/apply" className="inline-flex items-center justify-center rounded-md bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-14 px-8 text-base font-medium shadow-md transition-colors w-full sm:w-auto">
            Apply for Scholarship
          </Link>
          <Link href="/admin/login" className="inline-flex items-center justify-center rounded-md bg-slate-100 text-slate-900 hover:bg-slate-100/80 h-14 px-8 text-base font-medium transition-colors w-full sm:w-auto">
            Admin Portal
          </Link>
        </div>

      </main>
    </div>
  );
}

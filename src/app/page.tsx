"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ChevronRight, LayoutDashboard, ShieldCheck, HandHeart, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-animated flex flex-col p-6 overflow-hidden text-white font-sans noise">
      
      {/* Background magical glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Modern thin header */}
      <header className="z-20 w-full max-w-7xl mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center glow-gold">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <span className="font-extrabold tracking-tight text-xl">Jude Nii</span>
        </div>
        
        <Link 
          href="/admin/login" 
          className="glass hover:bg-white/10 transition-colors h-10 px-5 rounded-full flex gap-2 items-center text-sm font-semibold text-white/90"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-300" />
          Admin Portal
        </Link>
      </header>

      {/* Main hero content */}
      <main className="z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center mt-[-8vh]">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 flex flex-col items-center"
        >
          <div className="glass px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 ring-1 ring-white/10 backdrop-blur-md glow-gold">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-bold tracking-widest uppercase text-white/90">NUPS-G KNUST Scholarship</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1] pb-2">
            Empowering Our <br />
            <span className="text-gradient">Faithful Members</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 leading-relaxed max-w-2xl font-medium pt-2">
            Financial support for the dedicated members of NUPS-G KNUST. Uplifting the church, together.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-5 pt-12 w-full max-w-md mx-auto"
        >
          <Link 
            href="/apply" 
            className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-secondary text-primary hover:bg-secondary/90 h-16 px-8 text-lg font-extrabold transition-all duration-300 w-full glow-gold hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 rounded-2xl" />
            <span className="relative z-10 flex items-center gap-2">
              Apply for Scholarship
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>

        {/* Feature row */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.6 }}
           className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-24 text-left w-full"
        >
           <div className="glass p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-colors">
              <ShieldCheck className="w-8 h-8 text-secondary" />
              <h3 className="font-bold text-lg">Secure & Private</h3>
              <p className="text-sm text-slate-400 font-medium">Your data is strictly confidential and protected by modern encryption.</p>
           </div>
           <div className="glass p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-colors hidden md:block">
              <HandHeart className="w-8 h-8 text-secondary" />
              <h3 className="font-bold text-lg">Need Based</h3>
              <p className="text-sm text-slate-400 font-medium">Designed specifically to assist students with genuine financial hardships.</p>
           </div>
           <div className="glass p-6 rounded-2xl space-y-3 hover:bg-white/10 transition-colors">
              <Award className="w-8 h-8 text-secondary" />
              <h3 className="font-bold text-lg">Merit & Service</h3>
              <p className="text-sm text-slate-400 font-medium">Recognizing dedication and active service in your church wing.</p>
           </div>
        </motion.div>

      </main>
    </div>
  );
}

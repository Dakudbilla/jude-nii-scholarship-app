"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      // Force token refresh to get latest claims
      await userCredential.user.getIdToken(true);
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Invalid credentials. You must be an authorized admin to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-animated min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden noise">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-secondary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-dark p-10 sm:p-12 rounded-[2rem] shadow-2xl relative z-10 text-white">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-white/20 glow-gold">
             <ShieldCheck className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Jude Nii Admin</h1>
          <p className="text-slate-300 font-medium">Sign in to your administrative portal.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 font-medium text-sm p-4 rounded-xl mb-8 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Email Address</label>
            <input 
              type="email" 
              {...register("email")}
              disabled={loading}
              placeholder="admin@edu.gh"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
            {errors.email && <p className="text-sm text-red-400 mt-1.5 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Password</label>
            <input 
              type="password" 
              {...register("password")}
              disabled={loading}
              placeholder="••••••••"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
            {errors.password && <p className="text-sm text-red-400 mt-1.5 font-medium">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-primary font-extrabold text-lg py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Authenticating..." : "Secure Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

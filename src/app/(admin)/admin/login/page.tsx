"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

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
      await userCredential.user.getIdToken(true);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. You must be an authorized admin to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">

      {/* Header */}
      <header className="px-5 sm:px-8 py-4 border-b border-slate-200 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-bold tracking-tight text-primary leading-none">Jude Nii</p>
            <p className="text-[9px] tracking-[0.22em] uppercase text-slate-400 font-semibold mt-0.5">Scholarship Fund</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-[420px]">

          {/* Icon + heading */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight mb-1.5">
              Staff Portal
            </h1>
            <p className="text-slate-500 text-sm">Authorized administrators only.</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)]">

            {error && (
              <div className="bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl mb-6 border border-red-100 leading-snug">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  disabled={loading}
                  placeholder="admin@edu.gh"
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold text-sm py-3.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 mt-1 cursor-pointer"
              >
                {loading ? "Signing in…" : "Sign In to Portal"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            NUPS-G KNUST · Scholarship Management System
          </p>
        </div>
      </div>
    </div>
  );
}

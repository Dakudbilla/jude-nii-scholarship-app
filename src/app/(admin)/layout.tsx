"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Link from "next/link";
import { LayoutDashboard, Users, Award, Shield, FileText, BarChart3, LogOut, RefreshCcw } from "lucide-react";
import { CycleProvider, useCycle } from "@/providers/CycleProvider";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CycleProvider>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </CycleProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && !pathname.includes("/admin/login")) {
        router.push("/admin/login");
      } else if (user) {
        // Force refresh to get latest claims if needed
        const token = await user.getIdTokenResult();
        if (!token.claims.role && !pathname.includes("/admin/login")) {
          // If no role, sign out and redirect
          await auth.signOut();
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const { selectedCycle, clearCycle, isReady } = useCycle();

  useEffect(() => {
    // If auth and cycle states are ready, enforce cycle selection
    if (!loading && isReady) {
      const isExemptRoute = 
        pathname === "/admin" || 
        pathname.includes("/admin/login") || 
        pathname.startsWith("/admin/setup") ||
        pathname.startsWith("/admin/years");
        
      if (!isExemptRoute && !selectedCycle) {
        router.push("/admin");
      }
    }
  }, [loading, isReady, pathname, selectedCycle, router]);

  if (loading || !isReady) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  // Dont show sidebar on exempt pages
  if (pathname.includes("/admin/login") || pathname === "/admin" || pathname.startsWith("/admin/setup") || pathname.startsWith("/admin/years")) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Applications", href: "/admin/applications", icon: FileText },
    { label: "Wings", href: "/admin/wings", icon: Users },
    { label: "Endorsements", href: "/admin/endorsements", icon: Shield },
    { label: "Awards", href: "/admin/awards", icon: Award },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50">
      {/* Sidebar */}
      <div className="w-64 bg-primary border-r border-primary/20 text-slate-300 flex flex-col shadow-xl">
        <div className="h-24 flex flex-col justify-center px-6 border-b border-white/10 space-y-1">
          <h1 className="text-white font-extrabold tracking-tight text-lg leading-none">Jude Nii Admin</h1>
          <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">NUPS-G KNUST</span>
          {selectedCycle && (
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white w-max">
              Cycle: {selectedCycle.label}
            </div>
          )}
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-secondary text-primary shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]" 
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => {
              clearCycle();
              router.push("/admin");
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl hover:bg-white/10 hover:text-white transition-colors text-slate-400"
          >
            <RefreshCcw className="w-5 h-5" />
            <span className="text-sm font-medium">Switch Cycle</span>
          </button>
          
          <button
            onClick={() => {
              clearCycle();
              auth.signOut();
              router.push("/");
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

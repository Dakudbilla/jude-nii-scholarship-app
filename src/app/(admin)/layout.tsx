"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Link from "next/link";
import { LayoutDashboard, Users, FolderOpen, Award, Shield, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  // Dont show sidebar on login page
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Academic Years", href: "/admin/years", icon: FolderOpen },
    { label: "Applications", href: "/admin/applications", icon: FileText },
    { label: "Wings", href: "/admin/wings", icon: Users },
    { label: "Endorsements", href: "/admin/endorsements", icon: Shield },
    { label: "Awards", href: "/admin/awards", icon: Award },
    { label: "Reports", href: "/admin/reports", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-white font-bold text-lg">Jude Nii Manager</h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-slate-800 text-white" 
                    : "hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-slate-800/50 hover:text-white transition-colors text-slate-400"
          >
            <LogOut className="w-4 h-4" />
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

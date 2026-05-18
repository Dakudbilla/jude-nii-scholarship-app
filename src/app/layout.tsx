import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Jude Nii Manager | NUPS-G KNUST",
  description: "Scholarship management system for NUPS-G KNUST",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className} suppressHydrationWarning>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}

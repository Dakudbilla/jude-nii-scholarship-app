"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Search, ChevronRight, ShieldCheck, HandHeart, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-primary font-sans flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">

          {/* Wordmark */}
          <div>
            <p className="font-serif text-xl font-bold tracking-tight text-primary leading-none">Jude Nii</p>
            <p className="text-[9px] tracking-[0.22em] uppercase text-slate-400 font-semibold mt-0.5">Scholarship Fund</p>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link
              href="/apply/status"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              <Search className="w-4 h-4" />
              Track Status
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 active:scale-[0.97] transition-all duration-150"
            >
              Apply Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* Text */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {/* Label */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7">
                <div className="w-6 h-px bg-secondary" />
                <span className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-500">
                  NUPS-G KNUST · Est. 1964
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-serif text-[2.75rem] sm:text-6xl md:text-7xl font-bold leading-[1.06] tracking-tight text-primary mb-6"
              >
                Uplifting Our<br />
                <span className="relative inline-block">
                  Faithful
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-secondary rounded-full" />
                </span>{" "}
                Members
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg mb-10"
              >
                Financial support for dedicated members of NUPS-G KNUST facing genuine
                hardship. Applied for, reviewed fairly, and awarded with care.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/apply"
                  className="group inline-flex items-center justify-center gap-2 bg-secondary text-primary text-base font-bold px-8 py-4 rounded-xl hover:bg-secondary/90 active:scale-[0.97] transition-all duration-150"
                >
                  Apply for Scholarship
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/apply/status"
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 text-base font-semibold px-6 py-4 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150 sm:hidden"
                >
                  <Search className="w-4 h-4" />
                  Track Application
                </Link>
              </motion.div>
            </motion.div>

            {/* Decorative — desktop only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="relative w-[380px] h-[380px] select-none">
                {/* Outer thin ring */}
                <div className="absolute inset-0 rounded-full border border-slate-200" />
                {/* Middle ring */}
                <div className="absolute inset-10 rounded-full border border-secondary/25" />
                {/* Inner navy disc */}
                <div className="absolute inset-[72px] rounded-full bg-primary flex flex-col items-center justify-center gap-2 text-center px-8">
                  <Award className="w-9 h-9 text-secondary" />
                  <p className="font-serif text-white text-[1.35rem] font-bold leading-tight">
                    NUPS-G<br />KNUST
                  </p>
                  <div className="w-8 h-px bg-secondary/50 my-0.5" />
                  <p className="text-white/50 text-[10px] tracking-[0.18em] uppercase font-semibold">
                    Scholarship
                  </p>
                </div>
                {/* Orbital accent dots */}
                {[0, 72, 144, 216, 288].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2 h-2 rounded-full bg-secondary/50"
                    style={{
                      top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 186}px - 4px)`,
                      left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 186}px - 4px)`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
            {/* Desktop: 3-col horizontal */}
            <div className="hidden sm:grid grid-cols-3 divide-x divide-slate-200">
              {[
                { value: "Need-Based", label: "Selection Criteria" },
                { value: "Active Members", label: "Who Can Apply" },
                { value: "NUPS-G KNUST", label: "Administered by" },
              ].map((stat) => (
                <div key={stat.label} className="px-8 first:pl-0 last:pr-0">
                  <p className="font-serif text-2xl font-bold text-primary leading-tight">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-0.5 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Mobile: stacked */}
            <div className="flex sm:hidden flex-col divide-y divide-slate-100">
              {[
                { value: "Need-Based", label: "Selection Criteria" },
                { value: "Active Members", label: "Who Can Apply" },
                { value: "NUPS-G KNUST", label: "Administered by" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <p className="font-serif text-sm font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature cards ── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
          <div className="text-center max-w-xl mx-auto mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3"
            >
              What to Expect
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-slate-500 text-base leading-relaxed"
            >
              A straightforward, fair process built for the NUPS-G KNUST community.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                Icon: ShieldCheck,
                title: "Secure & Private",
                body: "Your application is strictly confidential. Only the scholarship committee reviews your details.",
                num: "01",
              },
              {
                Icon: HandHeart,
                title: "Need Based",
                body: "Designed to help students with genuine financial hardship, assessed honestly and equitably.",
                num: "02",
              },
              {
                Icon: Award,
                title: "Merit & Service",
                body: "Active church service and academic commitment are considered alongside financial need.",
                num: "03",
              },
            ].map(({ Icon, title, body, num }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-secondary/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 bg-primary/5 rounded-xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-serif text-5xl font-bold text-slate-100 leading-none">{num}</span>
                </div>
                <h3 className="font-bold text-[1.05rem] text-primary mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Eligibility ── */}
        <section className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-secondary" />
                  <span className="text-xs tracking-[0.2em] uppercase font-semibold text-white/40">
                    Eligibility
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Who Can Apply
                </h2>
                <p className="text-white/55 leading-relaxed text-base">
                  The scholarship is open to all active members of NUPS-G KNUST who
                  demonstrate financial need and commitment to the community.
                </p>
              </div>

              <ul className="space-y-4 lg:pt-14">
                {[
                  "Active, registered member of NUPS-G KNUST",
                  "Currently enrolled as a student at KNUST",
                  "Demonstrated financial need",
                  "In good standing with your church wing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-400 mb-4">
              Ready?
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-primary mb-4">
              Start your application.
            </h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-base">
              Takes about 10–15 minutes. Have your student ID and church wing details ready.
            </p>
            <Link
              href="/apply"
              className="group inline-flex items-center gap-2 bg-secondary text-primary text-base font-bold px-8 py-4 rounded-xl hover:bg-secondary/90 active:scale-[0.97] transition-all duration-150"
            >
              Apply for Scholarship
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-primary text-base">Jude Nii</span>
            <span className="text-slate-300">·</span>
            <span>© {new Date().getFullYear()} NUPS-G KNUST</span>
          </div>
          <Link href="/admin" className="hover:text-primary transition-colors font-medium">
            Staff Portal
          </Link>
        </div>
      </footer>

    </div>
  );
}

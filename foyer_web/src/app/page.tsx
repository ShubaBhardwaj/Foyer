"use client";

import Link from "next/link";
import { Building2, ShieldCheck, Layers, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--on-background)] flex flex-col justify-between selection:bg-[var(--primary)] selection:text-[var(--on-primary)]">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--outline)]/30 bg-[var(--surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-[var(--on-primary)] shadow-lg shadow-[var(--primary)]/20">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--on-surface)]">FOYER</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-[var(--on-surface)]/70 hover:text-[var(--on-surface)] transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-xs text-[var(--on-surface)]/70 hover:text-[var(--on-surface)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-[var(--on-surface)]/70 hover:text-[var(--on-surface)] transition-colors">
              Terms
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-2 shadow-lg shadow-[var(--primary)]/20">
                Dashboard Login <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(143,188,143,0.15),transparent_50%)]" />
          <div className="mx-auto max-w-5xl px-6 text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tertiary)]/30 bg-[var(--tertiary-container)]/40 px-4 py-1.5 text-xs font-semibold text-[var(--tertiary)]">
              <Sparkles className="h-3.5 w-3.5" /> Next-Generation Society Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--on-surface)] sm:text-6xl leading-tight">
              Governing Modern Gated Communities with <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent">Precision</span>
            </h1>

            <p className="mx-auto max-w-2xl text-base text-[var(--on-surface)]/70 leading-relaxed">
              Foyer automates society structure generation, role hierarchy permissions, resident flat occupancy, and multi-tier security operations into a unified enterprise portal.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-xl shadow-[var(--primary)]/20">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/society/register">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 border-[var(--outline)] bg-[var(--surface)]">
                  Register Your Society
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[var(--outline)]/40 bg-[var(--surface)] p-6 space-y-3 shadow-lg backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-container)]/50 text-[var(--primary)] border border-[var(--primary)]/20">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--on-surface)]">Dynamic Tower & Flat Engine</h3>
              <p className="text-xs text-[var(--on-surface)]/70 leading-relaxed">
                Generate complex multi-tower layouts instantly with automated flat numbering and extensible structure locks.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--outline)]/40 bg-[var(--surface)] p-6 space-y-3 shadow-lg backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--secondary-container)]/50 text-[var(--on-secondary-container)] border border-[var(--secondary)]/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--on-surface)]">Multi-Role Governance</h3>
              <p className="text-xs text-[var(--on-surface)]/70 leading-relaxed">
                Strict MongoDB authorization enforcing Owner, Super Admin, Society Admin, Resident, and Guard roles.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--outline)]/40 bg-[var(--surface)] p-6 space-y-3 shadow-lg backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--tertiary-container)]/50 text-[var(--tertiary)] border border-[var(--tertiary)]/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--on-surface)]">6-Char Unique ID Linking</h3>
              <p className="text-xs text-[var(--on-surface)]/70 leading-relaxed">
                Seamless Clerk account linking using secure 6-character random alphanumeric unique identifiers.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--outline)]/30 py-8 text-center text-xs text-[var(--on-surface)]/60">
        <p>© 2026 Foyer Society Management Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}


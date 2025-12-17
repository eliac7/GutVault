"use client";

import { Button } from "@/shared/ui/button";
import { ArrowLeft, Home, Lock, Search, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="relative mb-8 flex justify-center">
          <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center rotate-3 transform transition-transform hover:rotate-0 duration-500">
            <div className="relative">
              <Lock className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-6 h-6 text-emerald-500 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="absolute -top-2 right-1/2 translate-x-12 bg-red-500 text-white p-1.5 rounded-full shadow-lg border-4 border-slate-50 dark:border-slate-950">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
          404<span className="text-emerald-500">.</span>
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-widest font-mono">
          Location Not Indexed
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
          The path you are looking for doesn&apos;t exist in our local vault.
          Your privacy remains intact, but this page is nowhere to be found.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="rounded-full shadow-lg shadow-emerald-500/20 group"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
            Return to Safety
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

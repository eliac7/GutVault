import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ChevronRight, Database, Shield, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Hero Copy */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                v1.0 Public Beta
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
              Your Gut Health.
              <br />
              Your Data.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
                Your Device.
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Offline-first IBS tracking with AI voice logging, zero data
              tracking, and insights that stay securely on your device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="/dashboard">
                <Button variant="cta" size="lg" className="w-full">
                  Try GutVault
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </div>
          </div>

          {/* Hero Visual - Abstract Vault */}
          <div className="relative group perspective-1000">
            {/* Decorative Elements */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 lg:p-8 aspect-square sm:aspect-4/3 overflow-hidden flex flex-col">
              {/* Header UI Mock */}
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  localhost:3000
                </div>
              </div>

              {/* Central Abstract Vault Visualization */}
              <div className="flex-1 flex items-center justify-center relative">
                {/* Outer Rings */}
                <div className="absolute w-64 h-64 rounded-full border border-dashed border-slate-200 dark:border-slate-700 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute w-48 h-48 rounded-full border border-slate-100 dark:border-slate-800 animate-[spin_15s_linear_infinite_reverse]"></div>

                {/* Core Vault */}
                <div className="relative z-10 w-32 h-32 bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                  <Shield className="w-12 h-12 text-emerald-400" />

                  {/* Floating Badges */}
                  <div className="absolute -top-4 -right-12 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 animate-bounce-slow">
                    <Database className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      IndexedDB
                    </span>
                  </div>
                  <div className="absolute -bottom-4 -left-12 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 animate-bounce-slow delay-75">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Gemini Flash
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <div className="text-emerald-600 font-bold text-lg">100%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    Offline
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <div className="text-slate-800 dark:text-slate-200 font-bold text-lg">
                    0
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    Trackers
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                  <div className="text-slate-800 dark:text-slate-200 font-bold text-lg">
                    Local
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    Storage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

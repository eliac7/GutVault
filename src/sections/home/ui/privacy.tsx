import { Lock, Check, Shield, Database } from "lucide-react";

export const Privacy = () => {
  return (
    <section
      id="privacy"
      className="py-24 bg-slate-900 dark:bg-slate-950 text-slate-50 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 dark:bg-emerald-900/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 w-fit mb-6">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Privacy First
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Zero tracking, by design.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              GutVault isn't just a privacy policy; it's a technical guarantee.
              We built the app so we literally cannot see your data even if we
              wanted to.
            </p>

            <ul className="space-y-4">
              {[
                "No analytics, no cookies, no behavioral tracking",
                "No cloud storage, your logs never leave your device",
                "Voice processing is ephemeral, no audio is retained",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md bg-slate-800 dark:bg-slate-900 rounded-3xl p-8 border border-slate-700 dark:border-slate-800 shadow-2xl">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500 dark:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <Shield className="w-10 h-10 text-emerald-900 dark:text-emerald-950" />
              </div>

              <div className="space-y-6">
                <div className="h-2 w-1/3 bg-slate-600 dark:bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="h-12 w-full bg-slate-700/50 dark:bg-slate-800/50 rounded-xl flex items-center px-4 border border-slate-600/50 dark:border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-red-400 mr-3"></div>
                    <div className="h-2 w-1/2 bg-slate-600 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-12 w-full bg-slate-700/50 dark:bg-slate-800/50 rounded-xl flex items-center px-4 border border-slate-600/50 dark:border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3"></div>
                    <div className="h-2 w-2/3 bg-slate-600 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-700 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm">
                    <Database className="w-4 h-4" />
                    <span>Encrypted at rest (Device level)</span>
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

import { Lock, Mic, BarChart3, Smartphone } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Mic,
      title: "AI Voice Logging",
      desc: "Hold to record. AI turns natural speech into structured logs, identifying foods, symptoms, and Bristol scale automatically.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Lock,
      title: "Local-First Architecture",
      desc: "All logs stored on-device in IndexedDB via Dexie.js. Works fully offline, syncing only when you choose (if ever).",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: BarChart3,
      title: "Privacy-Centric Analytics",
      desc: "Correlations like 'Food vs Symptoms' are computed client-side in the browser. Zero server-side processing of your health data.",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Smartphone,
      title: "Installable PWA",
      desc: "Install on iOS or Android directly from the browser. Runs like a native app with fast load times and touch optimization.",
      color: "bg-amber-50 text-amber-600",
    },
  ] as const;

  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Powerful tracking, zero compromise.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Every feature is built with two goals: making tracking effortless
            and keeping your data exclusively yours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

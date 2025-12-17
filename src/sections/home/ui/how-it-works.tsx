export const HowItWorks = () => {
  const steps = [
    {
      title: "Press & hold to record",
      desc: "Speak naturally about your meal or symptoms.",
    },
    {
      title: "Stateless Extraction",
      desc: "Gemini processes speech to JSON instantly.",
    },
    {
      title: "Save Locally",
      desc: "Structured data saved to Dexie.js (IndexedDB).",
    },
    {
      title: "Visualize Patterns",
      desc: "View local charts to find triggers.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            How it works
          </h2>
        </div>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col md:items-center md:text-center group"
              >
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-sm z-10 group-hover:border-emerald-500 dark:group-hover:border-emerald-400 transition-colors duration-300">
                  <span className="text-3xl font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

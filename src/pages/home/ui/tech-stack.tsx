import { Cpu } from "lucide-react";

export const TechStack = () => {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
          Powered by Modern Web Standards
        </h3>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {[
            "Next.js 16",
            "FastAPI",
            "Dexie.js",
            "Gemini",
            "Tailwind CSS",
            "shadcn/ui",
          ].map((tech) => (
            <div
              key={tech}
              className="bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm text-slate-700 font-medium text-sm flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              {tech}
            </div>
          ))}
        </div>

        <p className="mt-8 text-slate-500 text-sm max-w-2xl mx-auto">
          Stateless backend, no database, processes only and returns structured
          JSON. <br />
          Your browser does the heavy lifting.
        </p>
      </div>
    </section>
  );
};

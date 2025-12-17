import { Shield, Github } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function Footer() {
  return (
    <footer
      id="opensource"
      className="bg-slate-900 dark:bg-slate-950 text-slate-400 dark:text-slate-500 py-12 border-t border-slate-800 dark:border-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-xl text-white dark:text-slate-100">
                GutVault
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed">
              Open source, privacy-first health tracking. Built to empower
              patients with their own data. Transparency is our core feature.
            </p>
          </div>
          <div className="flex md:justify-end gap-4">
            <Button variant="secondary" size="sm" className="gap-2">
              <Github className="w-4 h-4" />
              View on GitHub
            </Button>
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-700 dark:border-slate-800 bg-slate-800 dark:bg-slate-900 text-xs font-medium">
              MIT License
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div>
            Built by{" "}
            <span className="text-white dark:text-slate-200">
              Ilias Nikolaos Thalassochoritis
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-white dark:hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-white dark:hover:text-slate-200 transition-colors"
            >
              Website
            </a>
            <a
              href="#"
              className="hover:text-white dark:hover:text-slate-200 transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

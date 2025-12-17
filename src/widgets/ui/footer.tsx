import { Shield, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer
      id="opensource"
      className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-xl text-white">GutVault</span>
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
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium">
              MIT License
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div>
            Built by{" "}
            <span className="text-white">Ilias Nikolaos Thalassochoritis</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Website
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

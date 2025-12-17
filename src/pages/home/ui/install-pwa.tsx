import { Smartphone } from "lucide-react";

export const InstallPWA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 sm:p-16 text-white text-center overflow-hidden relative">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Install like an app.
            </h2>
            <p className="text-emerald-100 text-lg mb-8">
              Works offline, fast logging anywhere. Add to Home Screen on iOS
              and Android for a native experience without the App Store
              friction.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex items-center gap-4 text-left">
                <Smartphone className="w-8 h-8 text-emerald-200" />
                <div>
                  <div className="font-bold">Mobile</div>
                  <div className="text-xs text-emerald-100">
                    iOS & Android PWA
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex items-center gap-4 text-left">
                <div className="w-8 h-8 rounded border-2 border-emerald-200 flex items-center justify-center">
                  <div className="w-4 h-0.5 bg-emerald-200"></div>
                </div>
                <div>
                  <div className="font-bold">Desktop</div>
                  <div className="text-xs text-emerald-100">
                    Chrome & Safari
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

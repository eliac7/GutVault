import { Database, Shield, Smartphone, ServerOff } from "lucide-react"

export const SocialProof = () => {
    const items = [
        { icon: ServerOff, text: "Offline-first" },
        { icon: Database, text: "Local-only storage" },
        { icon: Smartphone, text: "Installable PWA" },
        { icon: Shield, text: "MIT Licensed" },
    ];

    return (
        <div className="border-y border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-500">
                            <item.icon className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-sm sm:text-base">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
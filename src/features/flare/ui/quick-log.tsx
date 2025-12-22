"use client";

import { LevelSlider } from "@/features/logging/ui/level-slider";
import { addLog } from "@/shared/db/operations";
import type { PainLevel, StressLevel, Symptom } from "@/shared/db/types";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const QUICK_SYMPTOMS: { id: Symptom; label: string }[] = [
  { id: "cramping", label: "Cramping" },
  { id: "bloating", label: "Bloating" },
  { id: "nausea", label: "Nausea" },
  { id: "urgency", label: "Urgency" },
];

export function QuickLog({ onComplete }: { onComplete?: () => void }) {
  const [painLevel, setPainLevel] = useState<PainLevel>(5);
  const [stressLevel, setStressLevel] = useState<StressLevel>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await addLog({
        type: "symptom",
        timestamp: new Date(),
        painLevel,
        stressLevel,
        symptoms: selectedSymptoms,
        notes: notes || "Logged from Flare Mode",
        aiGenerated: false,
      });
      toast.success("Logged successfully");
      if (onComplete) onComplete();
    } catch (error) {
      console.error(error);
      toast.error("Failed to log");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <LevelSlider
          label="Pain Level"
          value={painLevel}
          onChange={(v) => setPainLevel(v as PainLevel)}
          type="pain"
        />

        <LevelSlider
          label="Stress Level"
          value={stressLevel}
          onChange={(v) => setStressLevel(v as StressLevel)}
          type="stress"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Symptoms
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_SYMPTOMS.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedSymptoms.includes(symptom.id)
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {symptom.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Notes
        </label>
        <textarea
          className="flex min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-indigo-800"
          placeholder="How are you feeling?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        onClick={handleSave}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        Save Log
      </Button>
    </div>
  );
}

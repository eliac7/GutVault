import { useState } from "react";
import { motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  addLog,
  updateLog,
  type LogEntry,
  type LogType,
  type BristolType,
  type PainLevel,
  type Symptom,
  type TriggerFood,
  SYMPTOM_LABELS,
  TRIGGER_FOOD_LABELS,
} from "@/shared/db";
import { BristolImage } from "@/shared/ui/bristol-image";
import { BristolSelector } from "./bristol-selector";
import { PainSlider } from "./pain-slider";
import { ChipSelector } from "./chip-selector";

interface ManualLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLog?: LogEntry | null;
}

export function ManualLogDialog({
  open,
  onOpenChange,
  initialLog,
}: ManualLogDialogProps) {
  const [step, setStep] = useState<"type" | "details">("type");
  const [logType, setLogType] = useState<LogType>("bowel_movement");
  const [bristolType, setBristolType] = useState<BristolType | null>(null);
  const [painLevel, setPainLevel] = useState<PainLevel>(5);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [triggerFoods, setTriggerFoods] = useState<TriggerFood[]>([]);
  const [medication, setMedication] = useState("");
  const [medicationDose, setMedicationDose] = useState("");
  const [notes, setNotes] = useState("");

  // Track previous initialLog to sync form state during render
  const [prevInitialLog, setPrevInitialLog] = useState(initialLog);
  if (initialLog !== prevInitialLog) {
    setPrevInitialLog(initialLog);
    if (initialLog) {
      setStep("type");
      setLogType(initialLog.type);
      setBristolType(initialLog.bristolType ?? null);
      setPainLevel(initialLog.painLevel ?? 5);
      setSymptoms(initialLog.symptoms ?? []);
      setTriggerFoods(initialLog.triggerFoods ?? []);
      setMedication(initialLog.medication ?? "");
      setMedicationDose(initialLog.medicationDose ?? "");
      setNotes(initialLog.notes ?? "");
    }
  }

  const resetForm = () => {
    setStep("type");
    setLogType("bowel_movement");
    setBristolType(null);
    setPainLevel(5);
    setSymptoms([]);
    setTriggerFoods([]);
    setMedication("");
    setMedicationDose("");
    setNotes("");
  };

  const handleSave = async () => {
    try {
      const logData = {
        type: logType,
        bristolType:
          logType === "bowel_movement" ? bristolType ?? undefined : undefined,
        painLevel: painLevel,
        symptoms: symptoms.length > 0 ? symptoms : undefined,
        triggerFoods: triggerFoods.length > 0 ? triggerFoods : undefined,
        medication:
          logType === "medication" ? medication || undefined : undefined,
        medicationDose:
          logType === "medication" ? medicationDose || undefined : undefined,
        notes: notes || undefined,
      };

      if (initialLog?.id) {
        await updateLog(initialLog.id, logData);
      } else {
        await addLog({
          ...logData,
          timestamp: new Date(),
        });
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  };

  const logTypeOptions = [
    { value: "bowel_movement", label: "Bowel Movement", emoji: "💩" },
    { value: "meal", label: "Meal / Food", emoji: "🍽️" },
    { value: "symptom", label: "Symptom Only", emoji: "🤕" },
    { value: "medication", label: "Medication", emoji: "💊" },
  ] as const;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {initialLog
                  ? "Edit Log"
                  : step === "type"
                  ? "New Log"
                  : "Log Details"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <X className="w-5 h-5" />
                </Button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {step === "type" ? (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      What are you logging?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {logTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setLogType(option.value)}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                            logType === option.value
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <div className="text-2xl h-8 mb-2 flex items-center justify-center">
                            {option.value === "bowel_movement" ? (
                              <BristolImage
                                type={4}
                                className="size-16 md:size-20 lg:size-32"
                              />
                            ) : (
                              option.emoji
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {logType === "bowel_movement" && (
                    <BristolSelector
                      value={bristolType}
                      onChange={setBristolType}
                    />
                  )}

                  {logType === "meal" && (
                    <ChipSelector
                      label="Trigger Foods (optional)"
                      options={Object.entries(TRIGGER_FOOD_LABELS).map(
                        ([value, label]) => ({
                          value: value as TriggerFood,
                          label,
                        })
                      )}
                      selected={triggerFoods}
                      onChange={setTriggerFoods}
                    />
                  )}

                  {logType === "medication" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Medication Name
                        </label>
                        <input
                          type="text"
                          value={medication}
                          onChange={(e) => setMedication(e.target.value)}
                          placeholder="e.g., Ibuprofen, Probiotics..."
                          className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Dose (optional)
                        </label>
                        <input
                          type="text"
                          value={medicationDose}
                          onChange={(e) => setMedicationDose(e.target.value)}
                          placeholder="e.g., 200mg, 2 tablets..."
                          className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <PainSlider value={painLevel} onChange={setPainLevel} />

                  <ChipSelector
                    label="Symptoms (optional)"
                    options={Object.entries(SYMPTOM_LABELS).map(
                      ([value, label]) => ({
                        value: value as Symptom,
                        label,
                      })
                    )}
                    selected={symptoms}
                    onChange={setSymptoms}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes..."
                      className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 resize-none h-24 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              {step === "details" && (
                <Button
                  variant="outline"
                  onClick={() => setStep("type")}
                  className="flex-1 h-14 rounded-2xl"
                >
                  Back
                </Button>
              )}

              <Button
                onClick={() => {
                  if (step === "type") {
                    setStep("details");
                  } else {
                    handleSave();
                  }
                }}
                className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {step === "type" ? (
                  "Next"
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    {initialLog ? "Update Log" : "Save Log"}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

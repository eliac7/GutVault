import {
  addLog,
  ANXIETY_MARKER_LABELS,
  SYMPTOM_LABELS,
  TRIGGER_FOOD_LABELS,
  updateLog,
  type AnxietyMarker,
  type BristolType,
  type LogEntry,
  type LogType,
  type PainLevel,
  type StressLevel,
  type Symptom,
  type TriggerFood,
} from "@/shared/db";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { useTranslations } from "next-intl";
import { Check, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BristolSelector } from "./bristol-selector";
import { ChipSelector } from "./chip-selector";
import { FodmapPicker } from "./fodmap-picker";
import { LevelSlider } from "./level-slider";

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
  const t = useTranslations("logging");
  const tSymptoms = useTranslations("logging.symptoms");
  const tAnxiety = useTranslations("logging.anxietyMarkers");
  const tTriggers = useTranslations("logging.triggerFoods");
  const tCommon = useTranslations("common");

  const [step, setStep] = useState<"type" | "details">("type");
  const [logType, setLogType] = useState<LogType>("bowel_movement");
  const [bristolType, setBristolType] = useState<BristolType | null>(null);
  const [painLevel, setPainLevel] = useState<PainLevel>(5);
  const [stressLevel, setStressLevel] = useState<StressLevel>(5);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [anxietyMarkers, setAnxietyMarkers] = useState<AnxietyMarker[]>([]);
  const [foods, setFoods] = useState<string[]>([]);
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
      setStressLevel(initialLog.stressLevel ?? 5);
      setSymptoms(initialLog.symptoms ?? []);
      setAnxietyMarkers(initialLog.anxietyMarkers ?? []);
      setFoods(initialLog.foods ?? []);
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
    setStressLevel(5);
    setSymptoms([]);
    setAnxietyMarkers([]);
    setFoods([]);
    setTriggerFoods([]);
    setMedication("");
    setMedicationDose("");
    setNotes("");
  };

  const handleSave = async () => {
    try {
      const logData: Partial<LogEntry> = {
        type: logType,
        bristolType:
          logType === "bowel_movement" ? bristolType ?? undefined : undefined,
        painLevel: painLevel,
        stressLevel: stressLevel,
        symptoms: symptoms.length > 0 ? symptoms : undefined,
        anxietyMarkers: anxietyMarkers.length > 0 ? anxietyMarkers : undefined,
        foods:
          logType === "meal"
            ? foods.length > 0
              ? foods
              : undefined
            : undefined,
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
        } as LogEntry);
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0"
      >
        <SheetHeader className="p-4 border-b border-slate-200 dark:border-slate-800 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            {step === "details" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("type")}
                className="rounded-xl -ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <SheetTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {initialLog
                ? t("manualDialog.editTitle")
                : t("manualDialog.newTitle")}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === "type" ? (
              <motion.div
                key="type-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                  {t("manualDialog.typeQuestion")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "bowel_movement",
                      icon: "💩",
                      label: t("logTitles.bowelMovement"),
                    },
                    {
                      id: "meal",
                      icon: "🍽️",
                      label: t("logTitles.mealLogged"),
                    },
                    {
                      id: "symptom",
                      icon: "🤕",
                      label: t("logTitles.symptomsLogged"),
                    },
                    {
                      id: "medication",
                      icon: "💊",
                      label: tCommon("labels.medication"),
                    },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setLogType(type.id as LogType);
                        setStep("details");
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3",
                        logType === type.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                      )}
                    >
                      <span className="text-4xl">{type.icon}</span>
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {logType === "bowel_movement" && (
                  <div className="space-y-4">
                    <BristolSelector
                      value={bristolType}
                      onChange={setBristolType}
                    />
                  </div>
                )}

                {(logType === "bowel_movement" || logType === "symptom") && (
                  <div className="space-y-4">
                    <LevelSlider
                      label={tCommon("labels.painLevel")}
                      value={painLevel}
                      onChange={(v) => setPainLevel(v as PainLevel)}
                      type="pain"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <LevelSlider
                    label={t("logDetails.stress")}
                    value={stressLevel}
                    onChange={(v) => setStressLevel(v as StressLevel)}
                    type="stress"
                  />
                </div>

                <ChipSelector
                  label={tCommon("labels.symptoms")}
                  options={Object.keys(SYMPTOM_LABELS).map((value) => ({
                    value: value as Symptom,
                    label: tSymptoms(value as Symptom),
                  }))}
                  selected={symptoms}
                  onChange={setSymptoms}
                />

                <ChipSelector
                  label={t("manualDialog.anxietyLabel")}
                  options={Object.keys(ANXIETY_MARKER_LABELS).map((value) => ({
                    value: value as AnxietyMarker,
                    label: tAnxiety(value as AnxietyMarker),
                  }))}
                  selected={anxietyMarkers}
                  onChange={setAnxietyMarkers}
                />

                {logType === "meal" && (
                  <div className="space-y-4">
                    <FodmapPicker selectedFoods={foods} onChange={setFoods} />
                  </div>
                )}

                <ChipSelector
                  label={t("manualDialog.potentialTriggers")}
                  options={Object.keys(TRIGGER_FOOD_LABELS).map((value) => ({
                    value: value as TriggerFood,
                    label: tTriggers(value as TriggerFood),
                  }))}
                  selected={triggerFoods}
                  onChange={setTriggerFoods}
                />

                {logType === "medication" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {t("manualDialog.medicationNameLabel")}
                      </label>
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        placeholder={t(
                          "manualDialog.medicationNamePlaceholder"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {t("manualDialog.dosageLabel")}
                      </label>
                      <input
                        type="text"
                        value={medicationDose}
                        onChange={(e) => setMedicationDose(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        placeholder={t("manualDialog.dosagePlaceholder")}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {tCommon("labels.notes")}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none h-24 text-sm transition-all"
                    placeholder={t("notesPlaceholder")}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            onClick={step === "type" ? () => setStep("details") : handleSave}
            className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg"
          >
            {step === "type" ? (
              t("manualDialog.nextStep")
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                {initialLog ? t("manualDialog.updateLog") : t("save")}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

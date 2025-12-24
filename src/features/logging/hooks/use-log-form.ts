import { useState, useCallback } from "react";
import {
  addLog,
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

interface UseLogFormProps {
  initialLog?: LogEntry | null;
  onSuccess?: () => void;
}

export function useLogForm({ initialLog, onSuccess }: UseLogFormProps) {
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

  const resetForm = useCallback(() => {
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
  }, []);

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
    } else {
      resetForm();
    }
  }

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
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  };

  return {
    step,
    setStep,
    logType,
    setLogType,
    bristolType,
    setBristolType,
    painLevel,
    setPainLevel,
    stressLevel,
    setStressLevel,
    symptoms,
    setSymptoms,
    anxietyMarkers,
    setAnxietyMarkers,
    foods,
    setFoods,
    triggerFoods,
    setTriggerFoods,
    medication,
    setMedication,
    medicationDose,
    setMedicationDose,
    notes,
    setNotes,
    handleSave,
    resetForm,
  };
}

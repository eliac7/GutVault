import {
  ANXIETY_MARKER_LABELS,
  SYMPTOM_LABELS,
  TRIGGER_FOOD_LABELS,
  type AnxietyMarker,
  type BristolType,
  type LogType,
  type PainLevel,
  type StressLevel,
  type Symptom,
  type TriggerFood,
} from "@/shared/db";
import { useTranslations } from "next-intl";
import { BristolSelector } from "../bristol-selector";
import { ChipSelector } from "../chip-selector";
import { FodmapPicker } from "../fodmap-picker";
import { LevelSlider } from "../level-slider";
import { MedicationInputs } from "./medication-inputs";

interface LogDetailsFormProps {
  logType: LogType;
  bristolType: BristolType | null;
  setBristolType: (value: BristolType | null) => void;
  painLevel: PainLevel;
  setPainLevel: (value: PainLevel) => void;
  stressLevel: StressLevel;
  setStressLevel: (value: StressLevel) => void;
  symptoms: Symptom[];
  setSymptoms: (value: Symptom[]) => void;
  anxietyMarkers: AnxietyMarker[];
  setAnxietyMarkers: (value: AnxietyMarker[]) => void;
  foods: string[];
  setFoods: (value: string[]) => void;
  triggerFoods: TriggerFood[];
  setTriggerFoods: (value: TriggerFood[]) => void;
  medication: string;
  setMedication: (value: string) => void;
  medicationDose: string;
  setMedicationDose: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

export function LogDetailsForm({
  logType,
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
}: LogDetailsFormProps) {
  const t = useTranslations("logging");
  const tSymptoms = useTranslations("logging.symptoms");
  const tAnxiety = useTranslations("logging.anxietyMarkers");
  const tTriggers = useTranslations("logging.triggerFoods");
  const tCommon = useTranslations("common");

  return (
    <div className="space-y-6">
      {logType === "bowel_movement" && (
        <div className="space-y-4">
          <BristolSelector value={bristolType} onChange={setBristolType} />
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
        <MedicationInputs
          medication={medication}
          setMedication={setMedication}
          medicationDose={medicationDose}
          setMedicationDose={setMedicationDose}
        />
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
    </div>
  );
}

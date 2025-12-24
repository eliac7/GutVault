import { useTranslations } from "next-intl";

interface MedicationInputsProps {
  medication: string;
  setMedication: (value: string) => void;
  medicationDose: string;
  setMedicationDose: (value: string) => void;
}

export function MedicationInputs({
  medication,
  setMedication,
  medicationDose,
  setMedicationDose,
}: MedicationInputsProps) {
  const t = useTranslations("logging");

  return (
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
          placeholder={t("manualDialog.medicationNamePlaceholder")}
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
  );
}

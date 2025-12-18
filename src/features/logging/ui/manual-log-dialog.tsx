"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  addLog,
  updateLog,
  type LogEntry,
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

const formSchema = z.object({
  logType: z.enum(["bowel_movement", "meal", "symptom", "medication"]),
  bristolType: z.number().min(1).max(7).nullable(),
  painLevel: z.number().min(1).max(10),
  symptoms: z.array(z.string()),
  triggerFoods: z.array(z.string()),
  medication: z.string(),
  medicationDose: z.string(),
  notes: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  logType: "bowel_movement",
  bristolType: null,
  painLevel: 5,
  symptoms: [],
  triggerFoods: [],
  medication: "",
  medicationDose: "",
  notes: "",
};

const getFormValuesFromLog = (log: LogEntry): FormValues => ({
  logType: log.type,
  bristolType: log.bristolType || null,
  painLevel: log.painLevel || 5,
  symptoms: log.symptoms || [],
  triggerFoods: log.triggerFoods || [],
  medication: log.medication || "",
  medicationDose: log.medicationDose || "",
  notes: log.notes || "",
});

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const logType = useWatch({ control: form.control, name: "logType" });

  // Reset form when initialLog changes (for editing different logs)
  useEffect(() => {
    if (open && initialLog) {
      form.reset(getFormValuesFromLog(initialLog));
    }
  }, [initialLog, open, form]);

  const handleOpen = () => {
    form.reset(initialLog ? getFormValuesFromLog(initialLog) : defaultValues);
    setStep("type");
  };

  const handleClose = () => {
    form.reset(defaultValues);
    setStep("type");
    onOpenChange(false);
  };

  const handleSave = async (values: FormValues) => {
    try {
      const logData = {
        type: values.logType,
        bristolType:
          values.logType === "bowel_movement"
            ? (values.bristolType as BristolType) ?? undefined
            : undefined,
        painLevel: values.painLevel as PainLevel,
        symptoms:
          values.symptoms.length > 0
            ? (values.symptoms as Symptom[])
            : undefined,
        triggerFoods:
          values.triggerFoods.length > 0
            ? (values.triggerFoods as TriggerFood[])
            : undefined,
        medication:
          values.logType === "medication" && values.medication
            ? values.medication
            : undefined,
        medicationDose:
          values.logType === "medication" && values.medicationDose
            ? values.medicationDose
            : undefined,
        notes: values.notes || undefined,
      };

      if (initialLog?.id) {
        await updateLog(initialLog.id, logData);
      } else {
        await addLog({
          ...logData,
          timestamp: new Date(),
        });
      }

      handleClose();
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
        if (newOpen) {
          handleOpen();
          onOpenChange(true);
        } else {
          handleClose();
        }
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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {step === "type" ? (
                    <>
                      <FormField
                        control={form.control}
                        name="logType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              What are you logging?
                            </FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-3 gap-3">
                                {logTypeOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                                      field.value === option.value
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
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {logType === "bowel_movement" && (
                        <FormField
                          control={form.control}
                          name="bristolType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <BristolSelector
                                  value={field.value as BristolType | null}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {logType === "meal" && (
                        <FormField
                          control={form.control}
                          name="triggerFoods"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ChipSelector
                                  label="Trigger Foods (optional)"
                                  options={Object.entries(
                                    TRIGGER_FOOD_LABELS
                                  ).map(([value, label]) => ({
                                    value: value as TriggerFood,
                                    label,
                                  }))}
                                  selected={field.value as TriggerFood[]}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {logType === "medication" && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="medication"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                  Medication Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g., Ibuprofen, Probiotics..."
                                    className="w-full p-3 h-auto rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="medicationDose"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                  Dose (optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g., 200mg, 1 tablet..."
                                    className="w-full p-3 h-auto rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="painLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <PainSlider
                                value={field.value as PainLevel}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ChipSelector
                                label="Symptoms (optional)"
                                options={Object.entries(SYMPTOM_LABELS).map(
                                  ([value, label]) => ({
                                    value: value as Symptom,
                                    label,
                                  })
                                )}
                                selected={field.value as Symptom[]}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              Notes (optional)
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                placeholder="Any additional notes..."
                                className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 resize-none h-24 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                  {step === "details" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("type")}
                      className="flex-1 h-14 rounded-2xl"
                    >
                      Back
                    </Button>
                  )}

                  {step === "type" ? (
                    <Button
                      type="button"
                      onClick={() => setStep("details")}
                      className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      {initialLog ? "Update Log" : "Save Log"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

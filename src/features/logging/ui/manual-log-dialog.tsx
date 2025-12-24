import { type LogEntry } from "@/shared/db";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Check, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useLogForm } from "../hooks/use-log-form";
import { LogDetailsForm } from "./log-form-sections/log-details-form";
import { LogTypeSelection } from "./log-form-sections/log-type-selection";

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

  const { step, setStep, logType, setLogType, handleSave, ...formProps } =
    useLogForm({
      initialLog,
      onSuccess: () => onOpenChange(false),
    });

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
              >
                <LogTypeSelection
                  selectedType={logType}
                  onSelect={(type) => {
                    setLogType(type);
                    setStep("details");
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="details-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <LogDetailsForm logType={logType} {...formProps} />
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

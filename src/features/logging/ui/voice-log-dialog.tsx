"use client";

import {
  addLog,
  db,
  BRISTOL_DESCRIPTIONS,
  SYMPTOM_LABELS,
  ANXIETY_MARKER_LABELS,
  type Symptom,
  type AnxietyMarker,
  type BristolType,
  type PainLevel,
  type StressLevel,
  type TriggerFood,
} from "@/shared/db";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { useLiveQuery } from "dexie-react-hooks";
import { Check, Loader2, Mic, MicOff, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { parseVoiceLog, type ParsedLogEntry } from "../actions/parse-voice-log";
import {
  SPEECH_LANGUAGES,
  useSpeechRecognition,
  type SpeechLanguageCode,
} from "../hooks/use-speech-recognition";
import { BristolPicker } from "./bristol-picker";
import { FodmapPicker } from "./fodmap-picker";
import { ChipSelector } from "./chip-selector";
import { LevelSlider } from "./level-slider";

const DEFAULT_VOICE_LANGUAGE: SpeechLanguageCode = "en-US";

interface VoiceLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "recording" | "processing" | "review" | "error";

export function VoiceLogDialog({ open, onOpenChange }: VoiceLogDialogProps) {
  const [step, setStep] = useState<Step>("recording");
  const [parsedData, setParsedData] = useState<ParsedLogEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Get language preference from DB
  const savedLanguage = useLiveQuery(() =>
    db.settings.get("voiceLanguage").then((s) => s?.value as SpeechLanguageCode)
  );
  const language = savedLanguage ?? DEFAULT_VOICE_LANGUAGE;

  const handleLanguageChange = async (code: SpeechLanguageCode) => {
    await db.settings.put({ id: "voiceLanguage", value: code });
    setShowLanguageMenu(false);
    resetTranscript();
  };

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({ language });

  const displayTranscript = transcript + interimTranscript;
  const finalTranscript = transcript;

  const showSpeechError = step === "recording" && !!speechError;
  const displayError = showSpeechError
    ? `Speech recognition error: ${speechError}`
    : errorMessage;
  const currentStep = showSpeechError ? "error" : step;

  const shouldCloseLanguageMenu = isListening && showLanguageMenu;
  if (shouldCloseLanguageMenu) {
    setShowLanguageMenu(false);
  }

  const resetDialog = () => {
    setStep("recording");
    setParsedData(null);
    setErrorMessage("");
    setShowLanguageMenu(false);
    resetTranscript();
  };

  const handleClose = () => {
    stopListening();
    resetDialog();
    onOpenChange(false);
  };

  const handleProcess = async () => {
    const textToProcess = finalTranscript.trim() || displayTranscript.trim();

    if (!textToProcess) {
      setErrorMessage("No speech detected. Please try again.");
      setStep("error");
      return;
    }

    stopListening();
    setStep("processing");

    const result = await parseVoiceLog(textToProcess, language);

    if (result.success) {
      setParsedData(result.data);
      setStep("review");
    } else {
      setErrorMessage(result.error);
      setStep("error");
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;

    try {
      await addLog({
        type: parsedData.type,
        timestamp: new Date(),
        bristolType: parsedData.bristolType as BristolType | undefined,
        painLevel: parsedData.painLevel as PainLevel | undefined,
        stressLevel: parsedData.stressLevel as StressLevel | undefined,
        symptoms: parsedData.symptoms as Symptom[],
        anxietyMarkers: parsedData.anxietyMarkers as AnxietyMarker[],
        foods: parsedData.foods as string[],
        triggerFoods: parsedData.triggerFoods as TriggerFood[],
        medication: parsedData.medication,
        medicationDose: parsedData.medicationDose,
        notes: parsedData.notes,
        aiGenerated: true,
        rawTranscript: transcript,
      });

      handleClose();
    } catch (error) {
      console.error("Failed to save log:", error);
      setErrorMessage("Failed to save log. Please try again.");
      setStep("error");
    }
  };

  const handleRetry = () => {
    resetDialog();
    startListening();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(newOpen) => !newOpen && handleClose()}
    >
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0"
      >
        <SheetHeader className="p-4 border-b border-slate-200 dark:border-slate-800 flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Voice Log
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isSupported ? (
            <div className="text-center py-8">
              <MicOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Speech Recognition Not Supported
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Your browser doesn&apos;t support speech recognition. Please
                try Chrome or Edge.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {currentStep === "recording" && (
                <motion.div
                  key="recording"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  {/* Language Selector */}
                  <div className="relative mb-4">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      disabled={isListening}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <ReactCountryFlag
                        countryCode={
                          SPEECH_LANGUAGES.find((l) => l.code === language)
                            ?.flag || "US"
                        }
                        className="size-6"
                        svg
                      />
                      <span>
                        {
                          SPEECH_LANGUAGES.find((l) => l.code === language)
                            ?.label
                        }
                      </span>
                    </button>

                    {/* Language Dropdown */}
                    <AnimatePresence>
                      {showLanguageMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-10"
                        >
                          {SPEECH_LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() =>
                                handleLanguageChange(lang.code)
                              }
                              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                                language === lang.code
                                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                  : "text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <ReactCountryFlag
                                countryCode={lang.flag}
                                svg
                                className="size-6"
                              />
                              <span>{lang.label}</span>
                              {language === lang.code && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mic Animation */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-500/20"
                      animate={
                        isListening
                          ? {
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0.2, 0.5],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-4 rounded-full bg-purple-500/30"
                      animate={
                        isListening
                          ? {
                              scale: [1, 1.2, 1],
                              opacity: [0.6, 0.3, 0.6],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <div className="absolute inset-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Mic className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {isListening ? "Listening..." : "Ready to Record"}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {isListening
                      ? "Speak naturally about what you ate, how you feel, or your symptoms."
                      : "Select your language above, then tap Start to begin recording."}
                  </p>

                  {/* Transcript Preview */}
                  {displayTranscript && (
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-left mb-4 max-h-32 overflow-y-auto">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        &quot;{transcript}
                        {interimTranscript && (
                          <span className="text-slate-400 dark:text-slate-500">
                            {interimTranscript}
                          </span>
                        )}
                        &quot;
                      </p>
                    </div>
                  )}

                  {/* Example prompts */}
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Try saying:</p>
                    <p>
                      &quot;Just had coffee and toast, feeling a bit
                      bloated&quot;
                    </p>
                    <p>&quot;Bathroom break, type 4, no pain&quot;</p>
                  </div>
                </motion.div>
              )}

              {currentStep === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <Loader2 className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Processing with AI...
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    AI is extracting health data from your voice log.
                  </p>
                </motion.div>
              )}

              {currentStep === "review" && parsedData && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                    <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Review and edit your log before saving:
                    </p>
                  </div>

                  {/* Parsed Data Display & Edit */}
                  <div className="space-y-4">
                    {/* Log Type Header */}
                    <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <span className="text-2xl">
                        {parsedData.type === "bowel_movement"
                          ? "💩"
                          : parsedData.type === "meal"
                          ? "🍽️"
                          : parsedData.type === "symptom"
                          ? "🤕"
                          : "💊"}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                          {parsedData.type.replace("_", " ")}
                        </p>
                        <p className="text-xs text-slate-500">Log Type</p>
                      </div>
                    </div>

                    {parsedData.type === "bowel_movement" && (
                      <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <BristolPicker
                          value={
                            (parsedData.bristolType as BristolType) || 4
                          }
                          onChange={(newType) =>
                            setParsedData({
                              ...parsedData,
                              bristolType: newType,
                            })
                          }
                          className="size-16 md:size-20 lg:size-10 shrink-0"
                        />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Bristol Type {parsedData.bristolType}
                          </p>
                          <p className="text-xs text-slate-500">
                            {
                              BRISTOL_DESCRIPTIONS[
                                (parsedData.bristolType as BristolType) || 4
                              ].description
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {(parsedData.type === "bowel_movement" ||
                      parsedData.type === "symptom") && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <LevelSlider
                          label="Pain Level"
                          value={(parsedData.painLevel as PainLevel) || 5}
                          onChange={(level) =>
                            setParsedData({
                              ...parsedData,
                              painLevel: level as PainLevel,
                            })
                          }
                          type="pain"
                        />
                      </div>
                    )}

                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <LevelSlider
                        label="Stress Level"
                        value={(parsedData.stressLevel as StressLevel) || 5}
                        onChange={(level) =>
                          setParsedData({
                            ...parsedData,
                            stressLevel: level as StressLevel,
                          })
                        }
                        type="stress"
                      />
                    </div>

                    <ChipSelector
                      label="Symptoms"
                      options={Object.entries(SYMPTOM_LABELS).map(
                        ([value, label]) => ({
                          value: value as Symptom,
                          label,
                        })
                      )}
                      selected={(parsedData.symptoms as Symptom[]) || []}
                      onChange={(newSymptoms) =>
                        setParsedData({
                          ...parsedData,
                          symptoms: newSymptoms,
                        })
                      }
                    />

                    <ChipSelector
                      label="Mental State / Anxiety"
                      options={Object.entries(ANXIETY_MARKER_LABELS).map(
                        ([value, label]) => ({
                          value: value as AnxietyMarker,
                          label,
                        })
                      )}
                      selected={(parsedData.anxietyMarkers as AnxietyMarker[]) || []}
                      onChange={(newMarkers) =>
                        setParsedData({
                          ...parsedData,
                          anxietyMarkers: newMarkers,
                        })
                      }
                    />

                    <div className="space-y-2">
                      <FodmapPicker
                        selectedFoods={parsedData.foods || []}
                        onChange={(newFoods) =>
                          setParsedData({ ...parsedData, foods: newFoods })
                        }
                      />
                    </div>

                    {parsedData.medication && (
                      <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <span className="text-2xl">💊</span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {parsedData.medication}
                          </p>
                          <p className="text-xs text-slate-500">
                            {parsedData.medicationDose
                              ? `Dose: ${parsedData.medicationDose}`
                              : "Medication"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Notes
                      </label>
                      <textarea
                        value={parsedData.notes || ""}
                        onChange={(e) =>
                          setParsedData({
                            ...parsedData,
                            notes: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none h-24 text-sm"
                        placeholder="Add any additional notes..."
                      />
                    </div>
                  </div>

                  {/* Original Transcript */}
                  <div className="text-xs text-slate-400 mt-4">
                    <p className="mb-1">Original transcript:</p>
                    <p className="italic">&quot;{transcript}&quot;</p>
                  </div>
                </motion.div>
              )}

              {currentStep === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {displayError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {isSupported && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
            {currentStep === "recording" && (
              <>
                {isListening ? (
                  <Button
                    onClick={handleProcess}
                    disabled={!displayTranscript.trim()}
                    className="flex-1 h-14 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Done Speaking
                  </Button>
                ) : (
                  <Button
                    onClick={startListening}
                    className="flex-1 h-14 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Listening
                  </Button>
                )}
              </>
            )}

            {currentStep === "review" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="flex-1 h-14 rounded-2xl"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Save Log
                </Button>
              </>
            )}

            {currentStep === "error" && (
              <Button
                onClick={handleRetry}
                className="flex-1 h-14 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white"
              >
                Try Again
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
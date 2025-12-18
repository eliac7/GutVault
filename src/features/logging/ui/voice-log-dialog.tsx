"use client";

import {
  addLog,
  db,
  BRISTOL_DESCRIPTIONS,
  SYMPTOM_LABELS,
  type Symptom,
} from "@/shared/db";
import { BristolImage } from "@/shared/ui/bristol-image";
import {
  TriggerFood,
  type BristolType,
  type PainLevel,
} from "@/shared/db/types";
import { Button } from "@/shared/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
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
        symptoms: parsedData.symptoms as Symptom[],
        foods: parsedData.foods as string[],
        triggerFoods: parsedData.triggerFoods as TriggerFood[],
        medication: parsedData.medication,
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
    <Dialog.Root
      open={open}
      onOpenChange={(newOpen) => !newOpen && handleClose()}
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
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Voice Log
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <X className="w-5 h-5" />
                </Button>
              </Dialog.Close>
            </div>

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
                          AI extracted the following from your voice:
                        </p>
                      </div>

                      {/* Parsed Data Display */}
                      <div className="space-y-3">
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

                        {parsedData.bristolType && (
                          <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <BristolImage
                              type={parsedData.bristolType as BristolType}
                              className="size-16 md:size-20 lg:size-10"
                            />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                Bristol Type {parsedData.bristolType}
                              </p>
                              <p className="text-xs text-slate-500">
                                {
                                  BRISTOL_DESCRIPTIONS[
                                    parsedData.bristolType as BristolType
                                  ].description
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {parsedData.painLevel && (
                          <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <span className="text-2xl">
                              {parsedData.painLevel <= 3
                                ? "😊"
                                : parsedData.painLevel <= 6
                                ? "😣"
                                : "😖"}
                            </span>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                Pain Level: {parsedData.painLevel}/10
                              </p>
                              <p className="text-xs text-slate-500">
                                Pain Scale
                              </p>
                            </div>
                          </div>
                        )}

                        {parsedData.symptoms &&
                          parsedData.symptoms.length > 0 && (
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                                Symptoms
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {parsedData.symptoms.map((symptom) => {
                                  const displayLabel =
                                    SYMPTOM_LABELS[symptom as Symptom] ||
                                    symptom;
                                  return (
                                    <span
                                      key={symptom}
                                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs"
                                    >
                                      {displayLabel}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {parsedData.foods && parsedData.foods.length > 0 && (
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                              Foods
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.foods.map((food) => (
                                <span
                                  key={food}
                                  className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs"
                                >
                                  {food}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.notes && (
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                              Notes
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {parsedData.notes}
                            </p>
                          </div>
                        )}
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
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

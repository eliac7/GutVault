"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

export const SPEECH_LANGUAGES = [
  { code: "en-US", labelKey: "speech.languages.enUS", flag: "US" },
  { code: "el-GR", labelKey: "speech.languages.elGR", flag: "GR" },
  { code: "en-GB", labelKey: "speech.languages.enGB", flag: "GB" },
  { code: "es-ES", labelKey: "speech.languages.esES", flag: "ES" },
  { code: "fr-FR", labelKey: "speech.languages.frFR", flag: "FR" },
  { code: "de-DE", labelKey: "speech.languages.deDE", flag: "DE" },
  { code: "it-IT", labelKey: "speech.languages.itIT", flag: "IT" },
  { code: "pt-BR", labelKey: "speech.languages.ptBR", flag: "BR" },
  { code: "nl-NL", labelKey: "speech.languages.nlNL", flag: "NL" },
  { code: "pl-PL", labelKey: "speech.languages.plPL", flag: "PL" },
  { code: "ru-RU", labelKey: "speech.languages.ruRU", flag: "RU" },
  { code: "ja-JP", labelKey: "speech.languages.jaJP", flag: "JP" },
  { code: "ko-KR", labelKey: "speech.languages.koKR", flag: "KR" },
  { code: "zh-CN", labelKey: "speech.languages.zhCN", flag: "CN" },
  { code: "ar-SA", labelKey: "speech.languages.arSA", flag: "SA" },
  { code: "hi-IN", labelKey: "speech.languages.hiIN", flag: "IN" },
] as const;

export type SpeechLanguageCode = (typeof SPEECH_LANGUAGES)[number]["code"];

export function useTranslatedSpeechLanguages() {
  const t = useTranslations();

  return SPEECH_LANGUAGES.map((lang) => ({
    ...lang,
    label: t(lang.labelKey),
  }));
}

interface UseSpeechRecognitionOptions {
  language?: SpeechLanguageCode;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const getSpeechRecognitionAPI = () => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { language = "en-US" } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = useMemo(() => !!getSpeechRecognitionAPI(), []);

  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        let text = result[0].transcript;

        if (i > 0) {
          const prevText = event.results[i - 1][0].transcript;
          if (text.startsWith(prevText)) {
            text = text.slice(prevText.length);
          }
        }

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      setTranscript(finalText);
      setInterimTranscript(interimText);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setInterimTranscript("");
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start error:", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

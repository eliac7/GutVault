"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

export const SPEECH_LANGUAGES = [
  { code: "en-US", label: "English (US)", flag: "US" },
  { code: "el-GR", label: "Ελληνικά", flag: "GR" },
  { code: "en-GB", label: "English (UK)", flag: "GB" },
  { code: "es-ES", label: "Español", flag: "ES" },
  { code: "fr-FR", label: "Français", flag: "FR" },
  { code: "de-DE", label: "Deutsch", flag: "DE" },
  { code: "it-IT", label: "Italiano", flag: "IT" },
  { code: "pt-BR", label: "Português (BR)", flag: "BR" },
  { code: "nl-NL", label: "Nederlands", flag: "NL" },
  { code: "pl-PL", label: "Polski", flag: "PL" },
  { code: "ru-RU", label: "Русский", flag: "RU" },
  { code: "ja-JP", label: "日本語", flag: "JP" },
  { code: "ko-KR", label: "한국어", flag: "KR" },
  { code: "zh-CN", label: "中文 (简体)", flag: "CN" },
  { code: "ar-SA", label: "العربية", flag: "SA" },
  { code: "hi-IN", label: "हिन्दी", flag: "IN" },
] as const;

export type SpeechLanguageCode = (typeof SPEECH_LANGUAGES)[number]["code"];

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

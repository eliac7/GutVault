"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface FlareContextType {
  isFlareMode: boolean;
  toggleFlareMode: () => void;
  setFlareMode: (active: boolean) => void;
}

const FlareContext = createContext<FlareContextType | undefined>(undefined);

export function FlareProvider({ children }: { children: React.ReactNode }) {
  const [isFlareMode, setIsFlareMode] = useState(false);

  const toggleFlareMode = useCallback(() => {
    setIsFlareMode((prev) => !prev);
  }, []);

  const setFlareMode = useCallback((active: boolean) => {
    setIsFlareMode(active);
  }, []);

  return (
    <FlareContext.Provider value={{ isFlareMode, toggleFlareMode, setFlareMode }}>
      {children}
    </FlareContext.Provider>
  );
}

export function useFlareMode() {
  const context = useContext(FlareContext);
  if (context === undefined) {
    throw new Error("useFlareMode must be used within a FlareProvider");
  }
  return context;
}

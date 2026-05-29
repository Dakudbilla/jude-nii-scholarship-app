"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CycleState {
  id: string;
  label: string;
}

interface CycleContextType {
  selectedCycle: CycleState | null;
  selectCycle: (id: string, label: string) => void;
  clearCycle: () => void;
  isReady: boolean;
}

const STORAGE_KEY = "jude_nii_admin_cycle";

const CycleContext = createContext<CycleContextType | undefined>(undefined);

function isValidCycleState(value: unknown): value is CycleState {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CycleState).id === "string" &&
    (value as CycleState).id.length > 0 &&
    typeof (value as CycleState).label === "string"
  );
}

function readCycleFromStorage(): CycleState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    return isValidCycleState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function CycleProvider({ children }: { children: ReactNode }) {
  // Lazy initialiser reads localStorage exactly once on mount — avoids a
  // synchronous setState call inside useEffect.
  const [selectedCycle, setSelectedCycle] = useState<CycleState | null>(readCycleFromStorage);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Marking ready after mount is the standard SSR hydration guard pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);
  }, []);

  const selectCycle = (id: string, label: string) => {
    const cycle = { id, label };
    setSelectedCycle(cycle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
  };

  const clearCycle = () => {
    setSelectedCycle(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CycleContext.Provider value={{ selectedCycle, selectCycle, clearCycle, isReady }}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
}

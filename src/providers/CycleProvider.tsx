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

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function CycleProvider({ children }: { children: ReactNode }) {
  const [selectedCycle, setSelectedCycle] = useState<CycleState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("jude_nii_admin_cycle");
    if (saved) {
      try {
        setSelectedCycle(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved cycle", e);
      }
    }
    setIsReady(true);
  }, []);

  const selectCycle = (id: string, label: string) => {
    const cycle = { id, label };
    setSelectedCycle(cycle);
    localStorage.setItem("jude_nii_admin_cycle", JSON.stringify(cycle));
  };

  const clearCycle = () => {
    setSelectedCycle(null);
    localStorage.removeItem("jude_nii_admin_cycle");
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

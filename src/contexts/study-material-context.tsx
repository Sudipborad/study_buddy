'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface StudyMaterialContextType {
  studyMaterial: string | null;
  setStudyMaterial: (material: string | null) => void;
}

export const StudyMaterialContext = createContext<StudyMaterialContextType>({
  studyMaterial: null,
  setStudyMaterial: () => {},
});

export const StudyMaterialProvider = ({ children }: { children: ReactNode }) => {
  const [studyMaterial, setStudyMaterial] = useState<string | null>(null);

  return (
    <StudyMaterialContext.Provider value={{ studyMaterial, setStudyMaterial }}>
      {children}
    </StudyMaterialContext.Provider>
  );
};

"use client";

import React, { createContext, useState, ReactNode } from "react";
import { type Flashcard, type DocumentSummary } from "@/lib/types";

interface StudyMaterialContextType {
  studyMaterial: string | null;
  setStudyMaterial: (material: string | null) => void;
  documentTitle: string | null;
  setDocumentTitle: (title: string | null) => void;
  summary: DocumentSummary | null;
  setSummary: (summary: DocumentSummary | null) => void;
  flashcards: Flashcard[];
  setFlashcards: (flashcards: Flashcard[]) => void;
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;
}

export const StudyMaterialContext = createContext<StudyMaterialContextType>({
  studyMaterial: null,
  setStudyMaterial: () => {},
  documentTitle: null,
  setDocumentTitle: () => {},
  summary: null,
  setSummary: () => {},
  flashcards: [],
  setFlashcards: () => {},
  isSaved: false,
  setIsSaved: () => {},
});

export const StudyMaterialProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [studyMaterial, setStudyMaterial] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  return (
    <StudyMaterialContext.Provider
      value={{
        studyMaterial,
        setStudyMaterial,
        documentTitle,
        setDocumentTitle,
        summary,
        setSummary,
        flashcards,
        setFlashcards,
        isSaved,
        setIsSaved,
      }}
    >
      {children}
    </StudyMaterialContext.Provider>
  );
};

'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { type CvData } from '@/lib/types';

interface CvDataContextType {
  cvData: CvData | null;
  setCvData: (data: CvData | null) => void;
}

export const CvDataContext = createContext<CvDataContextType>({
  cvData: null,
  setCvData: () => {},
});

export const CvDataProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CvData | null>(null);

  return (
    <CvDataContext.Provider value={{ cvData, setCvData }}>
      {children}
    </CvDataContext.Provider>
  );
};

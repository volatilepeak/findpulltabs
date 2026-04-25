'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DarkModeContextType {
  dark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({ dark: true, toggle: () => {} });

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('fpt-dark');
    if (saved !== null) {
      setDark(saved === 'true');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('fpt-dark', String(dark));
  }, [dark]);

  return (
    <DarkModeContext.Provider value={{ dark, toggle: () => setDark(!dark) }}>
      {children}
    </DarkModeContext.Provider>
  );
}

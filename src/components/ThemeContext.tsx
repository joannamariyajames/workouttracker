import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'stealth' | 'elite' | 'endurance' | 'brutalist';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('ironpulse-theme');
    return (saved as Theme) || 'brutalist'; // Set brutalist as default now
  });

  useEffect(() => {
    localStorage.setItem('ironpulse-theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-stealth', 'theme-elite', 'theme-endurance', 'theme-brutalist');
    root.classList.add(`theme-${theme}`);
    
    // Apply body style too for safety
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

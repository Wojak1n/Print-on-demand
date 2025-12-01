import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Force light mode - dark mode disabled
  const [isDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Always remove dark class to ensure light mode
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('darkMode');
  }, []);

  const toggleDarkMode = () => {
    // Do nothing - dark mode is disabled
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};


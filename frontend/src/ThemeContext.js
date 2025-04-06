import React, { createContext, useContext, useState, useEffect } from "react";

const defaultThemeState = {
  darkMode: false,
  toggleTheme: () => {}
};

const ThemeContext = createContext(defaultThemeState);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (error) {
      console.error("Error reading theme preference:", error);
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
      document.body.style.backgroundColor = darkMode ? "#121212" : "#f5f7fa";
      document.body.style.color = darkMode ? "#ffffff" : "#333333";
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn("useTheme must be used within a ThemeProvider");
    return defaultThemeState;
  }
  return context;
};

// src/lib/context/theme-context.tsx (ENHANCED - Fixed primary light and border classes)
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/use-user";

export type ColorTheme =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "indigo";
export type DarkMode = "light" | "dark" | "system";

interface ThemeContextType {
  colorTheme: ColorTheme;
  darkMode: DarkMode;
  isDark: boolean;
  setColorTheme: (theme: ColorTheme) => void;
  setDarkMode: (mode: DarkMode) => void;
  getThemeClasses: () => ThemeClasses;
}

interface ThemeClasses {
  // Primary colors - enhanced variants
  primary: string;
  primaryHover: string;
  primaryFocus: string;
  primaryLight: string;
  primaryBorder: string;
  primaryText: string;
  primaryGradient: string;
  primaryShadow: string;

  // Backgrounds - more variants
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundAccent: string;

  // Text colors - enhanced hierarchy
  text: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;

  // Borders - more variants
  border: string;
  borderLight: string;
  borderAccent: string;

  // Interactive states - enhanced
  hover: string;
  active: string;
  focus: string;

  // Card styles - enhanced
  card: string;
  cardHover: string;
  cardElevated: string;

  // Status colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// FIXED: Enhanced color theme map with proper light and border classes
const colorThemeMap: Record<ColorTheme, any> = {
  blue: {
    light: {
      primary: "bg-blue-600",
      primaryHover: "hover:bg-blue-700",
      primaryFocus: "focus:ring-blue-500",
      primaryLight: "bg-blue-50",
      primaryBorder: "border-blue-200",
      primaryText: "text-blue-600",
      primaryGradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      primaryShadow: "shadow-blue-500/25",
    },
    dark: {
      primary: "bg-blue-500",
      primaryHover: "hover:bg-blue-400",
      primaryFocus: "focus:ring-blue-400",
      primaryLight: "bg-blue-900/20",
      primaryBorder: "border-blue-500/30",
      primaryText: "text-blue-400",
      primaryGradient: "bg-gradient-to-r from-blue-400 to-blue-500",
      primaryShadow: "shadow-blue-400/25",
    },
  },
  green: {
    light: {
      primary: "bg-green-600",
      primaryHover: "hover:bg-green-700",
      primaryFocus: "focus:ring-green-500",
      primaryLight: "bg-green-50",
      primaryBorder: "border-green-200",
      primaryText: "text-green-600",
      primaryGradient: "bg-gradient-to-r from-green-500 to-green-600",
      primaryShadow: "shadow-green-500/25",
    },
    dark: {
      primary: "bg-green-500",
      primaryHover: "hover:bg-green-400",
      primaryFocus: "focus:ring-green-400",
      primaryLight: "bg-green-900/20",
      primaryBorder: "border-green-500/30",
      primaryText: "text-green-400",
      primaryGradient: "bg-gradient-to-r from-green-400 to-green-500",
      primaryShadow: "shadow-green-400/25",
    },
  },
  purple: {
    light: {
      primary: "bg-purple-600",
      primaryHover: "hover:bg-purple-700",
      primaryFocus: "focus:ring-purple-500",
      primaryLight: "bg-purple-50",
      primaryBorder: "border-purple-200",
      primaryText: "text-purple-600",
      primaryGradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      primaryShadow: "shadow-purple-500/25",
    },
    dark: {
      primary: "bg-purple-500",
      primaryHover: "hover:bg-purple-400",
      primaryFocus: "focus:ring-purple-400",
      primaryLight: "bg-purple-900/20",
      primaryBorder: "border-purple-500/30",
      primaryText: "text-purple-400",
      primaryGradient: "bg-gradient-to-r from-purple-400 to-purple-500",
      primaryShadow: "shadow-purple-400/25",
    },
  },
  red: {
    light: {
      primary: "bg-red-600",
      primaryHover: "hover:bg-red-700",
      primaryFocus: "focus:ring-red-500",
      primaryLight: "bg-red-50",
      primaryBorder: "border-red-200",
      primaryText: "text-red-600",
      primaryGradient: "bg-gradient-to-r from-red-500 to-red-600",
      primaryShadow: "shadow-red-500/25",
    },
    dark: {
      primary: "bg-red-500",
      primaryHover: "hover:bg-red-400",
      primaryFocus: "focus:ring-red-400",
      primaryLight: "bg-red-900/20",
      primaryBorder: "border-red-500/30",
      primaryText: "text-red-400",
      primaryGradient: "bg-gradient-to-r from-red-400 to-red-500",
      primaryShadow: "shadow-red-400/25",
    },
  },
  orange: {
    light: {
      primary: "bg-orange-600",
      primaryHover: "hover:bg-orange-700",
      primaryFocus: "focus:ring-orange-500",
      primaryLight: "bg-orange-50",
      primaryBorder: "border-orange-200",
      primaryText: "text-orange-600",
      primaryGradient: "bg-gradient-to-r from-orange-500 to-orange-600",
      primaryShadow: "shadow-orange-500/25",
    },
    dark: {
      primary: "bg-orange-500",
      primaryHover: "hover:bg-orange-400",
      primaryFocus: "focus:ring-orange-400",
      primaryLight: "bg-orange-900/20",
      primaryBorder: "border-orange-500/30",
      primaryText: "text-orange-400",
      primaryGradient: "bg-gradient-to-r from-orange-400 to-orange-500",
      primaryShadow: "shadow-orange-400/25",
    },
  },
  indigo: {
    light: {
      primary: "bg-indigo-600",
      primaryHover: "hover:bg-indigo-700",
      primaryFocus: "focus:ring-indigo-500",
      primaryLight: "bg-indigo-50",
      primaryBorder: "border-indigo-200",
      primaryText: "text-indigo-600",
      primaryGradient: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      primaryShadow: "shadow-indigo-500/25",
    },
    dark: {
      primary: "bg-indigo-500",
      primaryHover: "hover:bg-indigo-400",
      primaryFocus: "focus:ring-indigo-400",
      primaryLight: "bg-indigo-900/20",
      primaryBorder: "border-indigo-500/30",
      primaryText: "text-indigo-400",
      primaryGradient: "bg-gradient-to-r from-indigo-400 to-indigo-500",
      primaryShadow: "shadow-indigo-400/25",
    },
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
  const [darkMode, setDarkMode] = useState<DarkMode>("system");
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from user preferences
  useEffect(() => {
    if (user?.theme) {
      setColorTheme(user.theme as ColorTheme);
    }

    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") as DarkMode;
    if (savedDarkMode) {
      setDarkMode(savedDarkMode);
    }
  }, [user]);

  // Handle dark mode changes
  useEffect(() => {
    const updateDarkMode = () => {
      if (darkMode === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDark(systemDark);
      } else {
        setIsDark(darkMode === "dark");
      }
    };

    updateDarkMode();

    if (darkMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateDarkMode);
      return () => mediaQuery.removeEventListener("change", updateDarkMode);
    }
  }, [darkMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save dark mode preference
    localStorage.setItem("darkMode", darkMode);
  }, [isDark, darkMode]);

  const getThemeClasses = (): ThemeClasses => {
    const colorClasses = colorThemeMap[colorTheme][isDark ? "dark" : "light"];

    return {
      ...colorClasses,

      // Base theme classes - enhanced
      background: isDark ? "bg-gray-900" : "bg-white",
      backgroundSecondary: isDark ? "bg-gray-800" : "bg-gray-50",
      backgroundTertiary: isDark ? "bg-gray-700" : "bg-gray-100",
      backgroundAccent: isDark ? "bg-gray-750" : "bg-gray-25",

      text: isDark ? "text-gray-100" : "text-gray-900",
      textSecondary: isDark ? "text-gray-300" : "text-gray-600",
      textMuted: isDark ? "text-gray-400" : "text-gray-500",
      textAccent: isDark ? "text-gray-200" : "text-gray-700",

      border: isDark ? "border-gray-600" : "border-gray-200",
      borderLight: isDark ? "border-gray-700" : "border-gray-100",
      borderAccent: isDark ? "border-gray-500" : "border-gray-300",

      hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
      active: isDark ? "bg-gray-600" : "bg-gray-200",
      focus: isDark ? "focus:bg-gray-700" : "focus:bg-gray-100",

      card: isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
      cardHover: isDark ? "hover:bg-gray-750" : "hover:bg-gray-50",
      cardElevated: isDark
        ? "bg-gray-800 border-gray-600 shadow-xl"
        : "bg-white border-gray-200 shadow-lg",

      // Status colors - consistent across themes
      success: isDark ? "text-green-400" : "text-green-600",
      successLight: isDark
        ? "bg-green-900/20 text-green-300"
        : "bg-green-50 text-green-700",
      warning: isDark ? "text-yellow-400" : "text-yellow-600",
      warningLight: isDark
        ? "bg-yellow-900/20 text-yellow-300"
        : "bg-yellow-50 text-yellow-700",
      error: isDark ? "text-red-400" : "text-red-600",
      errorLight: isDark
        ? "bg-red-900/20 text-red-300"
        : "bg-red-50 text-red-700",
      info: isDark ? "text-blue-400" : "text-blue-600",
      infoLight: isDark
        ? "bg-blue-900/20 text-blue-300"
        : "bg-blue-50 text-blue-700",
    };
  };

  const handleSetDarkMode = (mode: DarkMode) => {
    setDarkMode(mode);
  };

  const handleSetColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        darkMode,
        isDark,
        setColorTheme: handleSetColorTheme,
        setDarkMode: handleSetDarkMode,
        getThemeClasses,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

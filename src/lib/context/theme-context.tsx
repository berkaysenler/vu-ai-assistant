"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/use-user";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themeColors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeMap = {
  blue: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    primaryLight: "bg-blue-100",
  },
  green: {
    primary: "bg-green-600",
    primaryHover: "hover:bg-green-700",
    primaryLight: "bg-green-100",
  },
  purple: {
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    primaryLight: "bg-purple-100",
  },
  red: {
    primary: "bg-red-600",
    primaryHover: "hover:bg-red-700",
    primaryLight: "bg-red-100",
  },
  orange: {
    primary: "bg-orange-600",
    primaryHover: "hover:bg-orange-700",
    primaryLight: "bg-orange-100",
  },
  indigo: {
    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",
    primaryLight: "bg-indigo-100",
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [theme, setTheme] = useState("blue");

  useEffect(() => {
    if (user && (user as any).theme) {
      setTheme((user as any).theme);
    }
  }, [user]);

  const themeColors = themeMap[theme as keyof typeof themeMap] || themeMap.blue;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors }}>
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

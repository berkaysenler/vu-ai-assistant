// src/components/ui/theme-selector.tsx (FIXED - No transparency in dark mode)
"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, ColorTheme, DarkMode } from "@/lib/context/theme-context";

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    colorTheme,
    darkMode,
    isDark,
    setColorTheme,
    setDarkMode,
    getThemeClasses,
  } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themeClasses = getThemeClasses();

  const colorThemes: {
    value: ColorTheme;
    name: string;
    color: string;
    darkColor: string;
  }[] = [
    {
      value: "blue",
      name: "Blue",
      color: "bg-blue-500",
      darkColor: "bg-blue-400",
    },
    {
      value: "green",
      name: "Green",
      color: "bg-green-500",
      darkColor: "bg-green-400",
    },
    {
      value: "purple",
      name: "Purple",
      color: "bg-purple-500",
      darkColor: "bg-purple-400",
    },
    { value: "red", name: "Red", color: "bg-red-500", darkColor: "bg-red-400" },
    {
      value: "orange",
      name: "Orange",
      color: "bg-orange-500",
      darkColor: "bg-orange-400",
    },
    {
      value: "indigo",
      name: "Indigo",
      color: "bg-indigo-500",
      darkColor: "bg-indigo-400",
    },
  ];

  const darkModeOptions: { value: DarkMode; name: string; icon: string }[] = [
    {
      value: "light",
      name: "Light",
      icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      value: "dark",
      name: "Dark",
      icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
    },
    {
      value: "system",
      name: "System",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentColorTheme = () =>
    colorThemes.find((t) => t.value === colorTheme);
  const getCurrentDarkMode = () =>
    darkModeOptions.find((m) => m.value === darkMode);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${themeClasses.hover} ${themeClasses.textSecondary} flex items-center space-x-2`}
        title="Theme Settings"
      >
        <div className="flex items-center space-x-1">
          {/* Color indicator */}
          <div
            className={`w-4 h-4 ${isDark ? getCurrentColorTheme()?.darkColor : getCurrentColorTheme()?.color} rounded-full`}
          ></div>

          {/* Dark mode indicator */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={getCurrentDarkMode()?.icon}
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu - FIXED: Solid background in dark mode */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-64 ${themeClasses.background} ${themeClasses.border} border rounded-lg shadow-xl z-50 py-2`}
          style={{
            animation: "fadeIn 0.15s ease-out",
            // Ensure solid background in dark mode
            backgroundColor: isDark ? "rgb(31, 41, 55)" : "white",
            boxShadow: isDark
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Color Theme Section */}
          <div className="px-3 py-2">
            <h3 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
              Color Theme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    setColorTheme(theme.value);
                  }}
                  className={`relative p-3 rounded-lg transition-colors flex flex-col items-center space-y-2 ${
                    colorTheme === theme.value
                      ? `${themeClasses.primaryLight} ${themeClasses.primaryBorder} border-2`
                      : `${themeClasses.hover} ${themeClasses.border} border`
                  }`}
                >
                  <div
                    className={`w-6 h-6 ${isDark ? theme.darkColor : theme.color} rounded-full shadow-sm`}
                  ></div>
                  <span className={`text-xs font-medium ${themeClasses.text}`}>
                    {theme.name}
                  </span>
                  {colorTheme === theme.value && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className={`h-px ${themeClasses.borderLight} my-2`}></div>

          {/* Dark Mode Section */}
          <div className="px-3 py-2">
            <h3 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
              Brightness
            </h3>
            <div className="space-y-1">
              {darkModeOptions.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    setDarkMode(mode.value);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    darkMode === mode.value
                      ? `${themeClasses.primaryLight} ${themeClasses.primaryText} font-medium`
                      : `${themeClasses.hover} ${themeClasses.textSecondary}`
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={mode.icon}
                    />
                  </svg>
                  <span className="text-sm">{mode.name}</span>
                  {darkMode === mode.value && (
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className={`h-px ${themeClasses.borderLight} my-2`}></div>
          <div className="px-3 py-2">
            <div
              className={`text-xs ${themeClasses.textMuted} text-center font-medium`}
            >
              Currently: {getCurrentColorTheme()?.name} •{" "}
              {isDark ? "Dark" : "Light"}
            </div>
          </div>

          {/* Close Button */}
          <div className="px-3 py-2">
            <button
              onClick={() => setIsOpen(false)}
              className={`w-full px-3 py-2 text-sm ${themeClasses.textSecondary} ${themeClasses.hover} rounded-lg transition-colors text-center font-medium`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

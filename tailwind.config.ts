// tailwind.config.js (UPDATED - Safelist all theme colors)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  // IMPORTANT: Safelist all theme colors to prevent Tailwind from purging them
  safelist: [
    // Blue theme colors
    "bg-blue-50",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-900/20",
    "border-blue-200",
    "border-blue-500/30",
    "text-blue-400",
    "text-blue-600",
    "hover:bg-blue-400",
    "hover:bg-blue-700",
    "focus:ring-blue-400",
    "focus:ring-blue-500",

    // Green theme colors
    "bg-green-50",
    "bg-green-500",
    "bg-green-600",
    "bg-green-900/20",
    "border-green-200",
    "border-green-500/30",
    "text-green-400",
    "text-green-600",
    "hover:bg-green-400",
    "hover:bg-green-700",
    "focus:ring-green-400",
    "focus:ring-green-500",

    // Purple theme colors
    "bg-purple-50",
    "bg-purple-500",
    "bg-purple-600",
    "bg-purple-900/20",
    "border-purple-200",
    "border-purple-500/30",
    "text-purple-400",
    "text-purple-600",
    "hover:bg-purple-400",
    "hover:bg-purple-700",
    "focus:ring-purple-400",
    "focus:ring-purple-500",

    // Red theme colors
    "bg-red-50",
    "bg-red-500",
    "bg-red-600",
    "bg-red-900/20",
    "border-red-200",
    "border-red-500/30",
    "text-red-400",
    "text-red-600",
    "hover:bg-red-400",
    "hover:bg-red-700",
    "focus:ring-red-400",
    "focus:ring-red-500",

    // Orange theme colors
    "bg-orange-50",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-900/20",
    "border-orange-200",
    "border-orange-500/30",
    "text-orange-400",
    "text-orange-600",
    "hover:bg-orange-400",
    "hover:bg-orange-700",
    "focus:ring-orange-400",
    "focus:ring-orange-500",

    // Indigo theme colors
    "bg-indigo-50",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-900/20",
    "border-indigo-200",
    "border-indigo-500/30",
    "text-indigo-400",
    "text-indigo-600",
    "hover:bg-indigo-400",
    "hover:bg-indigo-700",
    "focus:ring-indigo-400",
    "focus:ring-indigo-500",

    // Additional variants that might be needed
    "border-2",
    "border",
  ],
  plugins: [],
};

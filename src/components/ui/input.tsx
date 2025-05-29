// src/components/ui/input.tsx (UPDATED - Dark mode compatible)
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/context/theme-context";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const { getThemeClasses } = useTheme();
    const themeClasses = getThemeClasses();

    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            // Theme-aware styles
            `${themeClasses.background} ${themeClasses.text} ${themeClasses.border} border`,
            // Focus styles
            `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${themeClasses.primaryFocus}`,
            // Placeholder styles
            `placeholder:${themeClasses.textMuted}`,
            // Error styles
            error &&
              "border-red-500 dark:border-red-400 focus-visible:ring-red-500 dark:focus-visible:ring-red-400",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className={`text-sm ${themeClasses.error}`}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

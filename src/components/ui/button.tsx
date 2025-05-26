import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/hooks/use-user";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { user } = useUser();
    const userTheme = user?.theme || "blue";

    const getThemeClasses = (theme: string) => {
      switch (theme) {
        case "green":
          return {
            primary: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
            primaryText: "text-green-600",
          };
        case "purple":
          return {
            primary: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
            primaryText: "text-purple-600",
          };
        case "red":
          return {
            primary: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            primaryText: "text-red-600",
          };
        case "orange":
          return {
            primary: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
            primaryText: "text-orange-600",
          };
        case "indigo":
          return {
            primary: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
            primaryText: "text-indigo-600",
          };
        default: // blue
          return {
            primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            primaryText: "text-blue-600",
          };
      }
    };

    const themeClasses = getThemeClasses(userTheme);

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants with theme support
            [themeClasses.primary]: variant === "default",
            "text-white": variant === "default",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-500":
              variant === "outline",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500":
              variant === "secondary",
            "hover:bg-gray-100 focus:ring-gray-500": variant === "ghost",
            [`${themeClasses.primaryText} underline-offset-4 hover:underline focus:ring-gray-500`]:
              variant === "link",

            // Sizes
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean; // Error state
  hint?: string;   // Hint text to display
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      disabled = false,
      error = false,
      hint = "",
      ...props
    },
    ref
  ) => {
    const textareaClasses = cn(
      "w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
      disabled
        ? "bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        : error
        ? "bg-transparent text-gray-400 border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800"
        : "bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800",
      className
    );

    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          {...props} // 👈 Cho phép react-hook-form register inject: onChange, onBlur, name, ref...
        />
        {hint && (
          <p
            className={`mt-2 text-sm ${
              error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;

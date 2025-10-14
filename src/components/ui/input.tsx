import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        // style giống AppHeader search input (tận dụng shadow-theme-xs)
        "h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs",
        "placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10",
        // dark mode (giữ lớp overlay nếu bạn muốn giống y hệt AppHeader)
        "dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
        // accessibility / disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // nice transitions
        "transition-colors duration-150 transition-[box-shadow]",
        // "xl:w-[430px]",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

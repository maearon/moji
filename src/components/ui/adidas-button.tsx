"use client"

import { BaseButton, BaseButtonProps } from "@/components/ui/base-button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"

interface AdidasButtonProps extends BaseButtonProps {
  href?: string
  children: ReactNode
  loading?: boolean
  showArrow?: boolean
  shadow?: boolean
  pressEffect?: boolean
  fullWidth?: boolean
  className?: string
  theme?: "white" | "black" | "transparent"
  border?: boolean
  sizeClass?: string
}

export function AdidasButton({
  href,
  children,
  loading = false,
  showArrow = true,
  shadow = true,
  pressEffect = false,
  fullWidth = false,
  variant = "default",
  className,
  theme = "white",
  border = false,
  size = "default",
  sizeClass = undefined,
  ...props
}: AdidasButtonProps) {
  const isBlack = theme === "black"
  const isTransparent = theme === "transparent"
  const isIconButton = size === "icon"

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number>()

  // 📏 Measure width only once when not loading
  useEffect(() => {
    if (!loading && buttonRef.current) {
      const width = buttonRef.current.getBoundingClientRect().width
      setMeasuredWidth(width)
    }
  }, [loading, children]) // Children changes may affect width

  const bg = isBlack ? "bg-black" : isTransparent ? "bg-transparent" : "bg-white"
  const hoverBg = isBlack ? "hover:bg-black" : isTransparent ? "hover:bg-transparent" : "hover:bg-white"
  const text = isBlack ? "text-white" : isTransparent ? "text-black dark:text-white" : "text-black"
  const hoverText = isBlack ? "hover:text-gray-500" : "hover:text-black"
  const shadowBorderClass = shadow
    ? isBlack
      ? "border-black dark:border-white"
      : isTransparent ? "border-white dark:border-white group-hover:border-gray-400" : "border-white group-hover:border-gray-400"
    : "border-transparent"
  const borderClass = !isIconButton
    ? border
      ? `border ${isBlack ? "border-black dark:border-white" : isTransparent ? "border-black dark:border-white" : "border-black dark:border-black"}`
      : "border border-transparent"
    : "border border-transparent"

  return (
    <div
      className={cn(
        "relative group",
        !isIconButton &&
          (fullWidth
            ? "w-full sm:max-w-full" // ✅ allow buttons to expand on both mobile and desktop when needed
            : "w-auto sm:max-w-fit"), // full on mobile, auto on desktop
      )}
    >
      {shadow && !isIconButton && (
        <span
          className={cn(
            "absolute inset-0 translate-x-[3px] translate-y-[3px] pointer-events-none z-0 transition-all border",
            shadowBorderClass
          )}
        />
      )}

      <BaseButton
        ref={buttonRef}
        asChild={!!href}
        disabled={loading}
        variant={variant}
        size={size}
        style={{ minWidth: loading ? measuredWidth : undefined }}
        className={cn(
          "relative z-10 inline-flex items-center justify-between text-base font-bold uppercase tracking-wide rounded-none transition-all outline-hidden ring-0",
          bg,
          hoverBg,
          text,
          hoverText,
          !isIconButton && borderClass,
          pressEffect && "active:translate-x-[3px] active:translate-y-[3px]",

          // Padding responsive theo Adidas
          sizeClass ?? (!isIconButton &&
              "min-h-[48px] px-[15px] sm:min-h-[50px] sm:px-[15px]"),
          fullWidth ? "w-full" : "w-auto",
          isIconButton &&
            "w-auto h-auto p-2 text-black bg-white/70 hover:bg-white rounded-full",
          loading &&
            "btn-loading",
            
          className
        )}
        {...props}
      >
        {href ? (
          <Link
            href={href}
            onClick={(e) => loading && e.preventDefault()}
            className="w-full h-full flex items-center justify-between"
          >
            <span className="-translate-y-px">{children}</span>
            {!isIconButton && (
              loading ? (
                <Loader2 className="ml-2 h-7 w-7 animate-spin" /> // 🔥 to hơn (3x so với arrow)
              ) : (
                showArrow && <span className="text-[22px] font-thin leading-none">⟶</span>
              )
            )}
          </Link>
        ) : (
          <>
            <span
              className={cn(
                "flex items-center",
                !isIconButton && "-translate-y-px"
              )}
            >
              {children}
            </span>
            {!isIconButton && (
              loading ? (
                <Loader2 className="ml-2 h-7 w-7 animate-spin" /> // 🔥 big loader
              ) : (
                showArrow && <span className="text-[22px] font-thin leading-none">⟶</span>
              )
            )}
          </>
        )}
      </BaseButton>
    </div>
  )
}

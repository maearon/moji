import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SupportedLocale } from "./constants/localeOptions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeLocale(input?: string | null): SupportedLocale {
  if (!input) return "en_US"
  const key = input.toLowerCase()

  const mapping: { patterns: string[]; locale: SupportedLocale }[] = [
    { patterns: ["en", "en-us", "us"], locale: "en_US" },
    { patterns: ["vi", "vi-vn", "vn"], locale: "vi_VN" },
    // { patterns: ["uk", "gb", "en-uk"], locale: "en_UK" }, // mở rộng sau
  ]

  for (const { patterns, locale } of mapping) {
    if (patterns.some((p) => key.includes(p))) {
      return locale
    }
  }

  return "en_US" // fallback
}

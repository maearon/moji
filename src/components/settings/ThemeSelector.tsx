"use client"

import React, { useEffect, useState } from "react"
import Label from "@/components/form/Label"
import Select from "@/components/form/Select"
import { ChevronDownIcon } from "@/icons"
import { useTranslations } from "@/hooks/useTranslations"
import { useTheme } from "../../context/ThemeContext"

export function ThemeSelector() {
  const { theme, toggleTheme } = useTheme()
  const t = useTranslations("settings")
  const [mounted, setMounted] = useState(false)

  // options cho select
  const options = [
    { value: "light", label: t?.appearance?.themeOptions?.light ?? "Light" },
    { value: "dark", label: t?.appearance?.themeOptions?.dark ?? "Dark" },
  ]

  // xử lý khi user chọn option
  const handleSelectChange = (value: string) => {
    if (value !== theme) {
      toggleTheme() // chỉ đổi theme nếu khác hiện tại
    }
  }

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-2">
      <Label htmlFor="theme">{t?.appearance?.theme}</Label>
      <div className="relative">
        <Select
          options={options}
          value={theme} // hiển thị theme hiện tại
          onChange={handleSelectChange}
          placeholder="Select theme"
          className="w-full h-10 rounded-md border border-input bg-background px-3 pr-10 text-base dark:bg-dark-900"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  )
}


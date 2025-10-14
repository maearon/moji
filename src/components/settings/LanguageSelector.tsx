"use client"

import React, { useEffect, useState } from "react"
import Label from "@/components/form/Label"
import Select from "@/components/form/Select"
import { ChevronDownIcon } from "@/icons"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/hooks/useLanguage"
import { SupportedLocale } from "@/lib/constants/localeOptions"

export function LanguageSelector() {
  const { locale, setLanguage } = useLanguage()
  const t = useTranslations("settings")
  const [mounted, setMounted] = useState(false)

  // options cho select
  const options = [
    { value: "en_US", label: t?.appearance?.languageOptions?.en_US ?? "English" },
    { value: "vi_VN", label: t?.appearance?.languageOptions?.vi_VN ?? "Tiếng Việt" },
  ]

  // xử lý khi user chọn option
  const handleSelectChange = (value: string) => {
    if (value !== locale) {
      setLanguage(value as SupportedLocale)
    }
  }

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-2">
      <Label htmlFor="language">{t?.appearance?.language}</Label>
      <div className="relative">
        <Select
          options={options}
          value={locale} // hiển thị ngôn ngữ hiện tại
          onChange={handleSelectChange}
          placeholder="Select language"
          className="w-full h-10 rounded-md border border-input bg-background px-3 pr-10 text-base dark:bg-dark-900"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  )
}


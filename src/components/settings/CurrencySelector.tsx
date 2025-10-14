"use client"

import { useState } from "react"
import { useTranslations } from "@/hooks/useTranslations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CurrencySelectorProps {
  value?: string
  onChange?: (value: string) => void
}

export function CurrencySelector({ value = "USD", onChange }: CurrencySelectorProps) {
  const t = useTranslations("settings")
  const [selectedCurrency, setSelectedCurrency] = useState(value)

  const handleCurrencyChange = (newValue: string) => {
    setSelectedCurrency(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="currency">{t?.appearance?.currency}</Label>
      <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">{t?.appearance?.currencyOptions?.USD}</SelectItem>
          <SelectItem value="VND">{t?.appearance?.currencyOptions?.VND}</SelectItem>
          <SelectItem value="EUR">{t?.appearance?.currencyOptions?.EUR}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}



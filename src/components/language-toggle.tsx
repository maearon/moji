"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { AdidasButton } from "@/components/ui/adidas-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

export function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdidasButton size="icon" className="border-2 border-foreground">
          <Globe className="h-4 w-4" />
        </AdidasButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-2 border-foreground">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setCurrentLanguage(language)}
            className={`cursor-pointer ${currentLanguage.code === language.code ? "bg-muted" : ""}`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

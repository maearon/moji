"use client";

import React from "react";
import { Globe, Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageTogglerTwo() {
  const { locale, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600"
    >
      {locale === "en_US" ? (
        <Languages className="w-5 h-5" />
      ) : (
        <Globe className="w-5 h-5" />
      )}
    </button>
  );
}

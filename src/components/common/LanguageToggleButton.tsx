"use client";

import React from "react";
import { Globe, Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const LanguageToggleButton: React.FC = () => {
  const { locale, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-900 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {locale === "en_US" ? (
        <Languages className="w-5 h-5" />
      ) : (
        <Globe className="w-5 h-5" />
      )}
    </button>
  );
};

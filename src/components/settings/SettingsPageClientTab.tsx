import { useTranslations } from "@/hooks/useTranslations";
import React, { useState } from "react";

const SettingsPageClientTab: React.FC = () => {
  const t = useTranslations("settings")
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree" | "optionFour" | "optionFive" | "optionSix"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree" | "optionFour" | "optionFive" | "optionSix") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => setSelected("optionOne")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionOne"
        )}`}
      >
        {t?.tabs?.store}
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionTwo"
        )}`}
      >
        {t?.tabs?.notifications}
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionThree"
        )}`}
      >
        {t?.tabs?.appearance}
      </button>

      <button
        onClick={() => setSelected("optionFour")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionFour"
        )}`}
      >
        {t?.tabs?.security}
      </button>

      <button
        onClick={() => setSelected("optionFive")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionFive"
        )}`}
      >
        {t?.tabs?.shipping}
      </button>

      <button
        onClick={() => setSelected("optionSix")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionSix"
        )}`}
      >
        {t?.tabs?.payment}
      </button>
    </div>
  );
};

export default SettingsPageClientTab;

"use client"

import { Eye, Edit, Plus } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type Mode = "view" | "edit" | "create"

interface ModeSwitcherProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
  disabled?: boolean
}

export function ModeSwitcher({ mode, onModeChange, disabled }: ModeSwitcherProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && onModeChange(value as Mode)}
      disabled={disabled}
      className="justify-start gap-2"
    >
      <ToggleGroupItem
        value="view"
        aria-label="View mode"
        className="border border-gray-200 dark:border-gray-800 px-3 py-1 rounded-lg 
                  data-[state=on]:border-brand-300 dark:data-[state=on]:border-brand-800
                  data-[state=on]:ring-3 data-[state=on]:ring-brand-500/10"
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </ToggleGroupItem>
      <ToggleGroupItem
        value="edit"
        aria-label="Edit mode"
        className="border border-gray-200 dark:border-gray-800 px-3 py-1 rounded-lg 
                  data-[state=on]:border-brand-300 dark:data-[state=on]:border-brand-800
                  data-[state=on]:ring-3 data-[state=on]:ring-brand-500/10"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </ToggleGroupItem>
      <ToggleGroupItem
        value="create"
        aria-label="Create mode"
        className="border border-gray-200 dark:border-gray-800 px-3 py-1 rounded-lg 
                  data-[state=on]:border-brand-300 dark:data-[state=on]:border-brand-800
                  data-[state=on]:ring-3 data-[state=on]:ring-brand-500/10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

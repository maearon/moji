"use client"

import { Input } from "@/components/ui/input"
import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { EnhancedSearchAutocomplete } from "./enhanced-search-autocomplete"
import { cn } from "@/lib/utils"

interface EnhancedSearchFieldProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  variant?: "header" | "page"
}

export function EnhancedSearchField({
  onSearch,
  placeholder = "Search or type command...",
  className = "",
  autoFocus = false,
  variant = "page",
}: EnhancedSearchFieldProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useState(searchParams.get("q") || "")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = searchText.trim()
    if (!query) return

    setShowAutocomplete(false)

    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/products?q=${encodeURIComponent(query)}`)
    }
  }

  function clearInput() {
    setSearchText("")
    setShowAutocomplete(false)
    if (onSearch) {
      onSearch("")
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchText(value)
    setShowAutocomplete(value.length > 0)
  }

  function handleFocus() {
    if (searchText.length > 0) setShowAutocomplete(true)
  }

  function handleBlur() {
    setTimeout(() => setShowAutocomplete(false), 200)
  }

  const inputClasses =
    variant === "header"
      ? "xl:w-[430px]"
      : ""
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        {/* Icon bên trái */}
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </span>

        {/* Input */}
        <Input
          ref={inputRef}
          type="text"
          name="q"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "h-11 rounded-lg pl-12 pr-14", // chỉ override padding & height
            variant === "header" && "sm:text-sm",
            inputClasses,
          )}
        />

        {/* Clear hoặc icon */}
        {searchText && (
          <X
            className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            onClick={clearInput}
          />
        )}

        {/* ⌘K nút bên phải */}
        {/* <button
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
          onClick={() => onSearch?.(searchText)}
        >
          <span>⌘</span>
          <span>K</span>
        </button> */}
      </div>

      {showAutocomplete && searchText && (
        <EnhancedSearchAutocomplete
          keyword={searchText}
          onSelect={(query) => {
            setSearchText(query)
            setShowAutocomplete(false)
            if (onSearch) {
              onSearch(query)
            } else {
              router.push(`/products?q=${encodeURIComponent(query)}`)
            }
          }}
        />
      )}
    </form>
  )
}

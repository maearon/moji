"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface SearchSuggestion {
  keyword: string
  count: number
}

interface SearchProduct {
  id: number | string
  name: string
  price: number
  sport?: string
  image?: string
  image_url?: string
  thumbnail?: string
}

interface SearchResponse {
  success: boolean
  data: {
    suggestions: SearchSuggestion[]
    products: SearchProduct[]
    query: string
  }
}

interface EnhancedSearchAutocompleteProps {
  keyword: string
  onSelect: (query: string) => void
}

export function EnhancedSearchAutocomplete({ keyword, onSelect }: EnhancedSearchAutocompleteProps) {
  const [data, setData] = useState<SearchResponse["data"] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!keyword || keyword.length < 2) {
      setData(null)
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(keyword)}`)
        const result: SearchResponse = await response.json()

        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [keyword])

  if (!keyword) return null

  return (
    <div className="absolute left-0 right-0 mt-2 z-50 bg-white border-2 border-foreground shadow-lg max-h-96 overflow-hidden">
      {loading ? (
        <div className="p-4 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Searching...</span>
        </div>
      ) : (
        <div className="flex max-h-96">
          {/* Suggestions Column */}
          <div className="w-1/2 p-4 border-r border-gray-200">
            <h4 className="font-bold text-sm uppercase mb-3 text-foreground">SUGGESTIONS</h4>
            {data?.suggestions && data.suggestions.length > 0 ? (
              <ul className="space-y-2">
                {data.suggestions.map((item) => (
                  <li
                    key={item.keyword}
                    className="flex justify-between items-center text-sm hover:bg-muted p-2 cursor-pointer"
                    onClick={() => onSelect(item.keyword)}
                  >
                    <span className="font-medium">{item.keyword}</span>
                    <span className="text-muted-foreground text-xs">({item.count})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No suggestions found</p>
            )}

            <button
              onClick={() => onSelect(keyword)}
              className="block mt-4 text-sm font-semibold text-foreground underline hover:opacity-80 w-full text-left"
            >
              SEE ALL "{keyword.toUpperCase()}"
            </button>
          </div>

          {/* Products Column */}
          <div className="w-1/2 p-4">
            <h4 className="font-bold text-sm uppercase mb-3 text-foreground">PRODUCTS</h4>
            {data?.products && data.products.length > 0 ? (
              <ul className="space-y-3">
                {data.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex gap-3 text-sm hover:bg-muted p-2 cursor-pointer"
                    onClick={() => onSelect(product.name)}
                  >
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0">
                      {(product.image || product.image_url || product.thumbnail) && (
                        <Image
                          src={product.image || product.image_url || product.thumbnail || ""}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{product.sport}</div>
                      <div className="font-medium text-sm truncate">{product.name}</div>
                      <div className="text-sm font-semibold">${product.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No products found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

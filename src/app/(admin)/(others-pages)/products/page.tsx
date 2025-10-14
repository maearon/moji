"use client"

import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Package, Plus, Filter, Grid, List, Search, Eye, Edit } from "lucide-react"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedSearchField } from "@/components/search/enhanced-search-field"
import Image from "next/image"
import ComponentCard from "@/components/common/ComponentCard"
import { useSearchProductsFeed } from "@/hooks/useProducts"
import Link from "next/link"
import { slugify } from "@/utils/slugify"
import { Mode } from "@/components/ui/mode-switcher"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import ProductListContainer from "@/components/ProductListContainer"
import { useTranslations } from "@/hooks/useTranslations"

interface Variant {
  variant_code: string
  avatar_url: string
  hover_url?: string
}

interface Product {
  id: number | string
  name: string
  title?: string
  slug?: string | null
  price: number
  original_price?: number
  sport?: string
  brand?: string
  category?: string
  main_image_url?: string
  hover_image_url?: string
  thumbnail?: string
  variants?: Variant[]
}

export default function ProductsPage() {
  const t = useTranslations("common")
  const t2 = useTranslations("productList")
  const searchParams = useSearchParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const query = searchParams.get("q") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage, 
    status,
    refetch,
  } = useSearchProductsFeed(query || 'a')

  const products: Product[] = data?.pages.flatMap((p) => p.products) || []
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const pagination = data?.pages?.[0]?.pagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12,
  }

  const handleSearch = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) params.set("q", searchQuery)
    else params.delete("q")
    params.set("page", "1")
    router.push(`/products?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/products?${params.toString()}`)
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageBreadcrumb pageTitle="Products" />
      {/* <ComponentCard title="All Products"> */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Products
            </h3>
            {products.length > 0 && (
              <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
                {t2?.showingResults?.replace('{count}', products.length.toString()).replace('{total}', totalCount.toString()) || `Showing ${products.length} of ${totalCount} results `}
                {(query || "a") && ` for "${query || "a"}"`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="flex flex-col sm:flex-row gap-3"> */}
            {/* <div className="flex-1 sm:w-80"> */}
            {/* <div className="flex gap-2"> */}
            <EnhancedSearchField
              placeholder="Search products..."
              onSearch={handleSearch}
              autoFocus={!!query}
              className="w-full"
            />
            {/* Grid view */}
            <AdidasButton
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={cn(
                "border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400",
                viewMode === "grid" &&
                  "border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400"
              )}
            >
              <Grid className="h-4 w-4" />
            </AdidasButton>
            {/* List view */}
            <AdidasButton
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                "border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] text-gray-700 dark:text-gray-400",
                viewMode === "list" &&
                  "border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400"
              )}
            >
              <List className="h-4 w-4" />
            </AdidasButton>
            {/* Filters */}
            {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <svg
                className="stroke-current fill-white dark:fill-gray-800"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
              </svg>
              Filter
            </button> */}
            {/* Add product */}
            <button 
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              onClick={() => router.push('/products/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </button>
          </div>
        </div>
        
        <div className="max-w-full overflow-x-auto">
          {/* Loading Skeleton */}
          {(status === "pending") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted animate-pulse mb-4" />
                    <div className="h-4 bg-muted animate-pulse mb-2" />
                    <div className="h-4 bg-muted animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Product Grid */}
          <InfiniteScrollContainer onBottomReached={handleLoadMore}>
            <ProductListContainer
              products={products}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              viewMode={viewMode}
            />
          </InfiniteScrollContainer>

          {/* No Results */}
          {!isFetching && products.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-700 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-400">
              {t?.noProductsFound || "No products found"}
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
              {query
                ? `No results for "${query}"`
                : "No products available"}
            </p>
            {query && (
              <Button
                onClick={() => handleSearch("")}
                variant="outline"
                className="border text-gray-700 dark:text-gray-400"
              >
                CLEAR SEARCH
              </Button>
            )}
            <Button onClick={() => refetch()} variant="default">
              {t2?.retry || "Retry"}
            </Button>
            <Button variant="link" onClick={() => router.back()} className="mt-2 text-base text-gray-500">
              {t2?.goBack || "← Go Back"}
            </Button>
          </div>
        )}
        </div>
      </div>
      </div>
      </div>
      {/* </ComponentCard> */}
    </div>
  )
}

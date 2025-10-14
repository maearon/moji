"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BreadcrumbItem } from "@/types/bread-crumb"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"
import React from "react"

type BreadcrumbProps = {
  items?: BreadcrumbItem[]
  pageTitle?: string
  className?: string
  showBackButton?: boolean
  useLastItemHighlight?: boolean
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  pageTitle = "",
  className = "",
  showBackButton = true,
  useLastItemHighlight = true,
}) => {
  const router = useRouter()
  const t = useTranslations("common")

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  let crumbs: BreadcrumbItem[] = []

  if (items.length > 0) {
    crumbs = items
  } else if (pageTitle) {
    crumbs = [{ label: pageTitle, href: `/${pageTitle.toLowerCase()}` }]
  }

  // Heading hiển thị theo logic
  let heading = ""
  if (pageTitle && items.length === 0) {
    heading = pageTitle
  } else if (!pageTitle && items.length > 0) {
    heading = items[items.length - 1].label
  } else if (pageTitle && items.length > 0) {
    heading = pageTitle
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 mb-6",
        className
      )}
    >
      {/* Heading hiển thị theo logic */}
      {heading && (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {heading}
        </h2>
      )}

      <nav>
        <ol className="flex items-center gap-1.5">
          {/* Back button */}
          {showBackButton && (
            <li className="flex items-center gap-1.5">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <ArrowLeft size={16} />
                {t?.back || "Back"}
              </button>
              <svg
                className="stroke-current text-black dark:text-white"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          )}

          {/* Home link */}
          <li className="flex items-center gap-1.5">
            <Link
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              href="/"
            >
              {t?.home || "Home"}
            </Link>
            {crumbs.length > 0 && (
              <svg
                className="stroke-current text-black dark:text-white"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </li>

          {/* Render crumbs */}
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1

            return (
              <li key={index} className="flex items-center gap-1.5">
                {isLast && useLastItemHighlight ? (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href || "#"}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                    <svg
                      className="stroke-current text-black dark:text-white"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke=""
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export default PageBreadcrumb

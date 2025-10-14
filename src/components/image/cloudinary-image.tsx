"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  transformations?: string
  quality?: number
  format?: "auto" | "webp" | "jpg" | "png"
  crop?: "fill" | "fit" | "scale" | "crop"
  gravity?: "auto" | "face" | "center"
  loading?: "lazy" | "eager"
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function CloudinaryImage({
  src,
  alt,
  width = 400,
  height = 400,
  className,
  transformations,
  quality = 80,
  format = "auto",
  crop = "fill",
  gravity = "auto",
  loading = "lazy",
  priority = false,
  onLoad,
  onError,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Build Cloudinary URL with transformations
  const buildCloudinaryUrl = (originalUrl: string) => {
    if (!originalUrl || !originalUrl.includes("cloudinary.com")) {
      return originalUrl
    }

    try {
      const url = new URL(originalUrl)
      const pathParts = url.pathname.split("/")
      const uploadIndex = pathParts.findIndex((part) => part === "upload")

      if (uploadIndex === -1) return originalUrl

      // Build transformation string
      const transforms = []

      if (width && height) {
        transforms.push(`w_${width},h_${height},c_${crop}`)
      }

      if (gravity !== "auto") {
        transforms.push(`g_${gravity}`)
      }

      transforms.push(`f_${format}`)
      transforms.push(`q_${quality}`)

      if (transformations) {
        transforms.push(transformations)
      }

      // Insert transformations into URL
      pathParts.splice(uploadIndex + 1, 0, transforms.join(","))
      url.pathname = pathParts.join("/")

      return url.toString()
    } catch (error) {
      console.error("Error building Cloudinary URL:", error)
      return originalUrl
    }
  }

  const optimizedSrc = buildCloudinaryUrl(src)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg",
          className,
        )}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">Image not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
          style={{ width, height }}
        >
          <div className="text-gray-400">
            <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}

      <Image
        src={optimizedSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        loading={loading}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

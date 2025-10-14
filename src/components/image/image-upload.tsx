"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { CloudinaryImage } from "./cloudinary-image"
import { railsApi } from "@/lib/api/rails-client"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxFiles?: number
  folder?: string
  className?: string
  accept?: string
  disabled?: boolean
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  folder = "products",
  className,
  accept = "image/*",
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (disabled || files.length === 0) return

      const remainingSlots = maxFiles - value.length
      const filesToUpload = Array.from(files).slice(0, remainingSlots)

      if (filesToUpload.length === 0) return

      setUploading(true)
      try {
        const uploadedUrls = await railsApi.uploadImages(filesToUpload, folder)
        const newUrls = [...value, ...uploadedUrls]
        onChange?.(newUrls)
      } catch (error) {
        console.error("Failed to upload images:", error)
        // You might want to show a toast notification here
      } finally {
        setUploading(false)
      }
    },
    [value, onChange, maxFiles, folder, disabled],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeImage = useCallback(
    (index: number) => {
      const newUrls = value.filter((_, i) => i !== index)
      onChange?.(newUrls)
    },
    [value, onChange],
  )

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const canUploadMore = value.length < maxFiles

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {canUploadMore && (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            dragActive ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!disabled ? openFileDialog : undefined}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            {uploading ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-gray-400" />
                <p className="text-lg font-medium text-gray-600">Uploading images...</p>
                <p className="text-sm text-gray-500">Please wait while we process your images</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 mb-2">Drop images here or click to upload</p>
                <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, WebP up to 10MB each</p>
                <AdidasButton theme="black" shadow={true} pressEffect={true} disabled={disabled}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose Files
                </AdidasButton>
                <p className="text-xs text-gray-400 mt-2">
                  {value.length} of {maxFiles} images uploaded
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <CloudinaryImage
                  src={url}
                  alt={`Upload ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  crop="fill"
                  quality={80}
                />

                {/* Primary Badge */}
                {index === 0 && <Badge className="absolute top-2 left-2 bg-black text-white">Primary</Badge>}

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Limit Message */}
      {!canUploadMore && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">Maximum {maxFiles} images reached</p>
        </div>
      )}
    </div>
  )
}

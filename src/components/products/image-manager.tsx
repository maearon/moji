"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, Trash2, Eye } from "lucide-react"
import type { ProductImage } from "@/lib/api/products"

interface ImageManagerProps {
  productId?: number
}

export function ImageManager({ productId }: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !productId) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Simulate upload - replace with actual API call
        const newImage: ProductImage = {
          id: Date.now(),
          url: URL.createObjectURL(file),
          filename: file.name,
          content_type: file.type,
          byte_size: file.size,
        }
        setImages((prev) => [...prev, newImage])
      }
    } catch (error) {
      console.error("Failed to upload images:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (imageId: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setImages(images.filter((img) => img.id !== imageId))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Images
            </CardTitle>
            <CardDescription>Upload and manage product photos and media</CardDescription>
          </div>
          <AdidasButton
            theme="black"
            shadow={true}
            pressEffect={true}
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </AdidasButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Card key={image.id} className="rounded-xl border-gray-200 overflow-hidden">
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && <Badge className="absolute top-2 left-2 bg-black text-white">Primary</Badge>}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="font-medium text-sm truncate">{image.filename}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{image.content_type}</span>
                      <span>{formatFileSize(image.byte_size)}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <AdidasButton size="icon" theme="white" shadow={false} showArrow={false} className="flex-1">
                        <Eye className="h-3 w-3" />
                      </AdidasButton>
                      <AdidasButton
                        size="icon"
                        theme="white"
                        shadow={false}
                        showArrow={false}
                        onClick={() => handleDelete(image.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </AdidasButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No images uploaded yet</p>
            <p className="text-sm mb-4">Upload high-quality product photos to showcase your items</p>
            <AdidasButton theme="white" shadow={true} pressEffect={true} onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </AdidasButton>
          </div>
        )}

        {images.length > 0 && (
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            <p>
              <strong>Tips:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>The first image will be used as the primary product image</li>
              <li>Use high-resolution images (at least 1200x1200px) for best quality</li>
              <li>Supported formats: JPG, PNG, WebP</li>
              <li>Maximum file size: 10MB per image</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

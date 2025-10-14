"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, GripVertical } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"

interface MultiImageUploadProps {
  value?: (File | string)[]
  onChange: (files: (File | string)[]) => void
  label: string
  maxFiles?: number
  accept?: string
  disabled?: boolean
  productId?: string
  variantId?: string
  onReorder?: (newOrder: (File | string)[]) => void
}

interface DraggedItem {
  index: number
  data: File | string
}

export function MultiImageUpload({
  value = [],
  onChange,
  label,
  maxFiles = 10,
  accept = "image/*",
  disabled = false,
  productId,
  variantId,
  onReorder,
}: MultiImageUploadProps) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // 👉 tạo previews (string cho URL, object URL cho File)
  const previews = useMemo(() => {
    return value.map((item) =>
      typeof item === "string" ? item : URL.createObjectURL(item),
    )
  }, [value])

  // 👉 cleanup object URLs để tránh memory leak
  useEffect(() => {
    return () => {
      previews.forEach((preview, idx) => {
        if (value[idx] instanceof File) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [previews, value])

  // 👉 thêm file mới
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - value.length
      const filesToAdd = acceptedFiles.slice(0, remainingSlots)
      if (filesToAdd.length > 0) {
        const newValue = [...value, ...filesToAdd]
        onChange(newValue)
        
        // Call onReorder callback nếu có (để cập nhật form state)
        if (onReorder) {
          onReorder(newValue)
        }
      }
    },
    [value, onChange, maxFiles, onReorder],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: true,
    disabled: disabled || value.length >= maxFiles,
  })

  // 👉 xóa file theo index
  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
    
    // Call onReorder callback nếu có (để cập nhật form state)
    if (onReorder) {
      onReorder(newValue)
    }
  }

  // 👉 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return
    setDraggedItem({ index, data: value[index] })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (disabled || !draggedItem) return
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (disabled || !draggedItem || draggedItem.index === dropIndex) {
      setDraggedItem(null)
      setDragOverIndex(null)
      return
    }

    const newValue = [...value]
    const draggedData = newValue.splice(draggedItem.index, 1)[0]
    newValue.splice(dropIndex, 0, draggedData)
    
    // Cập nhật local state trước
    onChange(newValue)
    
    // Call onReorder callback nếu có (chỉ để cập nhật form state)
    if (onReorder) {
      onReorder(newValue)
    }
    
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>

      {/* Grid preview with drag & drop */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={`${index}-${value[index] instanceof File ? 'file' : 'url'}`}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative group cursor-move transition-all duration-200
                ${draggedItem?.index === index ? 'opacity-50 scale-95' : ''}
                ${dragOverIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''}
                ${disabled ? 'cursor-default' : 'hover:scale-105'}
              `}
            >
              <ImagePreview
                src={preview || "/placeholder.svg"}
                alt={`${label} ${index + 1}`}
                onRemove={disabled ? undefined : () => handleRemove(index)}
              />
              
              {/* Drag handle */}
              {!disabled && (
                <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3 w-3" />
                </div>
              )}
              
              {/* Order indicator */}
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop images here"
              : `Click or drag images to upload (${value.length}/${maxFiles})`}
          </p>
          {value.length > 0 && !disabled && (
            <p className="text-xs text-gray-500 mt-1">
              Drag images to reorder them
            </p>
          )}
        </div>
      )}
    </div>
  )
}
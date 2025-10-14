"use client"

import { useCallback, useEffect, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"

interface ImageUploadFieldProps {
  value?: File | string
  onChange: (file: File | null) => void
  label: string
  accept?: string
  disabled?: boolean
}

export function ImageUploadField({
  value,
  onChange,
  label,
  accept = "image/*",
  disabled = false,
}: ImageUploadFieldProps) {
  // 👉 build preview ổn định
  const preview = useMemo(() => {
    if (!value) return null
    return typeof value === "string" ? value : URL.createObjectURL(value)
  }, [value])

  // 👉 cleanup URL nếu là File
  useEffect(() => {
    return () => {
      if (value instanceof File && preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [value, preview])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onChange(file)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
    disabled,
  })

  const handleRemove = () => {
    onChange(null)
  }

  if (preview) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <ImagePreview
          src={preview || "/placeholder.svg"}
          alt={label}
          onRemove={disabled ? undefined : handleRemove}
          className="w-32 h-32"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
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
          {isDragActive ? "Drop image here" : "Click or drag image to upload"}
        </p>
      </div>
    </div>
  )
}

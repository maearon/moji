"use client"

import { useState } from "react"
import { Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ImagePreviewProps {
  src: string
  alt: string
  onRemove?: () => void
  className?: string
}

export function ImagePreview({ src, alt, onRemove, className = "" }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-gray-400">{alt}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full max-h-[70vh] object-contain" />
            </div>
          </DialogContent>
        </Dialog>

        {onRemove && (
          <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  )
}

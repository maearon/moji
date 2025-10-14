"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Tag } from "lucide-react"
import type { Tag as TagType } from "@/lib/api/products"

interface TagManagerProps {
  productId?: number
}

export function TagManager({ productId }: TagManagerProps) {
  const [availableTags, setAvailableTags] = useState<TagType[]>([])
  const [selectedTags, setSelectedTags] = useState<TagType[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [showInput, setShowInput] = useState(false)

  // Mock data - replace with actual API calls
  useEffect(() => {
    setAvailableTags([
      { id: 1, name: "New Arrival", slug: "new-arrival", created_at: "", updated_at: "" },
      { id: 2, name: "Bestseller", slug: "bestseller", created_at: "", updated_at: "" },
      { id: 3, name: "Limited Edition", slug: "limited-edition", created_at: "", updated_at: "" },
      { id: 4, name: "Sustainable", slug: "sustainable", created_at: "", updated_at: "" },
      { id: 5, name: "Performance", slug: "performance", created_at: "", updated_at: "" },
    ])
  }, [])

  const handleAddTag = (tag: TagType) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId))
  }

  const handleCreateNewTag = () => {
    if (newTagName.trim()) {
      const newTag: TagType = {
        id: Date.now(),
        name: newTagName.trim(),
        slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setAvailableTags([...availableTags, newTag])
      setSelectedTags([...selectedTags, newTag])
      setNewTagName("")
      setShowInput(false)
    }
  }

  const unselectedTags = availableTags.filter((tag) => !selectedTags.find((selected) => selected.id === tag.id))

  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Product Tags
            </CardTitle>
            <CardDescription>Add tags to help customers find this product</CardDescription>
          </div>
          <AdidasButton theme="black" shadow={true} pressEffect={true} onClick={() => setShowInput(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </AdidasButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag.id} variant="default" className="flex items-center gap-1 px-3 py-1 rounded-full">
                  {tag.name}
                  <button onClick={() => handleRemoveTag(tag.id)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* New Tag Input */}
        {showInput && (
          <Card className="rounded-xl border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter new tag name..."
                  className="rounded-xl border-gray-200"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateNewTag()}
                />
                <AdidasButton theme="black" shadow={false} onClick={handleCreateNewTag} disabled={!newTagName.trim()}>
                  Add
                </AdidasButton>
                <AdidasButton
                  theme="white"
                  shadow={false}
                  onClick={() => {
                    setShowInput(false)
                    setNewTagName("")
                  }}
                >
                  Cancel
                </AdidasButton>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Tags */}
        {unselectedTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Available Tags</h4>
            <div className="flex flex-wrap gap-2">
              {unselectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-full"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {unselectedTags.length === 0 && selectedTags.length === 0 && !showInput && (
          <div className="text-center py-8 text-gray-500">
            <Tag className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No tags available. Create your first tag to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

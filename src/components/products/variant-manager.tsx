"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Palette } from "lucide-react"
import type { Variant } from "@/types/product"

interface VariantManagerProps {
  productId?: number | string
}

export function VariantManager({ productId }: VariantManagerProps) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [formData, setFormData] = useState({
    color: "",
    price: "",
    compare_at_price: "",
    variant_code: "",
    sku: "",
    stock: "",
    sizes: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newVariant: Variant = {
      id: editingVariant?.id || Date.now(),
      color: formData.color,
      price: Number.parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? Number.parseFloat(formData.compare_at_price) : undefined,
      variant_code: formData.variant_code || undefined,
      sku: formData.sku || undefined,
      stock: formData.stock ? Number.parseInt(formData.stock) : undefined,
      sizes: formData.sizes,
      product_id: productId ? Number(productId) : undefined,
      available: true,
    }

    if (editingVariant) {
      setVariants(variants.map((v) => (v.id === editingVariant.id ? newVariant : v)))
    } else {
      setVariants([...variants, newVariant])
    }

    setShowForm(false)
    setEditingVariant(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      color: "",
      price: "",
      compare_at_price: "",
      variant_code: "",
      sku: "",
      stock: "",
      sizes: [],
    })
  }

  const handleEdit = (variant: Variant) => {
    setEditingVariant(variant)
    setFormData({
      color: variant.color || "",
      price: variant.price.toString(),
      compare_at_price: variant.compare_at_price?.toString() || "",
      variant_code: variant.variant_code || "",
      sku: variant.sku || "",
      stock: variant.stock?.toString() || "",
      sizes: variant.sizes || [],
    })
    setShowForm(true)
  }

  const handleDelete = (variantId: number | string) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      setVariants(variants.filter((v) => v.id !== variantId))
    }
  }

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11", "12"]

  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Product Variants
            </CardTitle>
            <CardDescription>Manage colors, pricing, sizes, and inventory for this product</CardDescription>
          </div>
          <AdidasButton theme="black" shadow={true} pressEffect={true} onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </AdidasButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <Card className="rounded-xl border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">{editingVariant ? "Edit Variant" : "Add New Variant"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color *</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                      placeholder="e.g., Core Black, Cloud White"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant_code">Variant Code</Label>
                    <Input
                      id="variant_code"
                      value={formData.variant_code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, variant_code: e.target.value }))}
                      placeholder="e.g., GX3242-001"
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                      placeholder="e.g., ADI-UB22-BLK-10"
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="180.00"
                      className="rounded-xl border-gray-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compare_at_price">Compare at Price</Label>
                    <Input
                      id="compare_at_price"
                      type="number"
                      step="0.01"
                      value={formData.compare_at_price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, compare_at_price: e.target.value }))}
                      placeholder="200.00"
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                      placeholder="100"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const newSizes = formData.sizes.includes(size)
                            ? formData.sizes.filter((s) => s !== size)
                            : [...formData.sizes, size]
                          setFormData((prev) => ({ ...prev, sizes: newSizes }))
                        }}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                          formData.sizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <AdidasButton theme="black" shadow={true} pressEffect={true} type="submit">
                    {editingVariant ? "Update Variant" : "Add Variant"}
                  </AdidasButton>
                  <AdidasButton
                    theme="white"
                    shadow={false}
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingVariant(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </AdidasButton>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {variants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>SKU / Variant Code</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Compare Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300 border"></div>
                      {variant.color}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <div>
                      {variant.sku && <div>{variant.sku}</div>}
                      {variant.variant_code && <div className="text-gray-500">{variant.variant_code}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${variant.price}</TableCell>
                  <TableCell>
                    {variant.compare_at_price ? (
                      <span className="text-gray-500 line-through">${variant.compare_at_price}</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant.stock && variant.stock > 0 ? "default" : "destructive"}>
                      {variant.stock || 0} units
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {variant.sizes.slice(0, 3).map((size) => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                      {variant.sizes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{variant.sizes.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <AdidasButton
                        size="icon"
                        theme="white"
                        shadow={false}
                        showArrow={false}
                        onClick={() => handleEdit(variant)}
                      >
                        <Edit className="h-3 w-3" />
                      </AdidasButton>
                      <AdidasButton
                        size="icon"
                        theme="white"
                        shadow={false}
                        showArrow={false}
                        onClick={() => handleDelete(variant.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </AdidasButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No variants added yet</p>
            <p className="text-sm">Add color variants with different pricing, sizes, and stock levels</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

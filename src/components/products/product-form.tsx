"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Upload, Trash2 } from "lucide-react"
import { ProductData } from "@/lib/types"
import { slugify } from "@/utils/slugify"

export type ProductFormMode = "create" | "edit" | "detail"

interface ProductFormProps {
  product?: ProductData
  onSubmit: (formData: FormData) => Promise<void>
  loading?: boolean
  mode?: ProductFormMode
}

interface Variant {
  id?: number
  color: string
  price: number
  compare_at_price: number
  stock: number
  sizes: string[]
  avatar?: File | null
  hover?: File | null
  images: File[]
}

const BRANDS = ["Adidas", "Originals", "Athletics", "Essentials"]
const GENDERS = ["Men", "Women", "Unisex", "Kids"]
const CATEGORIES = ["Shoes", "Apparel", "Accessories"]
const SPORTS = ["Running", "Soccer", "Basketball", "Tennis", "Gym", "Training", "Golf", "Hiking", "Yoga"]
const PRODUCT_TYPES = ["Sneakers", "Cleats", "Sandals", "Hoodie", "Pants", "Shorts", "Jacket", "Jersey", "T-Shirt"]

const SIZES = {
  Shoes: ["36","36.5","37","37.5","38","38.5","39","39.5","40","40.5","41","41.5","42","42.5","43","43.5","44","44.5","45"],
  Apparel: ["XS", "S", "M", "L", "XL", "XXL"],
  Accessories: ["One Size"],
}

export function ProductForm({ product, onSubmit, loading = false, mode = "create" }: ProductFormProps) {
  const router = useRouter()
  const isDetail = mode === "detail"

  const [formData, setFormData] = useState({
    name: "",
    model_number: "",
    brand: "",
    gender: "",
    category: "",
    sport: "",
    product_type: "",
    description_h5: "",
    description_p: "",
    care: "",
    specifications: "",
  })

  const [productImages, setProductImages] = useState<{ image: File | null; hover_image: File | null }>({
    image: null,
    hover_image: null,
  })

  const [variants, setVariants] = useState<Variant[]>([
    {
      color: "Black",
      price: 0,
      compare_at_price: 0,
      stock: 0,
      sizes: [],
      avatar: null,
      hover: null,
      images: [],
    },
  ])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        model_number: product.model_number || "",
        brand: product.brand || "",
        gender: product.gender || "",
        category: product.category || "",
        sport: product.sport || "",
        product_type: product.product_type || "",
        description_h5: product.description_h5 || "",
        description_p: product.description_p || "",
        care: product.care || "",
        specifications: product.specifications || "",
      })

      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((v: any) => ({
            id: v.id,
            color: v.color,
            price: v.price,
            compare_at_price: v.compare_at_price,
            stock: v.stock,
            sizes: v.sizes || [],
            avatar: null,
            hover: null,
            images: [],
          })),
        )
      }
    }
  }, [product])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  
  const handleProductImageChange = (type: "image" | "hover_image", file: File | null) => {
    setProductImages((prev) => ({ ...prev, [type]: file }))
  }

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)))
  }

  const handleVariantImageChange = (index: number, type: "avatar" | "hover", file: File | null) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, [type]: file } : variant)))
  }

  const handleVariantImagesChange = (index: number, files: File[]) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, images: files } : variant)))
  }

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        price: 0,
        compare_at_price: 0,
        stock: 0,
        sizes: [],
        avatar: null,
        hover: null,
        images: [],
      },
    ])
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const toggleSize = (variantIndex: number, size: string) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i === variantIndex) {
          const sizes = variant.sizes.includes(size)
            ? variant.sizes.filter((s) => s !== size)
            : [...variant.sizes, size]
          return { ...variant, sizes }
        }
        return variant
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = new FormData()

    // Add product data
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(`product[${key}]`, value)
    })

    // Add product images
    if (productImages.image) {
      submitData.append("product[image]", productImages.image)
    }
    if (productImages.hover_image) {
      submitData.append("product[hover_image]", productImages.hover_image)
    }

    // Add variants data
    variants.forEach((variant, index) => {
      submitData.append(`product[variants_attributes][${index}][color]`, variant.color)
      submitData.append(`product[variants_attributes][${index}][price]`, variant.price.toString())
      submitData.append(`product[variants_attributes][${index}][compare_at_price]`, variant.compare_at_price.toString())
      submitData.append(`product[variants_attributes][${index}][stock]`, variant.stock.toString())

      // Add sizes as array
      variant.sizes.forEach((size, sizeIndex) => {
        submitData.append(`product[variants_attributes][${index}][sizes][${sizeIndex}]`, size)
      })

      // Add variant images
      if (variant.avatar) {
        submitData.append(`product[variants_attributes][${index}][avatar]`, variant.avatar)
      }
      if (variant.hover) {
        submitData.append(`product[variants_attributes][${index}][hover]`, variant.hover)
      }

      // Add variant detail images
      variant.images.forEach((image, imageIndex) => {
        submitData.append(`product[variants_attributes][${index}][images][${imageIndex}]`, image)
      })

      // Add ID for existing variants
      if (variant.id) {
        submitData.append(`product[variants_attributes][${index}][id]`, variant.id.toString())
      }
    })

    onSubmit(submitData)
  }

  const availableSizes = SIZES[formData.category as keyof typeof SIZES] || []

  const firstVariant = product.variants?.[0]
  const mainImage =
    product.main_image_url ||
    firstVariant?.avatar_url ||
    product.thumbnail ||
    ""
  const hoverImage =
    product.hover_image_url || firstVariant?.hover_url || ""

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-700 dark:text-gray-400">
      {/* Basic Information */}
      <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Basic Information</CardTitle>
          <CardDescription>Enter the basic product details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                disabled={isDetail}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model_number">Model Number *</Label>
              <Input
                id="model_number"
                value={formData.model_number}
                disabled={isDetail}
                onChange={(e) => handleInputChange("model_number", e.target.value)}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select value={formData.brand} disabled={isDetail} onValueChange={(value) => handleInputChange("brand", value)}>
                <SelectTrigger className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} disabled={isDetail} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} disabled={isDetail} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <Select value={formData.sport} disabled={isDetail} onValueChange={(value) => handleInputChange("sport", value)}>
                <SelectTrigger className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_type">Product Type</Label>
              <Select value={formData.product_type} disabled={isDetail} onValueChange={(value) => handleInputChange("product_type", value)}>
                <SelectTrigger className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Product Images</CardTitle>
          <CardDescription>Upload main product images.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-image">Main Image</Label>
              <div className="border border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-lg p-4">
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProductImageChange("image", e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-700 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    {productImages.image ? productImages.image.name : "Click to upload main image"}
                  </span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-hover-image">Hover Image</Label>
              <div className="border border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-lg p-4">
                <input
                  id="product-hover-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProductImageChange("hover_image", e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="product-hover-image" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-700 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    {productImages.hover_image ? productImages.hover_image.name : "Click to upload hover image"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Description */}
      <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Product Description</CardTitle>
          <CardDescription>Add detailed product information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description_h5">Short Description</Label>
            <Input
              id="description_h5"
              value={formData.description_h5}
              onChange={(e) => handleInputChange("description_h5", e.target.value)}
              className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              placeholder="Brief product description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_p">Full Description</Label>
            <Textarea
              id="description_p"
              value={formData.description_p}
              onChange={(e) => handleInputChange("description_p", e.target.value)}
              className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              rows={4}
              placeholder="Detailed product description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="care">Care Instructions</Label>
              <Textarea
                id="care"
                value={formData.care}
                onChange={(e) => handleInputChange("care", e.target.value)}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                rows={3}
                placeholder="How to care for this product"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleInputChange("specifications", e.target.value)}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                rows={3}
                placeholder="Product specifications"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Product Variants</CardTitle>
          <CardDescription>Configure different color variants with pricing and inventory.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {variants.map((variant, index) => (
            <div key={index} className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Variant {index + 1}</h4>
                {variants.length > 1 && (
                  <AdidasButton
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeVariant(index)}
                    className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </AdidasButton>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Color *</Label>
                  <Input
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                    className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                    placeholder="e.g., Black, White, Red"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (VND) *</Label>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, "price", Number.parseFloat(e.target.value) || 0)}
                    className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compare Price (VND)</Label>
                  <Input
                    type="number"
                    value={variant.compare_at_price}
                    onChange={(e) =>
                      handleVariantChange(index, "compare_at_price", Number.parseFloat(e.target.value) || 0)
                    }
                    className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock *</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, "stock", Number.parseInt(e.target.value) || 0)}
                    className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                    required
                  />
                </div>
              </div>

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <Badge
                        key={size}
                        variant={variant.sizes.includes(size) ? "default" : "outline"}
                        className="cursor-pointer border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                        onClick={() => toggleSize(index, size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Images */}
              <div className="space-y-4">
                <Label>Variant Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Avatar Image</Label>
                    <div className="border border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(index, "avatar", e.target.files?.[0] || null)}
                        className="hidden"
                        id={`variant-avatar-${index}`}
                      />
                      <label
                        htmlFor={`variant-avatar-${index}`}
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-6 w-6 text-gray-700 dark:text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-400">
                          {variant.avatar ? variant.avatar.name : "Upload avatar"}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hover Image</Label>
                    <div className="border border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(index, "hover", e.target.files?.[0] || null)}
                        className="hidden"
                        id={`variant-hover-${index}`}
                      />
                      <label
                        htmlFor={`variant-hover-${index}`}
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-6 w-6 text-gray-700 dark:text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-400">
                          {variant.hover ? variant.hover.name : "Upload hover"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Detail Images</Label>
                  <div className="border border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleVariantImagesChange(index, Array.from(e.target.files || []))}
                      className="hidden"
                      id={`variant-images-${index}`}
                    />
                    <label
                      htmlFor={`variant-images-${index}`}
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-6 w-6 text-gray-700 dark:text-gray-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-400">
                        {variant.images.length > 0 ? `${variant.images.length} files selected` : "Upload detail images"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {index < variants.length - 1 && <Separator />}
            </div>
          ))}

          <AdidasButton type="button" variant="outline" onClick={addVariant} className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </AdidasButton>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4">
        <AdidasButton type="button" variant="outline" onClick={() => router.push("/products")}>
          Cancel
        </AdidasButton>
        {isDetail ? (
          <AdidasButton type="button" onClick={() => router.push(`/products/edit/${slugify(product.name)}/${firstVariant?.variant_code}.html`)}>
            Edit Product
          </AdidasButton>
        ) : (
          <AdidasButton type="submit" disabled={loading}>
            {loading ? "Saving..." : mode === "edit" ? "Update Product" : "Create Product"}
          </AdidasButton>
        )}
      </div>
    </form>
  )
}

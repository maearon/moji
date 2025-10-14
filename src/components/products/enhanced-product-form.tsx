"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Save, Loader2, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Input from '@/components/form/input/InputField';
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label"
import Select from "@/components/form/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ModeSwitcher, type Mode } from "@/components/ui/mode-switcher"
import { ImageUploadField } from "./image-upload-field"
import { MultiImageUpload } from "./multi-image-upload"
import { productSchema, type ProductFormData } from "@/lib/validations/product"
import { Badge } from "@/components/ui/badge"
// import rubyService from "@/api/services/rubyService"
import { 
  // ToastContainer, 
  toast 
} from 'react-toastify'
import { useTranslations } from "@/hooks/useTranslations"

interface EnhancedProductFormProps {
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  mode?: Mode
  loading?: boolean
}

export function LoadingDots() {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "." : prev + "."))
    }, 500) // đổi tốc độ tại đây (ms)

    return () => clearInterval(interval)
  }, [])

  return <>{dots}</>
}

export function EnhancedProductForm({
  initialData,
  onSubmit,
  mode: initialMode = "view",
  loading = false,
}: EnhancedProductFormProps) {
  const t = useTranslations("productEdit")
  const [mode, setMode] = useState<Mode>(initialMode)
  const [isSubmittingState, setIsSubmittingState] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [isImageChanging, setIsImageChanging] = useState(false)
  // const [isClicked, setIsClicked] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      // slug: "",
      model_number: "",
      description: "",
      description_h5: "",
      description_p: "",
      category: "",
      sport: "",
      brand: "Adidas",
      gender: "Unisex",
      // status: "active",
      product_type: "",
      activity: "",
      // material: "",
      // collection: "",
      franchise: "",
      care: "",
      specifications: "",
      // is_featured: false,
      badge: "",
      variants: [
        {
          variant_code: "",
          color: "",
          price: 0,
          compare_at_price: 0,
          stock: 0,
          // sku: "",
        },
      ],
    },
  })

  // 👉 Enhanced isDirty detection
  const currentFormData = watch()
  const isFormDirty = useMemo(() => {
    if (!initialData) return isDirty

    // Deep comparison for complex objects
    const compareObjects = (obj1: any, obj2: any): boolean => {
      if (obj1 === obj2) return true
      if (!obj1 || !obj2) return false
      if (typeof obj1 !== typeof obj2) return false
      
      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false
        return obj1.every((item, index) => compareObjects(item, obj2[index]))
      }
      
      if (typeof obj1 === 'object') {
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)
        if (keys1.length !== keys2.length) return false
        return keys1.every(key => compareObjects(obj1[key], obj2[key]))
      }
      
      return obj1 === obj2
    }

    return !compareObjects(currentFormData, initialData)
  }, [currentFormData, initialData, isDirty])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  })

  const watchName = watch("name")

  // Auto-generate slug and model_number from name
  useEffect(() => {
    if (watchName && mode === "create") {
      // const slug = watchName
      //   .toLowerCase()
      //   .replace(/[^a-z0-9]+/g, "-")
      //   .replace(/(^-|-$)/g, "")
      // setValue("slug", slug)

      // const modelNumber =
      //   watchName
      //     .toUpperCase()
      //     .replace(/[^A-Z0-9]+/g, "")
      //     .substring(0, 10) + Date.now().toString().slice(-3)
      // setValue("model_number", modelNumber)
    }
  }, [watchName, setValue, mode])

  const handleFormSubmit = async (data: ProductFormData) => {
    // if (isClicked === false) return
    if (mode === "view") return
    if (!isFormDirty) return
    if (isImageChanging) return // Ngăn submit khi đang thay đổi ảnh

    setIsSubmittingState(true)
    try {
      // Xử lý reordering images trước khi submit
      if (initialData?.id && mode === "edit") {
        for (let i = 0; i < data.variants.length; i++) {
          const variant = data.variants[i]
          if (variant.id && variant.additional_images && variant.additional_images.length > 0) {
            try {
              // Extract image IDs from the new order (for existing images)
              const imageOrder = variant.additional_images
                .map((item, index) => {
                  if (typeof item === 'string') {
                    // Extract ID from URL if it's an existing image
                    // Try multiple patterns to extract ID
                    const patterns = [
                      /\/(\d+)\//,  // /123/
                      /\/\d+\/(\d+)\//,  // /123/456/
                      /images\/(\d+)\//,  // images/123/
                      /variants\/(\d+)\/images\/(\d+)\//,  // variants/123/images/456/
                    ]
                    
                    for (const pattern of patterns) {
                      const match = item.match(pattern)
                      if (match) {
                        return match[match.length - 1] // Get the last captured group
                      }
                    }
                    
                    // Fallback to index if no ID found
                    return index.toString()
                  }
                  return index.toString()
                })

              console.log('Reordering images for variant:', {
                variantId: variant.id,
                imageOrder,
                originalImages: variant.additional_images
              })

              // await rubyService.reorderVariantImages(
              //   initialData.id,
              //   variant.id,
              //   imageOrder
              // )
              // setIsReordering(true)

              // if (!toast.isActive("reorder-warning")) {
              //   toast(
              //     t?.reorderNotAvailable ||
              //       "⚠️ Backend does not currently support reordering images. This change is temporary only",
              //     { toastId: "reorder-warning" }
              //   )
              // }

              // setIsReordering(false)
            } catch (error) {
              console.error(`Failed to reorder images for variant ${i}:`, error)
              // Continue with form submission even if reorder fails
            }
          }
        }
      }

      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmittingState(false)
      // setIsClicked(false)
    }
  }

  const isReadOnly = mode === "view"

  // 👉 Handle image reordering - chỉ cập nhật local state, không gọi API ngay
  const handleImageReorder = useCallback((variantIndex: number, newOrder: (File | string)[]) => {
    console.log('Image reorder triggered:', { variantIndex, newOrder })
    setIsImageChanging(true)
    
    // Chỉ cập nhật local state, không gọi API ngay lập tức
    setValue(`variants.${variantIndex}.additional_images`, newOrder, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    })
    
    // Reset flag sau một khoảng thời gian ngắn
    setTimeout(() => {
      setIsImageChanging(false)
      console.log('Image changing flag reset')
    }, 2000) // Tăng thời gian để đảm bảo không bị submit
  }, [setValue])

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-400">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {mode === "create" ? "Create Product" : mode === "edit" ? "Edit Product" : "Product Details"}
        </h1>
        <ModeSwitcher mode={mode} onModeChange={setMode} />
      </div>

      <form
        id="product-form"
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn reload mặc định
          e.stopPropagation(); // Ngăn event bubbling
          handleSubmit(handleFormSubmit)(e);
        }}
        className="space-y-6"
        noValidate
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register("name")} disabled={isReadOnly} placeholder="Enter product name" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_number">Model Number *</Label>
                <Input id="model_number" {...register("model_number")} disabled={isReadOnly} placeholder="MODEL123" />
                {errors.model_number && <p className="text-sm text-red-500">{errors.model_number.message}</p>}
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} disabled={isReadOnly} placeholder="product-slug" />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="description_h5">Short Description</Label>
              <TextArea
                id="description_h5"
                {...register("description_h5")}
                disabled={isReadOnly}
                placeholder="Brief product description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_p">Full Description</Label>
              <TextArea
                id="description_p"
                {...register("description_p")}
                disabled={isReadOnly}
                placeholder="Detailed product description"
                rows={4}
              />
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <div className="relative">
                  <Select
                    value={watch("brand")}
                    onChange={val => setValue("brand", val)}
                    disabled={isReadOnly}
                    options={[
                      { value: "Adidas", label: "Adidas" },
                      { value: "Nike", label: "Nike" },
                      { value: "Puma", label: "Puma" },
                      { value: "Reebok", label: "Reebok" },
                    ]}
                    placeholder="Select brand"
                    className="w-full"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <Select
                    value={watch("category")}
                    onChange={val => setValue("category", val)}
                    disabled={isReadOnly}
                    options={[
                      { value: "Shoes", label: "Shoes" },
                      { value: "Apparel", label: "Apparel" },
                      { value: "Accessories", label: "Accessories" },
                    ]}
                    placeholder="Select category"
                    className="w-full"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <div className="relative">
                  <Select
                    value={watch("sport")}
                    onChange={val => setValue("sport", val)}
                    disabled={isReadOnly}
                    options={[
                      { value: "Running", label: "Running" },
                      { value: "Soccer", label: "Soccer" },
                      { value: "Basketball", label: "Basketball" },
                      { value: "Tennis", label: "Tennis" },
                      { value: "Training", label: "Training" },
                    ]}
                    placeholder="Select sport"
                    className="w-full"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <div className="relative">
                  <Select
                    value={watch("gender")}
                    onChange={val => setValue("gender", val)}
                    disabled={isReadOnly}
                    options={[
                      { value: "Men", label: "Men" },
                      { value: "Women", label: "Women" },
                      { value: "Unisex", label: "Unisex" },
                      { value: "Kids", label: "Kids" },
                    ]}
                    placeholder="Select gender"
                    className="w-full"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_type">Product Type</Label>
                <div className="relative">
                  <Select
                    value={watch("product_type")}
                    onChange={val => setValue("product_type", val)}
                    disabled={isReadOnly}
                    options={[
                      { value: "Shoes", label: "Shoes" },
                      { value: "Sneakers", label: "Sneakers" },
                      { value: "Cleats", label: "Cleats" },
                      { value: "Sandals", label: "Sandals" },
                      { value: "Hoodie", label: "Hoodie" },
                      { value: "Pants", label: "Pants" },
                      { value: "Shorts", label: "Shorts" },
                    ]}
                    placeholder="Select type"
                    className="w-full"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="franchise">Franchise</Label>
                <div className="relative">
                  <Select
                    value={watch("franchise")}
                    onChange={val => setValue("franchise", val)}
                    disabled={isReadOnly}
                    options={[{ value: "Tubular", label: "Tubular" }]}
                    placeholder="Select franchise"
                    className="w-full"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="care">Care Instructions</Label>
                <TextArea
                  id="care"
                  {...register("care")}
                  disabled={isReadOnly}
                  placeholder="Care instructions for the product"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <TextArea
                  id="specifications"
                  {...register("specifications")}
                  disabled={isReadOnly}
                  placeholder="Technical specifications"
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadField
                label="Main Image"
                value={watch("main_image")}
                onChange={(file) => setValue("main_image", file)}
                disabled={isReadOnly}
              />

              <ImageUploadField
                label="Hover Image"
                value={watch("hover_image")}
                onChange={(file) => setValue("hover_image", file)}
                disabled={isReadOnly}
              />
            </div>
            {(Object.keys(errors).length > 0) && (
              <p className="text-sm text-red-500">Please check product information</p>
            )}
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Product Variants
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      variant_code: "",
                      color: "",
                      price: 0,
                      compare_at_price: 0,
                      stock: 0,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    Variant {index + 1}
                    {watch(`variants.${index}.color`) && (
                      <Badge variant="secondary">{watch(`variants.${index}.color`)}</Badge>
                    )}
                  </h4>
                  {!isReadOnly && fields.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-gray-700 dark:text-gray-400" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Variant Code</Label>
                    <Input {...register(`variants.${index}.variant_code`)} disabled={isReadOnly} placeholder="VAR001" />
                    {errors.variants?.[index]?.variant_code && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.variant_code?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input {...register(`variants.${index}.color`)} disabled={isReadOnly} placeholder="Black" />
                    {errors.variants?.[index]?.color && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.color?.message}</p>
                    )}
                  </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.price`, { valueAsNumber: true })}
                        disabled={isReadOnly}
                        placeholder="99.99"
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-sm text-red-500">{errors.variants[index]?.price?.message}</p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label>Compare Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.compare_at_price`, { valueAsNumber: true })}
                      disabled={isReadOnly}
                      placeholder="129.99"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                      disabled={isReadOnly}
                      placeholder="100"
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="text-sm text-red-500">{errors.variants[index]?.stock?.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadField
                    label="Main Image"
                    value={watch(`variants.${index}.main_image`)}
                    onChange={(file) => setValue(`variants.${index}.main_image`, file)}
                    disabled={isReadOnly}
                  />

                  <ImageUploadField
                    label="Hover Image"
                    value={watch(`variants.${index}.hover_image`)}
                    onChange={(file) => setValue(`variants.${index}.hover_image`, file)}
                    disabled={isReadOnly}
                  />
                </div>

                <MultiImageUpload
                  label="Additional Images"
                  value={watch(`variants.${index}.additional_images`) || []}
                  onChange={(files) => {
                    setValue(`variants.${index}.additional_images`, files, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: false,
                    })
                  }}
                  onReorder={(newOrder) => {
                    handleImageReorder(index, newOrder)
                  }}
                  disabled={isReadOnly}
                  maxFiles={10}
                />
              </div>
            ))}

            {errors.variants && (
              <p className="text-sm text-red-500">{errors.variants.message || "Please check variant information"}</p>
            )}
          </CardContent>
        </Card>

        {!isReadOnly && (
          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isFormDirty || (isSubmitting && isSubmittingState && loading) || isImageChanging}
              className="min-w-[120px]"
            >
              {(isSubmitting && isSubmittingState && loading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving<LoadingDots />
                </>
              ) : isImageChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Images<LoadingDots />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "create" ? "Create Product" : "Update Product"}
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

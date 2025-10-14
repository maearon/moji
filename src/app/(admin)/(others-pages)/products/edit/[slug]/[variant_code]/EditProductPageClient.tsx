"use client"

import { useRouter } from "next/navigation"
import { EnhancedProductForm } from "@/components/products/enhanced-product-form"
import type { ProductFormData } from "@/lib/validations/product"
import { Loading } from "@/components/loading"
import { useProductDetail, useUpdateProduct } from "@/api/hooks/useProducts"
import { useState } from "react"
import { slugify } from "@/utils/slugify"
import { toast } from 'react-toastify'

interface EditProductPageProps {
  params: {
    slug: string
    variant_code: string
    mode: string
  }
}

export default function EditProductPageClient({ params }: EditProductPageProps) {
  const { slug, variant_code, mode: modeParam } = params
  const router = useRouter()
  const mode = (modeParam === "create" || modeParam === "edit") ? modeParam : undefined

  const {
    data: productData,
    isLoading,
    refetch, // 👈 thêm refetch để làm mới data sau khi update
  } = useProductDetail(slug, variant_code)

  const variant = productData?.variants?.find((v) => v.variant_code === variant_code)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const displayColor = hoveredColor || variant?.color
  const updateProduct = useUpdateProduct()

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData()

      // Add basic product data
      formData.append("product[name]", data.name)
      formData.append("product[model_number]", data.model_number)
      formData.append("product[description_h5]", data.description_h5 || "")
      formData.append("product[description_p]", data.description_p || "")
      formData.append("product[category]", data.category)
      formData.append("product[sport]", data.sport || "")
      formData.append("product[brand]", data.brand)
      formData.append("product[gender]", data.gender || "Unisex")
      formData.append("product[product_type]", data.product_type || "")
      formData.append("product[activity]", data.activity || "")
      formData.append("product[franchise]", data.franchise || "")
      formData.append("product[care]", data.care || "")
      formData.append("product[specifications]", data.specifications || "")
      formData.append("product[badge]", data.badge || "")
      // 🖼️ Upload hình ảnh
      if (data.main_image instanceof File) {
        formData.append(`product[image]`, data.main_image)
      }
      if (data.hover_image instanceof File) {
        formData.append(`product[hover_image]`, data.hover_image)
      }


      data.variants.forEach((variant, index) => {
        if (variant.id) {
          formData.append(`product[variants_attributes][${index}][id]`, variant.id)
        }
        formData.append(`product[variants_attributes][${index}][variant_code]`, variant.variant_code)
        formData.append(`product[variants_attributes][${index}][color]`, variant.color)
        formData.append(`product[variants_attributes][${index}][price]`, variant.price.toString())
        formData.append(
          `product[variants_attributes][${index}][compare_at_price]`,
          (variant.compare_at_price || 0).toString(),
        )
        formData.append(`product[variants_attributes][${index}][stock]`, variant.stock.toString())

        // Images
        if (variant.main_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][avatar]`, variant.main_image)
        }
        if (variant.hover_image instanceof File) {
          formData.append(`product[variants_attributes][${index}][hover]`, variant.hover_image)
        }
        if (variant.additional_images) {
          variant.additional_images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              formData.append(`product[variants_attributes][${index}][images][${imageIndex}]`, image)
            }
          })
        }
      })

      const result = await updateProduct.mutateAsync({
        id: variant_code,
        formData,
      })

      if (result?.success && result.data) {
        const newSlug = slugify(result.data.name)
        const newVariantCode = result.data.variants?.[0]?.variant_code

        // toast("✅ Product updated successfully!")

        // 👇 cập nhật URL theo slug và variant_code mới
        // router.push(
        //   `/products/edit/${newSlug}/${newVariantCode}.html?mode=view`
        // )
        setTimeout(() => {
          window.location.href = `/products/edit/${newSlug}/${newVariantCode}.html?mode=edit`;
        }, 50);

        // 👇 làm mới dữ liệu trong form
        await refetch()
      } else {
        toast.error("❌ Product update failed!")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Loading />
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The requested product could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <EnhancedProductForm
          initialData={productData}
          onSubmit={handleSubmit}
          mode={mode}
          loading={updateProduct.isPending}
        />
      </div>
    </div>
  )
}

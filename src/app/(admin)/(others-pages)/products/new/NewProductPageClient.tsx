"use client"

import { useRouter } from "next/navigation"
import { EnhancedProductForm } from "@/components/products/enhanced-product-form"
import type { ProductFormData } from "@/lib/validations/product"
import { Loading } from "@/components/loading"
import { useState } from "react"
import { useCreateProduct } from "@/api/hooks/useProducts"
import { toast } from 'react-toastify'
import { slugify } from "@/utils/slugify"

export default function NewProductPageClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createProduct = useCreateProduct()

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // 🧱 Gửi các field product
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

      // 🧩 Gửi variants
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

        // 🖼️ Upload hình ảnh
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

      // 🚀 Gửi request tạo sản phẩm
      const result = await createProduct.mutateAsync(formData)

      if (result?.success && result?.data) {
        // toast("✅ Product created successfully!")

        const newSlug = slugify(result.data.name)
        const newVariantCode = result.data.variants?.[0]?.variant_code

        // 🔁 Redirect sang trang edit (hoặc view tuỳ ý)
        // router.push(
        //   `/products/edit/${newSlug}/${newVariantCode}.html?mode=view`
        // )
        setTimeout(() => {
          window.location.href = `/products/edit/${newSlug}/${newVariantCode}.html?mode=edit`;
        }, 50);
      } else {
        toast.error("❌ Failed to create product!")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🧱 initialData rỗng cho form create
  const initialData: ProductFormData = {
    name: "",
    model_number: "",
    description_h5: "",
    description_p: "",
    brand: "Adidas",
    category: "",
    sport: "",
    gender: "Unisex",
    product_type: "",
    activity: "",
    franchise: "",
    care: "",
    specifications: "",
    badge: "",
    variants: [
      {
        variant_code: "",
        color: "",
        price: 0,
        compare_at_price: 0,
        stock: 0,
      },
    ],
  }

  if (createProduct.isPending || isSubmitting) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <EnhancedProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          mode="create"
          loading={isSubmitting}
        />
      </div>
    </div>
  )
}

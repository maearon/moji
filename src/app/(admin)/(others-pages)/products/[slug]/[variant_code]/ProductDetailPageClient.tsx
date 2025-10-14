"use client"

import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { railsApi } from "@/lib/api/rails-client"
import { useProductDetail } from "@/hooks/useProducts"

interface ProductDetailPageClientProps {
  params: { 
    slug: string; 
    variant_code: string
  };
}

export default function ProductDetailPageClient({ params }: ProductDetailPageClientProps) {
  const { slug, variant_code } = params
  console.log("ProductDetailsPage params:", params)
  const router = useRouter()

  const {
      data: product,
      isLoading,
      // error,
      // refetch,
  } = useProductDetail(slug, variant_code)

  const handleSubmit = async (formData: FormData) => {
    try {
      await railsApi.updateProduct(variant_code, formData)
      router.push("/products")
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-gray-700 dark:text-gray-400">
        <h1 className="text-3xl font-bold tracking-tight uppercase">Product Details</h1>
        <p>Update product information and settings.</p>
      </div>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        loading={isLoading}
        mode="detail"
      />
    </div>
  )
}

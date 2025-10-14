// 📦 Product Service API
import api from "@/api/client"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { WithStatus } from "@/types/auth"
import { ApiResponse } from "@/types/common/api"
import { Product } from "@/types/product"

export interface ProductQuery {
  slug: string
  page?: number
  per_page?: number
  sort?: string
  gender?: string
  category?: string
  activity?: string
  sport?: string
  product_type?: string
  size?: string
  color?: string
  material?: string
  brand?: string
  model?: string
  collection?: string
  min_price?: number
  max_price?: number
  shipping?: string
}

export interface ProductMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  filters_applied: Record<string, unknown>
  category_info: {
    title: string
    breadcrumb: string
    description: string
  }
}

export type ProductListData = {
  products: Product[]
  meta: ProductMeta
}

export type ProductListResponse = ApiResponse<ProductListData>

const rubyService = {
  // ✅ Danh sách sản phẩm
  getProducts: async (params: ProductQuery): Promise<WithStatus<ProductListData | undefined> | undefined> => {
    try {
      const { data }  = await api.get<WithStatus<ProductListData>>("/products", { params })
      return data;
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Chi tiết sản phẩm theo slug và model
  getProductBySlugAndVariant: async (slug: string, modelNumber: string): Promise<WithStatus<Product | undefined> | undefined> => {
    try {
      const { data }  = await api.get<WithStatus<Product>>(`/products/${slug}/${modelNumber}`)
      return data;
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },
// }

// 📦 Product Service API
// import api from "@/api/client"
// import { handleNetworkError } from "@/components/shared/handleNetworkError"
// import type { WithStatus } from "@/types/auth"
// import type { ApiResponse } from "@/types/common/api"
// import type { Product } from "@/types/product"

// export interface ProductQuery {
//   slug?: string
//   page?: number
//   per_page?: number
//   sort?: string
//   gender?: string
//   category?: string
//   activity?: string
//   sport?: string
//   product_type?: string
//   size?: string
//   color?: string
//   material?: string
//   brand?: string
//   model?: string
//   collection?: string
//   min_price?: number
//   max_price?: number
//   shipping?: string
//   q?: string
//   cursor?: string
// }

// export interface ProductMeta {
//   current_page: number
//   total_pages: number
//   total_count: number
//   per_page: number
//   filters_applied: Record<string, unknown>
//   category_info: {
//     title: string
//     breadcrumb: string
//     description: string
//   }
// }

// export type ProductListData = {
//   products: Product[]
//   meta: ProductMeta
//   nextCursor?: string | null
// }

// export type ProductListResponse = ApiResponse<ProductListData>

// const rubyService = {
  // ✅ Danh sách sản phẩm
  // getProducts: async (params: ProductQuery): Promise<WithStatus<ProductListData | undefined> | undefined> => {
  //   try {
  //     const { data } = await api.get<WithStatus<ProductListData>>("/api/products", { params })
  //     return data
  //   } catch (error: unknown) {
  //     handleNetworkError(error)
  //     throw error
  //   }
  // },

  // ✅ Chi tiết sản phẩm theo slug và model
  // getProductBySlugAndVariant: async (
  //   slug: string,
  //   modelNumber: string,
  // ): Promise<WithStatus<Product | undefined> | undefined> => {
  //   try {
  //     const { data } = await api.get<WithStatus<Product>>(`/api/products/${slug}/${modelNumber}`)
  //     return data
  //   } catch (error: unknown) {
  //     handleNetworkError(error)
  //     throw error
  //   }
  // },

  // ✅ Tạo sản phẩm mới
  createProduct: async (formData: FormData): Promise<WithStatus<Product | undefined> | undefined> => {
    try {
      const { data } = await api.post<WithStatus<Product>>("/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Cập nhật sản phẩm
  updateProduct: async (
    id: string | number,
    formData: FormData,
  ): Promise<WithStatus<Product | undefined> | undefined> => {
    try {
      const { data } = await api.patch<WithStatus<Product>>(`/api/admin/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Xóa sản phẩm
  deleteProduct: async (id: string | number): Promise<WithStatus<{ message: string } | undefined> | undefined> => {
    try {
      const { data } = await api.delete<WithStatus<{ message: string }>>(`/api/admin/products/${id}`)
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Xóa nhiều sản phẩm
  bulkDeleteProducts: async (
    ids: (string | number)[],
  ): Promise<WithStatus<{ message: string } | undefined> | undefined> => {
    try {
      const { data } = await api.delete<WithStatus<{ message: string }>>("/api/admin/products/bulk", {
        data: { ids },
      })
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Bật/tắt trạng thái sản phẩm
  toggleProductStatus: async (id: string | number): Promise<WithStatus<Product | undefined> | undefined> => {
    try {
      const { data } = await api.patch<WithStatus<Product>>(`/api/admin/products/${id}/toggle_status`)
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Nhân bản sản phẩm
  duplicateProduct: async (id: string | number): Promise<WithStatus<Product | undefined> | undefined> => {
    try {
      const { data } = await api.post<WithStatus<Product>>(`/api/admin/products/${id}/duplicate`)
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Tìm kiếm sản phẩm
  searchProducts: async (query: string): Promise<WithStatus<ProductListData | undefined> | undefined> => {
    try {
      const { data } = await api.get<WithStatus<ProductListData>>("/api/admin/products/search", {
        params: { q: query },
      })
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Export sản phẩm
  exportProducts: async (params: ProductQuery): Promise<Blob> => {
    try {
      const { data } = await api.get("/api/admin/products/export", {
        params,
        responseType: "blob",
      })
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Sắp xếp lại thứ tự ảnh của variant
  reorderVariantImages: async (
    productId: string,
    variantId: string,
    imageOrder: string[]
  ): Promise<WithStatus<{ success: boolean; message: string } | undefined> | undefined> => {
    try {
      const { data } = await api.patch<WithStatus<{ success: boolean; message: string }>>(
        `/api/admin/products/${productId}/reorder_images`,
        {
          variant_id: variantId,
          image_order: imageOrder,
        }
      )
      return data
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },
}

export default rubyService

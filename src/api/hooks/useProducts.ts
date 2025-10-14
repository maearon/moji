import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProductFilters } from "@/types/product"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductData, ProductsPage } from "@/lib/types";
import axiosInstance from "@/lib/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner"
import rubyService from "../services/rubyService"

export const useSearchProductsFeed = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["product-feed", "search", query],
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.get<ProductsPage>("/api/search", { // search/route.ts
        params: {
          q: query,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      });
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: (failureCount, error: AxiosError<{ code?: string }>) => {
      if (error?.code === "ERR_NETWORK") return false;
      return failureCount < 1;
    }
  });
};

// ===============================
// ✅ useProductDetail: Lấy chi tiết sản phẩm theo slug + model
// ===============================
export const useProductDetail = ( slug: string, variant_code: string) => {
  return useQuery({
    // ): UseQueryResult<Product, Error> {
    queryKey: ["product-detail", slug, variant_code],
    queryFn: async () => {
      try {
        // const product = await rubyService.getProductBySlugAndVariant(slug, model)
        const response = await axiosInstance.get<ProductData>("/api/product", {
          params: {
            q: variant_code
          },
        });
        const product = response.data;
        if (!product) throw new Error("Product not found")
        return product
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    retry: (failureCount, error: AxiosError<{ code?: string }>) => {
      if (error?.code === "ERR_NETWORK") return false
      return failureCount < 1
    }
  })
}

// ===============================
// ✅ useProducts: Lấy danh sách sản phẩm
// ===============================

// export const useProducts = (filters: ProductFilters = {}) => {
//   return useInfiniteQuery<ProductsPage, Error, ProductsPage, (string | ProductFilters)[], string | undefined>({
//     queryKey: ["product-list", "search", filters],
//     queryFn: async ({ pageParam = undefined }) => {
//       const response = await axiosInstance.get<ProductsPage>("/api/search", {
//         params: {
//           q: 'a',
//           ...(pageParam ? { cursor: pageParam } : {}),
//         },
//       });
//       return response.data;
//     },
//     getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
//     initialPageParam: undefined,
//     retry: (failureCount, error) => {
//       const axiosErr = error as import("axios").AxiosError<{ code?: string }>;
//       if (axiosErr.code === "ERR_NETWORK") return false;
//       return failureCount < 1;
//     }
//   });
// };

export const useProducts = (filters: ProductFilters = {}) => {
  return useInfiniteQuery<
    ProductsPage, // dữ liệu trả về từ queryFn
    AxiosError<{ code?: string }>, // error type
    InfiniteData<ProductsPage>, // dữ liệu transform (data.pages)
    (string | ProductFilters)[], // queryKey
    string | undefined // pageParam (cursor)
  >({
    queryKey: ["product-list", "filters", filters],
    queryFn: async ({ pageParam = undefined }) => {
    
      const params: ProductFilters = {
        ...(filters.gender ? { gender: filters.gender } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        // ...(filters.priceMin ? { price_min: filters.priceMin } : {}),
        // ...(filters.priceMax ? { price_max: filters.priceMax } : {}),
        ...(pageParam ? { cursor: pageParam } : {}),
      };
      const response = await axiosInstance.get<ProductsPage>("/api/products", {
        params,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined,
    retry: (failureCount, error) => {
      if (error.code === "ERR_NETWORK") return false;
      return failureCount < 1;
    }
  });
};

// useInfiniteQuery<
//   TQueryFnData, // 1️⃣ Dữ liệu trả về từ queryFn
//   TError,       // 2️⃣ Kiểu error (mặc định: unknown)
//   TData,        // 3️⃣ Dữ liệu sau khi transform (select)
//   TQueryKey,    // 4️⃣ Kiểu queryKey
//   TPageParam    // 5️⃣ Kiểu pageParam
// >()

// export function useProducts(
//   filters: ProductFilters = {}
// ): UseQueryResult<ProductsResponse, Error> {
//   return useQuery<ProductsResponse, Error>({
//     queryKey: ["products", filters],
//     queryFn: async () => {
//       try {
//         const data = await rubyService.getProducts(filters as any)
//         if (!data) throw new Error("No product data found")
//         return data
//       } catch (error: any) {
//         handleNetworkError(error)
//         throw error
//       }
//     },
//     retry: (failureCount, error: any) => {
//       if (error?.code === "ERR_NETWORK") return false
//       return failureCount < 1
//     },
//     staleTime: CACHE_TTL,
//     gcTime: CACHE_TTL * 2,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//   })
// }

// import { type InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import type { ProductFilters } from "@/types/product"
// import { handleNetworkError } from "@/components/shared/handleNetworkError"
// import { useInfiniteQuery } from "@tanstack/react-query"
// import type { ProductsPage } from "@/lib/types"
// import type { AxiosError } from "axios"


// ===============================
// ✅ useSearchProductsFeed: Tìm kiếm sản phẩm với infinite scroll
// ===============================
// export const useSearchProductsFeed = (query: string) => {
//   return useInfiniteQuery({
//     queryKey: ["product-feed", "search", query],
//     queryFn: async ({ pageParam }) => {
//       try {
//         const params = {
//           q: query,
//           ...(pageParam ? { cursor: pageParam } : {}),
//         }
//         const response = await rubyService.getProducts(params as any)
//         return response?.data || { products: [], nextCursor: null }
//       } catch (error: unknown) {
//         handleNetworkError(error)
//         throw error
//       }
//     },
//     initialPageParam: null as string | null,
//     getNextPageParam: (lastPage) => lastPage.nextCursor,
//     retry: (failureCount, error: AxiosError<{ code?: string }>) => {
//       if (error?.code === "ERR_NETWORK") return false
//       return failureCount < 1
//     },
//   })
// }

// ===============================
// ✅ useProductDetail: Lấy chi tiết sản phẩm theo slug + variant_code
// ===============================
// export const useProductDetail = (slug: string, variant_code: string) => {
//   return useQuery({
//     queryKey: ["product-detail", slug, variant_code],
//     queryFn: async () => {
//       try {
//         const response = await rubyService.getProductBySlugAndVariant(slug, variant_code)
//         const product = response?.data
//         if (!product) throw new Error("Product not found")
//         return product
//       } catch (error: unknown) {
//         handleNetworkError(error)
//         throw error
//       }
//     },
//     retry: (failureCount, error: AxiosError<{ code?: string }>) => {
//       if (error?.code === "ERR_NETWORK") return false
//       return failureCount < 1
//     },
//   })
// }

// ===============================
// ✅ useProducts: Lấy danh sách sản phẩm với infinite scroll
// ===============================
// export const useProducts = (filters: ProductFilters = {}) => {
//   return useInfiniteQuery<
//     ProductsPage,
//     AxiosError<{ code?: string }>,
//     InfiniteData<ProductsPage>,
//     (string | ProductFilters)[],
//     string | undefined
//   >({
//     queryKey: ["product-list", "filters", filters],
//     queryFn: async ({ pageParam = undefined }) => {
//       try {
//         const params = {
//           ...(filters.gender ? { gender: filters.gender } : {}),
//           ...(filters.category ? { category: filters.category } : {}),
//           ...(filters.sport ? { sport: filters.sport } : {}),
//           ...(filters.brand ? { brand: filters.brand } : {}),
//           ...(pageParam ? { cursor: pageParam } : {}),
//         }

//         const response = await rubyService.getProducts(params as any)
//         return response?.data || { products: [], nextCursor: null }
//       } catch (error: unknown) {
//         handleNetworkError(error)
//         throw error
//       }
//     },
//     getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
//     initialPageParam: undefined,
//     retry: (failureCount, error) => {
//       if (error.code === "ERR_NETWORK") return false
//       return failureCount < 1
//     },
//   })
// }

// ===============================
// ✅ useCreateProduct: Tạo sản phẩm mới
// ===============================
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await rubyService.createProduct(formData)
        return response
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch product lists
      queryClient.invalidateQueries({ queryKey: ["product-list"] })
      queryClient.invalidateQueries({ queryKey: ["product-feed"] })

      toast.success("Product created successfully!")
      return data
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      console.error("Create product error:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to create product"
      toast.error(errorMessage)
      throw error
    },
  })
}

// ===============================
// ✅ useUpdateProduct: Cập nhật sản phẩm
// ===============================
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string | number; formData: FormData }) => {
      try {
        const response = await rubyService.updateProduct(id, formData)
        return response
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate specific product detail
      queryClient.invalidateQueries({
        queryKey: ["product-detail"],
      })

      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: ["product-list"] })
      queryClient.invalidateQueries({ queryKey: ["product-feed"] })

      toast.success("Product updated successfully!")
      return data
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      console.error("Update product error:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to update product"
      toast.error(errorMessage)
      throw error
    },
  })
}

// ===============================
// ✅ useDeleteProduct: Xóa sản phẩm
// ===============================
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await rubyService.deleteProduct(id)
        return response
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ["product-detail", id],
      })

      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: ["product-list"] })
      queryClient.invalidateQueries({ queryKey: ["product-feed"] })

      toast.success("Product deleted successfully!")
      return data
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      console.error("Delete product error:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to delete product"
      toast.error(errorMessage)
      throw error
    },
  })
}

// ===============================
// ✅ useBulkDeleteProducts: Xóa nhiều sản phẩm
// ===============================
export function useBulkDeleteProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      try {
        const response = await rubyService.bulkDeleteProducts(ids)
        return response
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: (data, ids) => {
      // Remove from cache
      ids.forEach((id) => {
        queryClient.removeQueries({
          queryKey: ["product-detail", id],
        })
      })

      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: ["product-list"] })
      queryClient.invalidateQueries({ queryKey: ["product-feed"] })

      toast.success(`${ids.length} products deleted successfully!`)
      return data
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      console.error("Bulk delete error:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to delete products"
      toast.error(errorMessage)
      throw error
    },
  })
}

// ===============================
// ✅ useToggleProductStatus: Bật/tắt trạng thái sản phẩm
// ===============================
export function useToggleProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await rubyService.toggleProductStatus(id)
        return response
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: (data, id) => {
      // Invalidate specific product detail
      queryClient.invalidateQueries({
        queryKey: ["product-detail", id],
      })

      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: ["product-list"] })
      queryClient.invalidateQueries({ queryKey: ["product-feed"] })

      toast.success("Product status updated successfully!")
      return data
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      console.error("Toggle status error:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to update product status"
      toast.error(errorMessage)
      throw error
    },
  })
}

// ===============================
// ✅ useDuplicateProduct: Nhân bản sản phẩm
// ===============================
export function useDuplicateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await rubyService.duplicateProduct(id)
        return response
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: (data) => {
      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: ["product-list"] })
      queryClient.invalidateQueries({ queryKey: ["product-feed"] })

      toast.success("Product duplicated successfully!")
      return data
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      console.error("Duplicate product error:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to duplicate product"
      toast.error(errorMessage)
      throw error
    },
  })
}

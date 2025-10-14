import type { Product, ProductsResponse } from "@/types/product"
import type { ProductFilters } from "@/types/product/filters"

export interface Category {
  id: number
  name: string
  slug: string
  parent_id: number | null
}

export interface Collaboration {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Model {
  id: number
  name: string
  slug: string
  description: string | null
  model_base_id: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  url: string
  filename: string
  content_type: string
  byte_size: number
}

const API_BASE = "https://api.example.com"

export const productApi = {
  // Get all products with optional filters
  async getProducts(params?: ProductFilters): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.q) searchParams.set("q", params.q)
    if (params?.gender) searchParams.set("gender", params.gender)
    if (params?.category) searchParams.set("category", params.category)
    if (params?.sport) searchParams.set("sport", params.sport)
    if (params?.brand) searchParams.set("brand", params.brand)
    if (params?.min_price) searchParams.set("min_price", params.min_price.toString())
    if (params?.max_price) searchParams.set("max_price", params.max_price.toString())
    if (params?.size) searchParams.set("size", params.size)
    if (params?.color) searchParams.set("color", params.color)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.per_page) searchParams.set("per_page", params.per_page.toString())

    const response = await fetch(`${API_BASE}/products?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch products")
    return response.json()
  },

  // Get single product
  async getProduct(id: number | string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`)
    if (!response.ok) throw new Error("Failed to fetch product")
    return response.json()
  },

  // Create product
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: data }),
    })
    if (!response.ok) throw new Error("Failed to create product")
    return response.json()
  },

  // Update product
  async updateProduct(id: number | string, data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: data }),
    })
    if (!response.ok) throw new Error("Failed to update product")
    return response.json()
  },

  // Delete product
  async deleteProduct(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete product")
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE}/categories`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  // Get collaborations
  async getCollaborations(): Promise<Collaboration[]> {
    const response = await fetch(`${API_BASE}/collaborations`)
    if (!response.ok) throw new Error("Failed to fetch collaborations")
    return response.json()
  },

  // Get models
  async getModels(): Promise<Model[]> {
    const response = await fetch(`${API_BASE}/models`)
    if (!response.ok) throw new Error("Failed to fetch models")
    return response.json()
  },

  // Get tags
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE}/tags`)
    if (!response.ok) throw new Error("Failed to fetch tags")
    return response.json()
  },

  // Upload image
  async uploadImage(file: File, productId: number | string): Promise<ProductImage> {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("product_id", productId.toString())

    const response = await fetch(`${API_BASE}/products/${productId}/images`, {
      method: "POST",
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload image")
    return response.json()
  },

  // Delete image
  async deleteImage(productId: number | string, imageId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/products/${productId}/images/${imageId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete image")
  },
}

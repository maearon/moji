// Rails API Client Configuration
const RAILS_API_BASE = process.env.NEXT_PUBLIC_RAILS_API_URL || "http://localhost:3000/api"

interface ApiResponse<T> {
  data?: T
  products?: T[]
  orders?: T[]
  customers?: T[]
  meta?: {
    current_page: number
    per_page: number
    total_pages: number
    total_count: number
    [key: string]: any
  }
  errors?: string[]
  message?: string
}

class RailsApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = RAILS_API_BASE
    // Get token from localStorage or cookies
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      ...options.headers,
    }

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken()
          throw new Error("Authentication required")
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Products API
  async getProducts(params?: Record<string, any>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, value.toString())
        }
      })
    }

    const endpoint = `/admin/products${searchParams.toString() ? `?${searchParams}` : ""}`
    return this.request<any[]>(endpoint)
  }

  async getProduct(id: string | number) {
    return this.request<any>(`/admin/products/${id}`)
  }

  async createProduct(data: FormData) {
    return this.request<any>("/admin/products", {
      method: "POST",
      body: data,
    })
  }

  async updateProduct(id: string | number, data: FormData) {
    return this.request<any>(`/admin/products/${id}`, {
      method: "PUT",
      body: data,
    })
  }

  async deleteProduct(id: string | number) {
    return this.request<any>(`/admin/products/${id}`, {
      method: "DELETE",
    })
  }

  async bulkUpdateProducts(productIds: number[], action: string, data?: any) {
    return this.request<any>("/admin/products/bulk_update", {
      method: "POST",
      body: JSON.stringify({
        product_ids: productIds,
        action,
        ...data,
      }),
    })
  }

  // Orders API
  async getOrders(params?: Record<string, any>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, value.toString())
        }
      })
    }

    const endpoint = `/admin/orders${searchParams.toString() ? `?${searchParams}` : ""}`
    return this.request<any[]>(endpoint)
  }

  async getOrder(id: string | number) {
    return this.request<any>(`/admin/orders/${id}`)
  }

  async updateOrder(id: string | number, data: any) {
    return this.request<any>(`/admin/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ order: data }),
    })
  }

  async updateOrderStatus(id: string | number, status: string, notes?: string) {
    return this.request<any>(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    })
  }

  // Customers API
  async getCustomers(params?: Record<string, any>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, value.toString())
        }
      })
    }

    const endpoint = `/admin/customers${searchParams.toString() ? `?${searchParams}` : ""}`
    return this.request<any[]>(endpoint)
  }

  async getCustomer(id: string | number) {
    return this.request<any>(`/admin/customers/${id}`)
  }

  async updateCustomer(id: string | number, data: any) {
    return this.request<any>(`/admin/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify({ customer: data }),
    })
  }

  // Dashboard API
  async getDashboardStats(period?: string) {
    const endpoint = `/admin/dashboard${period ? `?period=${period}` : ""}`
    return this.request<any>(endpoint)
  }
}

export const railsApi = new RailsApiClient()
export type { ApiResponse }

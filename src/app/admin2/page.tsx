"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  Eye
} from "lucide-react"
import { CloudinaryImage } from "@/components/image/cloudinary-image"
import { railsApi } from "@/lib/api/rails-client"

interface DashboardStats {
  total_revenue: number
  total_orders: number
  total_products: number
  active_users: number
  recent_orders: any[]
  top_products: any[]
  revenue_chart: any
  orders_chart: any
}

const stats = [
  {
    title: "Total Products",
    value: "1,234",
    description: "+20.1% from last month",
    icon: Package,
  },
  {
    title: "Total Orders",
    value: "5,678",
    description: "+15.3% from last month",
    icon: ShoppingCart,
  },
  {
    title: "Total Customers",
    value: "9,012",
    description: "+8.7% from last month",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$45,231.89",
    description: "+25.2% from last month",
    icon: DollarSign,
  },
  {
    title: "Page Views",
    value: "123,456",
    description: "+12.5% from last month",
    icon: Eye,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    description: "+0.5% from last month",
    icon: TrendingUp,
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30_days")

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await railsApi.getDashboardStats(period)
      setStats(response.data)
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.total_revenue?.toLocaleString() || "0"}`,
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders?.toLocaleString() || "0",
      change: "+180.1%",
      trend: "up",
      icon: ShoppingCart,
      description: "from last month",
    },
    {
      title: "Total Products",
      value: stats?.total_products?.toLocaleString() || "0",
      change: "+19%",
      trend: "up",
      icon: Package,
      description: "active products",
    },
    {
      title: "Active Users",
      value: stats?.active_users?.toLocaleString() || "0",
      change: "+201",
      trend: "up",
      icon: Users,
      description: "online now",
    },
  ]

  return (
    <>
    {/* <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats?.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-2 border-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div> */}
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50 min-h-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase adidas-heading">Dashboard</h1>
          <p className="text-gray-600 mt-2 font-medium">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7_days">Last 7 days</SelectItem>
              <SelectItem value="30_days">Last 30 days</SelectItem>
              <SelectItem value="12_months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <AdidasButton theme="white" shadow={true} pressEffect={true} onClick={loadDashboardStats}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </AdidasButton>
          <AdidasButton theme="black" shadow={true} pressEffect={true} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </AdidasButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="card-adidas hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wide text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-black">{stat.value}</div>
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={`font-bold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <span className="font-medium">{stat.description}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-1 lg:col-span-4 card-adidas">
          <CardHeader className="border-b-2 border-black">
            <CardTitle className="uppercase tracking-wide font-bold text-lg">Recent Orders</CardTitle>
            <CardDescription className="font-medium">
              You have {stats?.recent_orders?.length || 0} new orders this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y-2 divide-gray-100">
              {stats?.recent_orders?.map((order, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-black">{order.customer}</p>
                    <p className="text-sm text-gray-600 font-medium">{order.email}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "processing"
                            ? "secondary"
                            : order.status === "shipped"
                              ? "outline"
                              : "destructive"
                      }
                      className="uppercase tracking-wide font-bold border-2 border-black rounded-none"
                    >
                      {order.status}
                    </Badge>
                    <div className="font-bold text-lg text-black">${order.total}</div>
                  </div>
                </div>
              )) || (
                <div className="p-8 text-center text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-1 lg:col-span-3 card-adidas">
          <CardHeader className="border-b-2 border-black">
            <CardTitle className="uppercase tracking-wide font-bold text-lg">Top Products</CardTitle>
            <CardDescription className="font-medium">Best performing products this month.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y-2 divide-gray-100">
              {stats?.top_products?.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <CloudinaryImage
                          src={product.image_url}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          crop="fill"
                          quality={80}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">{product.name}</p>
                      <p className="text-sm text-gray-600 font-medium">{product.total_sold} sales</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div className="text-right">
                      <div className="font-bold text-black">${product.revenue}</div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-8 text-center text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No product data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-adidas">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="uppercase tracking-wide font-bold text-lg">Quick Actions</CardTitle>
          <CardDescription className="font-medium">
            Frequently used actions to manage your store efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <AdidasButton
              theme="white"
              shadow={true}
              pressEffect={true}
              fullWidth={true}
              className="h-auto p-4 flex flex-col items-start gap-3 text-left border-2 border-black hover-lift"
              href="/admin/products/new"
            >
              <Package className="h-6 w-6 text-black" />
              <div>
                <div className="font-bold text-sm uppercase tracking-wide text-black">Add New Product</div>
                <div className="text-xs text-gray-600 normal-case font-medium mt-1">Create a new product listing</div>
              </div>
            </AdidasButton>

            <AdidasButton
              theme="white"
              shadow={true}
              pressEffect={true}
              fullWidth={true}
              className="h-auto p-4 flex flex-col items-start gap-3 text-left border-2 border-black hover-lift"
              href="/admin/orders"
            >
              <ShoppingCart className="h-6 w-6 text-black" />
              <div>
                <div className="font-bold text-sm uppercase tracking-wide text-black">View Orders</div>
                <div className="text-xs text-gray-600 normal-case font-medium mt-1">Check recent orders</div>
              </div>
            </AdidasButton>

            <AdidasButton
              theme="white"
              shadow={true}
              pressEffect={true}
              fullWidth={true}
              className="h-auto p-4 flex flex-col items-start gap-3 text-left border-2 border-black hover-lift"
              href="/admin/customers"
            >
              <Users className="h-6 w-6 text-black" />
              <div>
                <div className="font-bold text-sm uppercase tracking-wide text-black">Customer Support</div>
                <div className="text-xs text-gray-600 normal-case font-medium mt-1">Handle customer inquiries</div>
              </div>
            </AdidasButton>

            <AdidasButton
              theme="white"
              shadow={true}
              pressEffect={true}
              fullWidth={true}
              className="h-auto p-4 flex flex-col items-start gap-3 text-left border-2 border-black hover-lift"
              href="/admin/analytics"
            >
              <TrendingUp className="h-6 w-6 text-black" />
              <div>
                <div className="font-bold text-sm uppercase tracking-wide text-black">Analytics Report</div>
                <div className="text-xs text-gray-600 normal-case font-medium mt-1">View detailed analytics</div>
              </div>
            </AdidasButton>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

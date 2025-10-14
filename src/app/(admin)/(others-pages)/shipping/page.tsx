"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Truck, Package, MapPin, Clock, Plus, Download, RefreshCw } from "lucide-react"

interface Shipment {
  id: number
  order_id: number
  tracking_number: string
  customer_name: string
  destination: string
  carrier: string
  service_type: string
  status: string
  shipped_at: string
  estimated_delivery: string
  actual_delivery?: string
  weight: number
  cost: number
}

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    q: "",
    status: "all",
    carrier: "all",
    page: 1,
    per_page: 20,
    sort: "shipped_desc",
  })

  // Mock data
  const mockShipments: Shipment[] = [
    {
      id: 1,
      order_id: 1001,
      tracking_number: "VN123456789",
      customer_name: "Nguyễn Văn A",
      destination: "Ho Chi Minh City",
      carrier: "Giao Hàng Nhanh",
      service_type: "Express",
      status: "in_transit",
      shipped_at: "2024-01-15T10:30:00Z",
      estimated_delivery: "2024-01-17T18:00:00Z",
      weight: 1.2,
      cost: 35000,
    },
    {
      id: 2,
      order_id: 1002,
      tracking_number: "VN987654321",
      customer_name: "Trần Thị B",
      destination: "Hanoi",
      carrier: "Viettel Post",
      service_type: "Standard",
      status: "delivered",
      shipped_at: "2024-01-14T14:20:00Z",
      estimated_delivery: "2024-01-16T18:00:00Z",
      actual_delivery: "2024-01-16T15:30:00Z",
      weight: 0.8,
      cost: 25000,
    },
    {
      id: 3,
      order_id: 1003,
      tracking_number: "VN456789123",
      customer_name: "Lê Văn C",
      destination: "Da Nang",
      carrier: "J&T Express",
      service_type: "Economy",
      status: "pending",
      shipped_at: "2024-01-16T09:15:00Z",
      estimated_delivery: "2024-01-19T18:00:00Z",
      weight: 2.1,
      cost: 45000,
    },
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setShipments(mockShipments)
      setLoading(false)
    }, 1000)
  }, [filters])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "in_transit":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      case "returned":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Shipping</h1>
          <p className="text-muted-foreground">Track and manage order shipments.</p>
        </div>
        <div className="flex gap-2">
          <AdidasButton className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Create Shipment
          </AdidasButton>
          <AdidasButton className="border-2 border-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export
          </AdidasButton>
          <AdidasButton className="border-2 border-foreground">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </AdidasButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,156</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments Table */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Shipment Management</CardTitle>
          <CardDescription>Track all shipments and delivery status.</CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                className="pl-8 border-2 border-foreground"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="w-[180px] border-2 border-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.carrier} onValueChange={(value) => handleFilterChange("carrier", value)}>
              <SelectTrigger className="w-[180px] border-2 border-foreground">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground">
                <SelectItem value="all">All Carriers</SelectItem>
                <SelectItem value="ghn">Giao Hàng Nhanh</SelectItem>
                <SelectItem value="viettel">Viettel Post</SelectItem>
                <SelectItem value="jnt">J&T Express</SelectItem>
                <SelectItem value="shopee">Shopee Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipped</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">#{shipment.order_id}</TableCell>
                    <TableCell className="font-mono text-sm">{shipment.tracking_number}</TableCell>
                    <TableCell>{shipment.customer_name}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{shipment.carrier}</div>
                        <div className="text-sm text-muted-foreground">{shipment.service_type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(shipment.status)} className="flex items-center gap-1">
                        {getStatusIcon(shipment.status)}
                        {shipment.status.replace("_", " ").charAt(0).toUpperCase() +
                          shipment.status.replace("_", " ").slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(shipment.shipped_at).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>{new Date(shipment.estimated_delivery).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(shipment.cost)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <AdidasButton size="icon" className="border-2 border-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </AdidasButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-2 border-foreground">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <MapPin className="mr-2 h-4 w-4" />
                            Track Shipment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Print Label</DropdownMenuItem>
                          <DropdownMenuItem>Contact Carrier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Cancel Shipment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

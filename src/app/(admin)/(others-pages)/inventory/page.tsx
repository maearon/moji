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
import {
  Search,
  MoreHorizontal,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  RefreshCw,
} from "lucide-react"

interface InventoryItem {
  id: number
  product_name: string
  variant_color: string
  size: string
  sku: string
  stock: number
  reserved: number
  available: number
  reorder_point: number
  status: string
  last_updated: string
  location: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    q: "",
    status: "all",
    location: "all",
    page: 1,
    per_page: 20,
    sort: "stock_asc",
  })

  // Mock data
  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      product_name: "Adidas Ultraboost 22",
      variant_color: "Black",
      size: "42",
      sku: "UB22-BLK-42",
      stock: 5,
      reserved: 2,
      available: 3,
      reorder_point: 10,
      status: "low_stock",
      last_updated: "2024-01-15T10:30:00Z",
      location: "Warehouse A",
    },
    {
      id: 2,
      product_name: "Adidas Stan Smith",
      variant_color: "White",
      size: "40",
      sku: "SS-WHT-40",
      stock: 25,
      reserved: 5,
      available: 20,
      reorder_point: 15,
      status: "in_stock",
      last_updated: "2024-01-14T14:20:00Z",
      location: "Warehouse B",
    },
    {
      id: 3,
      product_name: "Adidas Gazelle",
      variant_color: "Blue",
      size: "41",
      sku: "GAZ-BLU-41",
      stock: 0,
      reserved: 0,
      available: 0,
      reorder_point: 8,
      status: "out_of_stock",
      last_updated: "2024-01-13T09:15:00Z",
      location: "Warehouse A",
    },
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setInventory(mockInventory)
      setLoading(false)
    }, 1000)
  }, [filters])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "in_stock":
        return "default"
      case "low_stock":
        return "secondary"
      case "out_of_stock":
        return "destructive"
      case "overstock":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "low_stock":
        return <AlertTriangle className="h-4 w-4" />
      case "overstock":
        return <TrendingUp className="h-4 w-4" />
      case "out_of_stock":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Inventory</h1>
          <p className="text-muted-foreground">Track and manage product stock levels.</p>
        </div>
        <div className="flex gap-2">
          <AdidasButton className="border-2 border-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,543</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫2.5B</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Inventory Management</CardTitle>
          <CardDescription>Monitor stock levels and manage inventory.</CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                className="pl-8 border-2 border-foreground"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="w-[180px] border-2 border-foreground">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="overstock">Overstock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger className="w-[180px] border-2 border-foreground">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                <SelectItem value="store">Store</SelectItem>
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
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.variant_color} - Size {item.size}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="font-medium">{item.stock}</TableCell>
                    <TableCell>{item.reserved}</TableCell>
                    <TableCell className="font-medium">{item.available}</TableCell>
                    <TableCell>{item.reorder_point}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)} className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        {item.status.replace("_", " ").charAt(0).toUpperCase() + item.status.replace("_", " ").slice(1)}
                      </Badge>
                    </TableCell>
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
                            <Plus className="mr-2 h-4 w-4" />
                            Add Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem>Set Reorder Point</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Transfer Stock</DropdownMenuItem>
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

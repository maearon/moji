"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Eye, Mail, Phone, Users, UserPlus, Download, RefreshCw } from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
// import { User } from "@/lib/auth"
import Image from "next/image";

// interface Customer {
//   id: number
//   name: string
//   email: string
//   phone?: string
//   total_orders: number
//   total_spent: number
//   status: string
//   created_at: string
//   last_order_at?: string
//   location: string
// }

export default function CustomersPage() {
  const { 
    users: customers, 
    // total, 
    isLoading: loading 
  } = useUsers()
  // const customers = data?.data ?? []
  // const [customers, setCustomers] = useState<User[]>([])
  // const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    q: "",
    status: "all",
    location: "all",
    page: 1,
    per_page: 20,
    sort: "created_desc",
  })

  type Filters = typeof filters

  // Mock data
  // const mockCustomers: Customer[] = [
  //   {
  //     id: 1,
  //     name: "Nguyễn Văn A",
  //     email: "nguyenvana@email.com",
  //     phone: "+84 901 234 567",
  //     total_orders: 15,
  //     total_spent: 12500000,
  //     status: "active",
  //     created_at: "2023-06-15T10:30:00Z",
  //     last_order_at: "2024-01-15T10:30:00Z",
  //     location: "Ho Chi Minh City",
  //   },
  //   {
  //     id: 2,
  //     name: "Trần Thị B",
  //     email: "tranthib@email.com",
  //     phone: "+84 902 345 678",
  //     total_orders: 8,
  //     total_spent: 6800000,
  //     status: "active",
  //     created_at: "2023-08-20T14:20:00Z",
  //     last_order_at: "2024-01-10T14:20:00Z",
  //     location: "Hanoi",
  //   },
  //   {
  //     id: 3,
  //     name: "Lê Văn C",
  //     email: "levanc@email.com",
  //     phone: "+84 903 456 789",
  //     total_orders: 3,
  //     total_spent: 2100000,
  //     status: "inactive",
  //     created_at: "2023-12-01T09:15:00Z",
  //     last_order_at: "2023-12-15T09:15:00Z",
  //     location: "Da Nang",
  //   },
  // ]

  // useEffect(() => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     setCustomers(mockCustomers)
  //     setLoading(false)
  //   }, 1000)
  // }, [filters])

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   }).format(amount)
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Customers</h1>
          <p className="text-muted-foreground">Manage customer accounts and relationships.</p>
        </div>
        <div className="flex gap-2">
          <AdidasButton className="border-2 border-foreground">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,234</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫850K</div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Customer Management</CardTitle>
          <CardDescription>A list of all customers in your store.</CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger className="w-[180px] border-2 border-foreground">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="ho-chi-minh">Ho Chi Minh City</SelectItem>
                <SelectItem value="hanoi">Hanoi</SelectItem>
                <SelectItem value="da-nang">Da Nang</SelectItem>
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
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Customer</TableHead>
                  {/* <TableHead>Location</TableHead> */}
                  {/* <TableHead>Orders</TableHead> */}
                  {/* <TableHead>Total Spent</TableHead> */}
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Last Order</TableHead> */}
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={customer.image || "/avatar-placeholder.png"}
                            alt={customer.name}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {customer.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {customer.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{customer.email}</div>
                        {/* {customer.phone && <div className="text-sm text-muted-foreground">{customer.phone}</div>} */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">ID: #{customer.id}</div>
                      </div>
                    </TableCell>
                    {/* <TableCell>{customer.location}</TableCell> */}
                    {/* <TableCell className="font-medium">{customer.total_orders}</TableCell> */}
                    {/* <TableCell className="font-medium">{formatCurrency(customer.total_spent)}</TableCell> */}
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(customer.emailVerified ? "active" : "inactive")}>
                        {/* {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)} */}
                        {customer.emailVerified ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString("vi-VN") : "Never"}
                    </TableCell> */}
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Block Customer</DropdownMenuItem>
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

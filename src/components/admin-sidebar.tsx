"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Truck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { AdidasButton } from "@/components/ui/adidas-button"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: BarChart3,
  },
  {
    name: "Shipping",
    href: "/admin/shipping",
    icon: Truck,
  },
  {
    name: "Chat",
    href: "/admin/chat",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-white border-r-2 border-black transition-all duration-300 hidden md:block",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-50">
        <AdidasButton
          size="icon"
          variant="outline"
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 border-2 border-black bg-white hover:bg-gray-50"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </AdidasButton>
      </div>

      <div className="p-4">
        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 border-2 border-transparent",
                  isActive && "bg-black text-white border-black",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
                {!collapsed && <span className="uppercase tracking-wide">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="border-t-2 border-black pt-4">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-6 items-center justify-center bg-black text-white font-bold text-sm">
                  a
                </div>
                <div className="text-xs">
                  <div className="font-bold uppercase">ADIDAS</div>
                  <div className="text-gray-500">Admin Panel</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

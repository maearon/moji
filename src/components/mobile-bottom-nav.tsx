"use client"

import { HomeIcon, SearchIcon, PlusCircleIcon, HeartIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export const MobileBottomNav = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", icon: HomeIcon, label: "Home" },
    { href: "/products", icon: SearchIcon, label: "Products" },
    { href: "/orders", icon: PlusCircleIcon, label: "Orders" },
    { href: "/customers", icon: HeartIcon, label: "Customers" },
    { href: "/settings", icon: UserIcon, label: "Settings" },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-gray-200 shadow-lg md:hidden">
      <div
        className="flex items-center justify-around p-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors touch-target",
                isActive ? "text-black bg-gray-100" : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav

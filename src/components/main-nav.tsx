"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin" ? "text-black" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/admin/products"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/admin/products") ? "text-black" : "text-muted-foreground",
        )}
      >
        Products
      </Link>
      <Link
        href="/admin/orders"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/admin/orders") ? "text-black" : "text-muted-foreground",
        )}
      >
        Orders
      </Link>
      <Link
        href="/admin/customers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname?.startsWith("/admin/customers") ? "text-black" : "text-muted-foreground",
        )}
      >
        Customers
      </Link>
    </nav>
  )
}

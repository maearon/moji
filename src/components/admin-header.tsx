"use client"

import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="flex aspect-square size-8 items-center justify-center bg-black text-white font-bold text-lg">
            a
          </div>
          <span className="font-bold text-lg uppercase tracking-wider">ADIDAS</span>
          <span className="text-xs text-gray-500 hidden sm:block">ADMIN</span>
        </div>
        <MainNav className="hidden md:flex" />
        <div className="flex-1" />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}

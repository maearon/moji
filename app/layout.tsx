import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { SocketProvider } from "@/lib/socket/socket-context"

export const metadata: Metadata = {
  title: "Moji - Modern Chat App",
  description: "Connect with friends through Moji chat",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SocketProvider>{children}</SocketProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

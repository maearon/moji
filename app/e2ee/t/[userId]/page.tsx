"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(result.error.message || "Đăng nhập thất bại")
      } else {
        router.push("/chat")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Left side - Login form */}
        <div className="flex w-full flex-col justify-center p-12 lg:w-1/2">
          <div className="mx-auto w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Chào mừng quay lại</h1>
              <p className="text-gray-600">Đăng nhập vào tài khoản Moji của bạn</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mtikcode@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Mật khẩu
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-base font-semibold text-white hover:from-purple-700 hover:to-fuchsia-700"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-700">
                  Đăng ký
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <Link href="/terms" className="text-purple-600 hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-purple-600 hover:underline">
              Chính sách bảo mật
            </Link>{" "}
            của chúng tôi.
          </p>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-12 lg:flex">
          <div className="relative">
            <img
              src="/modern-login-illustration-with-people-and-mobile-p.jpg"
              alt="Login illustration"
              className="h-auto w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

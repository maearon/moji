"use client"

import type React from "react"
import { useState } from "react"
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp")
      return
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      if (result.error) {
        setError(result.error.message || "Đăng ký thất bại")
      } else {
        router.push("/chat")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Left side - Register form */}
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

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Tạo tài khoản Moji</h1>
              <p className="text-gray-600">Đăng ký để bắt đầu trò chuyện</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            Bằng cách đăng ký, bạn đồng ý với{" "}
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

        <div className="hidden relative w-1/2 overflow-hidden lg:flex">
          <img
            src="/modern-login-illustration-with-people-and-mobile-p.jpg"
            alt="Login illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useRouter  } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast"
import { LogIn, Sun, Moon, Eye, EyeOff, Loader2 } from "lucide-react"
import { useTheme } from "@/components/common/ThemeProvider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated, login } = useAuth()
  const { addToast } = useToast()

  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const validate = () => {
    if (!email) return "Email is required"
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) return "Enter a valid email"
    if (!password || password.length < 6) return "Password must be at least 6 characters"
    return null
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (isAuthenticated) router.replace("/admin/dashboard");
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      addToast(v, "error")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.post("/api/admin/login", { email, password }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })

      if (data?.token && data?.user) {
        login(data.user, data.token) // ✅ Correct usage
        console.log("DATA: ",data)
        addToast("Login successful", "success")
        router.push("/admin/topics")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err) {
      console.error("Login Error:", err)

      let message = "Something went wrong — please try again"

      // ✅ Axios error check (official helper)
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.error ||
          err.message ||
          message
      } else if (err instanceof Error) {
        message = err.message
      }

      setError(message)
      addToast(message, "error")
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail("admin@worlddoc.com")
    setPassword("admin123")
    addToast("Filled demo credentials", "info")
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} color="#fff" />}
      </button>

      <div className="w-full max-w-md">
        <div className={`rounded-2xl shadow-lg p-8 border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-lg">
              <LogIn size={26} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">WorldDoc</h1>
              <p className="text-sm text-muted-foreground">Admin Panel — Secure sign in</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border"
                />
                <span>Remember me</span>
              </label>

              <a href="/forgot-password" className="text-primary-600 hover:underline">Forgot password?</a>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary-600 border font-medium shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 border-t pt-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Demo Credentials</p>
              <p className="text-xs">admin@worlddoc.com / admin123</p>
            </div>

            <button type="button" onClick={fillDemo} className="text-xs px-3 py-1 rounded-md border hover:bg-gray-500">
              Fill demo
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Need an account?{" "}
            <a href="/signup" className="text-primary-600 hover:underline">
              Contact the system administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

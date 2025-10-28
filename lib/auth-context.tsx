"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ✅ Load from localStorage only on client
  useEffect(() => {
  if (typeof window === "undefined") return

  // Run inside a microtask to avoid synchronous re-render
  Promise.resolve().then(() => {
    const storedToken = localStorage.getItem("auth-token")
    const storedUser = localStorage.getItem("auth-user")

    if (storedToken) setToken(storedToken)
    if (storedUser) setUser(JSON.parse(storedUser))
    setIsAuthenticated(!!storedToken)
  })
}, [])


  const login = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    setIsAuthenticated(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token)
      localStorage.setItem("auth-user", JSON.stringify(user))
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("auth-user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

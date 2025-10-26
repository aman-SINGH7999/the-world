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

  // Load saved auth data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token")
    const storedUser = localStorage.getItem("auth-user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  // Login (save to localStorage)
  const login = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    setIsAuthenticated(true)
    localStorage.setItem("auth-token", token)
    localStorage.setItem("auth-user", JSON.stringify(user))
  }

  // Logout (clear)
  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem("auth-token")
    localStorage.removeItem("auth-user")
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

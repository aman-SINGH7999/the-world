"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth-token"))
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("auth-user")
    return stored ? JSON.parse(stored) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("auth-token"))

  const login = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    setIsAuthenticated(true)
    localStorage.setItem("auth-token", token)
    localStorage.setItem("auth-user", JSON.stringify(user))
  }

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

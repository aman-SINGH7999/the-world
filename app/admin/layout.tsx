"use client"

import React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/toast"
import { ThemeProvider } from "@/components/common/ThemeProvider"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

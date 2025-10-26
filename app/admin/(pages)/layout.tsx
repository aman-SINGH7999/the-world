"use client"

import type React from "react"

import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/toast"
import { AdminLayout } from "@/components/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminLayout>{children}</AdminLayout>
      </ToastProvider>
    </AuthProvider>
  )
}

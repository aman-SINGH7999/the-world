"use client"

import type React from "react"
import ProtectedClient from "@/components/ProtectedClient"


import { ToastProvider } from "@/components/toast"
import { AdminLayout } from "@/components/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ToastProvider>
        <ProtectedClient>
          <AdminLayout>
            {children}
          </AdminLayout>
        </ProtectedClient>
      </ToastProvider>
  )
}

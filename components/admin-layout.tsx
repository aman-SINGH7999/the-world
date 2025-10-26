"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, LogOut, FileText, ImageIcon, Users, LayoutDashboard, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/common/ThemeProvider"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? `translate-x-0 ${theme === "dark" ? "bg-slate-800" : "bg-white"}` : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary">WorldDoc</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink href="/admin/topics" icon={<FileText size={20} />} label="Topics" />
            <NavLink href="/admin/media" icon={<ImageIcon size={20} />} label="Media Library" />
            {user?.role === "superadmin" && <NavLink href="/admin/users" icon={<Users size={20} />} label="Users" />}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-primary capitalize mt-1">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border px-4 py-4 flex items-center justify-between lg:justify-end">
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="text-sm text-muted-foreground flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className=" rounded-full  shadow-sm"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}

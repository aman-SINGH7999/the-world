"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { X } from "lucide-react"

export interface ToastMessage {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface ToastContextType {
  toasts: ToastMessage[]
  addToast: (message: string, type: "success" | "error" | "info", duration?: number) => void
  removeToast: (id: string) => void
}

import { createContext, useContext } from "react"

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
    const id = Date.now().toString()
    const toast: ToastMessage = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-right-4 ${
            toast.type === "success" ? "bg-success" : toast.type === "error" ? "bg-error" : "bg-secondary"
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="hover:opacity-80 transition-opacity"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

"use client"

import { AlertCircle } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-600 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${isDangerous ? "bg-red-100" : "bg-blue-100"}`}>
            <AlertCircle size={24} className={isDangerous ? "text-error" : "text-primary"} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-secondary text-blue-600">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={isDangerous ? "btn-danger text-red-700" : "btn-primary text-green-800"}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

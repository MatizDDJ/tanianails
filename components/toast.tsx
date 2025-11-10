"use client"

import { useEffect } from "react"
import { X, CheckCircle2, AlertCircle } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
      <div
        className={`bg-[#111111] border rounded-xl p-4 min-w-[300px] shadow-2xl ${
          type === "success" ? "border-green-500 glow-green" : "border-red-500 glow-red"
        }`}
      >
        <div className="flex items-start gap-3">
          {type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-white text-sm flex-1">{message}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

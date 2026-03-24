import * as React from 'react'
import { useCallback } from 'react'

const ACTION_TYPES = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DISMISS: 'DISMISS',
  DISMISS_ALL: 'DISMISS_ALL',
} as const

type ToastActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES]

interface ToastState {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  action?: React.ReactNode
  open: boolean
}

interface ToastAction {
  type: ToastActionType
  toast?: ToastState
  id?: string
}

const toastDefaults = {
  duration: 5000,
  closeButton: true,
  cancel: true,
  position: 'bottom-right',
}

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastState[]>([])

  const toast = useCallback(({ title, description, variant = 'default', action, duration }: {
    title?: string
    description?: string
    variant?: 'default' | 'destructive' | 'success'
    action?: React.ReactNode
    duration?: number
  } = {}) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastState = {
      id,
      title,
      description,
      variant,
      action,
      open: true,
    }
    setToasts((prev) => [...prev, newToast])

    if (duration) {
      setTimeout(() => dismiss(id), duration)
    }
  }, [])

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => 
      prev.map((t) => 
        t.id === id ? { ...t, open: false } : t
      )
    )
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
}

export { useToast }


import * as React from "react"
import { useId } from "react"

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
  action?: JSX.Element
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
  const id = useId()
  const [toasts, dispatch] = React.useReducer((state: ToastState[], action: ToastAction) => {
    switch (action.type) {
      case 'ADD':
        return [...state, { ...action.toast, id: id, open: true }]
      case 'UPDATE':
        return state.map(t => t.id === action.id ? { ...t, ...action.toast } : t)
      case 'DISMISS':
        return state.map(t => t.id === action.id ? { ...t, open: false } : t)
      case 'DISMISS_ALL':
        return state.map(t => ({ ...t, open: false }))
      default:
        return state
    }
  }, [])

  const toast = React.useCallback(({ title, description, variant = "default", action, ...props }: {
    title?: string
    description?: string
    variant?: 'default' | 'destructive' | 'success'
    action?: JSX.Element
    duration?: number
  } = {}) => {
    const toastId = useId()
    dispatch({
      type: ACTION_TYPES.ADD,
      toast: {
        title,
        description,
        variant,
        action,
        open: true,
        id: toastId,
        ...props,
      },
    })
  }, [dispatch])

  const dismiss = React.useCallback((toastId?: string) => {
    if (toastId) {
      dispatch({
        type: ACTION_TYPES.DISMISS,
        id: toastId,
      })
    } else {
      dispatch({ type: ACTION_TYPES.DISMISS_ALL })
    }
  }, [dispatch])

  return {
    toasts,
    toast,
    dismiss,
  }
}

export { useToast }

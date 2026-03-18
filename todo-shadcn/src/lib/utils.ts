import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeError(e: unknown): Error {
  const err = typeof e === "string" ? new Error(e) : e;
  return err as Error;
}

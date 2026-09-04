import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryName(category: Category | null | undefined): string {
  return category?.name ?? "Uncategorized"
}

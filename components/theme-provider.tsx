"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Remove the extra div wrapper that could be causing the multiple renderers issue
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


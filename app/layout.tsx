import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "WoW From Memory",
  description: "Test your knowledge of World of Warcraft bosses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            {/* Floating Theme Toggle */}
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

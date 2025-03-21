"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  // Use this to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            WoW Memory
          </Link>
        </div>
        <div className="flex items-center gap-4">{mounted && <ModeToggle />}</div>
      </div>
    </header>
  )
}


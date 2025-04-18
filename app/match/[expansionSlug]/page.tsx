"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameController } from "@/components/minigame/game-controller"

export default function BossInstanceMinigame() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary font-bold text-xl">Loading...</div>
      </div>
    )
  }

  // Get all expansions with bosses
  const availableExpansions = getAllExpansions().filter(
    (expansion) =>
      expansion.bosses && expansion.bosses.length > 0 && expansion.instances && expansion.instances.length > 0,
  )

  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto min-h-screen flex flex-col">
      <div className="flex items-center mb-8">
        <Link href="/minigame">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Minigames
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center mb-8">
        {/* WoW Logo */}
        <div className="w-24 h-24 mb-4 relative">
          <Image src="/wow-logo.png" alt="World of Warcraft Logo" fill className="object-contain" priority />
        </div>

        {/* Title */}
        <h1 className="text-center mb-2">Boss Instance Matcher</h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground text-lg max-w-2xl">Match each boss to their correct instance</p>
      </div>

      {/* Game Controller */}
      <GameController expansions={availableExpansions} />
    </div>
  )
}

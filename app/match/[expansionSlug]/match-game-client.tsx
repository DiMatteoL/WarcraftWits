"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameController } from "@/components/matchgame/game-controller"
import { Database } from "@/types/database"

type Expansion = Database["public"]["Tables"]["expansion"]["Row"] & {
  instances: Database["public"]["Tables"]["instance"]["Row"][]
  bosses: Database["public"]["Tables"]["npc"]["Row"][]
}

interface MatchGameClientProps {
  expansion: Expansion
}

export function MatchGameClient({ expansion }: MatchGameClientProps) {
  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto min-h-svh flex flex-col">
      <div className="flex items-center mb-8">
        <Link href="/match">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All Expansions
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center mb-8">
        {/* WoW Logo */}
        <div className="w-24 h-24 mb-4 relative">
           <Image src="/android-chrome-192x192.png" alt="WarcraftWits Logo" fill className="object-contain" priority />
        </div>

        {/* Title */}
        <h1 className="text-center mb-2">Instance Matcher</h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground text-lg max-w-2xl">Match each boss to their correct instance</p>
      </div>

      {/* Game Controller */}
      <GameController expansion={expansion} />
    </div>
  )
}

"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expansion } from "@/types/game"

interface ExpansionSelectorProps {
  expansions: Expansion[]
  onSelect: (expansion: Expansion) => void
}

export function ExpansionSelector({ expansions, onSelect }: ExpansionSelectorProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center mb-2">Select an Expansion</h2>
        <p className="text-center text-muted-foreground">Choose an expansion to begin the Boss Instance Matcher game</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {expansions.map((expansion) => (
          <Card
            key={expansion.id}
            className="overflow-hidden cursor-pointer border border-border/40 shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/50"
            onClick={() => onSelect(expansion)}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium text-center">{expansion.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative w-full aspect-square rounded-md overflow-hidden border border-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-secondary/30 to-transparent z-10 opacity-60" />
                <Image
                  src={expansion.image || "/placeholder.svg"}
                  alt={expansion.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground text-center">
                {expansion.bosses.length} bosses • {expansion.instances.length} instances
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <GameInstructions />
      </div>
    </div>
  )
}

// Game instructions component (also exported for reuse)
export function GameInstructions() {
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
      <h3 className="font-medium mb-2 text-primary">How to Play:</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
        <li>You'll be shown a random boss from the selected expansion</li>
        <li>Select the instance (dungeon or raid) where this boss can be found</li>
        <li>Each correct answer earns you 1 point</li>
        <li>One wrong answer ends the game</li>
        <li>Try to beat your high score!</li>
      </ol>
    </div>
  )
}

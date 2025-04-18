"use client"

import { Trophy } from "lucide-react"

interface ScoreDisplayProps {
  score: number
  highScore: number
}

export function ScoreDisplay({ score, highScore }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-muted/70 rounded-md px-3 py-1.5 text-sm">
        <span className="text-muted-foreground mr-1">Score:</span>
        <span className="font-bold">{score}</span>
      </div>

      <div className="bg-primary/10 rounded-md px-3 py-1.5 text-sm flex items-center">
        <Trophy className="h-3.5 w-3.5 text-primary mr-1.5" />
        <span className="text-muted-foreground mr-1">Best:</span>
        <span className="font-bold">{highScore}</span>
      </div>
    </div>
  )
}

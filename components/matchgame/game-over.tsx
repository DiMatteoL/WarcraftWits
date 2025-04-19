"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, RefreshCw, List } from "lucide-react"
import Link from "next/link"

interface GameOverProps {
  score: number
  highScore: number
  onRestart: () => void
  correctInstanceName: string
  bossName: string
}

export function GameOver({ score, highScore, onRestart, correctInstanceName, bossName }: GameOverProps) {
  const isNewHighScore = score > 0 && score >= highScore

  return (
    <Card className="w-full max-w-md border border-destructive/30">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Game Over!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">Your final score:</p>
          <div className="text-5xl font-bold text-primary mb-2">{score}</div>

          {isNewHighScore ? (
            <div className="flex items-center justify-center gap-2 text-primary mt-4">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">New High Score!</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground mt-4">Your best score: {highScore}</div>
          )}
        </div>

      <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground mb-4">
        <p>Don&apos;t worry! You can try again.</p>
        <p className="mt-2"><span className="font-bold">{bossName}</span> is in <span className="font-bold">{correctInstanceName}</span></p>
      </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button onClick={onRestart} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Play Again
        </Button>
        <Link href="/match" className="w-full">
          <Button variant="outline" className="w-full">
            <List className="h-4 w-4 mr-2" />
            Change Expansion
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

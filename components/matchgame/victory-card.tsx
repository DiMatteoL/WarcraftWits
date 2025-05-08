"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, List } from "lucide-react"
import Link from "next/link"

interface VictoryCardProps {
  score: number
  onRestart: () => void
}

export function VictoryCard({ score, onRestart }: VictoryCardProps) {
  return (
    <Card className="w-full max-w-md border border-green-500/30">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl text-green-600">Victory!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">Your final score:</p>
          <div className="text-5xl font-bold text-primary mb-2">{score}</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground mb-4">
          <p>Congratulations! You&apos;ve completed all bosses!</p>
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

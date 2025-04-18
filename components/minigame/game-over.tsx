import { Button } from "@/components/ui/button"

interface GameOverProps {
  score: number
  highScore: number
  onRestart: () => void
}

export function GameOver({ score, highScore, onRestart }: GameOverProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
      <div className="mb-6">
        <p className="text-lg">Final Score: {score}</p>
        <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
      </div>
      <Button onClick={onRestart}>Play Again</Button>
    </div>
  )
}

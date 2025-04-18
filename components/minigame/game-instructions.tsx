"use client"

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

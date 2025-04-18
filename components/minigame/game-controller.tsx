"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { ExpansionSelector } from "@/components/minigame/expansion-selector"
import { BossDisplay } from "@/components/minigame/boss-display"
import { InstanceSelector } from "@/components/minigame/instance-selector"
import { ScoreDisplay } from "@/components/minigame/score-display"
import { GameOver } from "@/components/minigame/game-over"
import { GameInstructions } from "@/components/minigame/game-instructions"
import type { Expansion, Boss, Instance } from "@/types/game"

// Game states
type GameState = "select-expansion" | "playing" | "game-over"

interface GameControllerProps {
  expansions: Expansion[]
}

export function GameController({ expansions }: GameControllerProps) {
  // Game state
  const [gameState, setGameState] = useState<GameState>("select-expansion")
  const [selectedExpansion, setSelectedExpansion] = useState<Expansion | null>(null)
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("wow-instance-matcher-high-score")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore, 10))
    }
  }, [])

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem("wow-instance-matcher-high-score", highScore.toString())
    }
  }, [highScore])

  // Select a random boss from the expansion
  const selectRandomBoss = (expansion: Expansion) => {
    if (!expansion.bosses || expansion.bosses.length === 0) return null

    const availableBosses = expansion.bosses
    const randomIndex = Math.floor(Math.random() * availableBosses.length)
    return availableBosses[randomIndex]
  }

  // Start the game with the selected expansion
  const startGame = (expansion: Expansion) => {
    setSelectedExpansion(expansion)
    const boss = selectRandomBoss(expansion)
    setCurrentBoss(boss)
    setScore(0)
    setGameState("playing")
    setShowInstructions(false)
  }

  // Handle instance selection
  const handleInstanceSelect = (instance: Instance) => {
    if (!currentBoss) return

    // Check if the selected instance is correct
    const isCorrect = currentBoss.instance === instance.name

    if (isCorrect) {
      // Increment score
      const newScore = score + 1
      setScore(newScore)

      // Update high score if needed
      if (newScore > highScore) {
        setHighScore(newScore)
      }

      // Select a new boss
      if (selectedExpansion) {
        const newBoss = selectRandomBoss(selectedExpansion)
        setCurrentBoss(newBoss)
      }
    } else {
      // Game over
      setGameState("game-over")
    }
  }

  // Restart the game
  const restartGame = () => {
    if (selectedExpansion) {
      startGame(selectedExpansion)
    } else {
      setGameState("select-expansion")
    }
  }

  // Change expansion
  const changeExpansion = () => {
    setSelectedExpansion(null)
    setGameState("select-expansion")
  }

  // Toggle instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions)
  }

  return (
    <div className="flex-1 flex flex-col items-center">
      {gameState === "select-expansion" && <ExpansionSelector expansions={expansions} onSelect={startGame} />}

      {gameState === "playing" && selectedExpansion && currentBoss && (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary">{selectedExpansion.name}</h2>
            <ScoreDisplay score={score} highScore={highScore} />
          </div>

          <BossDisplay boss={currentBoss} />

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-center">Select the correct instance:</h3>
            <InstanceSelector instances={selectedExpansion.instances} onSelect={handleInstanceSelect} />
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="sm" onClick={toggleInstructions} className="text-muted-foreground">
              {showInstructions ? "Hide Instructions" : "Show Instructions"}
            </Button>
          </div>

          {showInstructions && (
            <div className="mt-4">
              <GameInstructions />
            </div>
          )}
        </div>
      )}

      {gameState === "game-over" && (
        <GameOver score={score} highScore={highScore} onRestart={restartGame} onChangeExpansion={changeExpansion} />
      )}
    </div>
  )
}

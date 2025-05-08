"use client"

import { useState, useEffect, useMemo } from "react"
import { Tables } from "@/types/database"
import { BossDisplay } from "./boss-display"
import { InstanceSelector } from "@/components/matchgame/instance-selector"
import { ScoreDisplay } from "./score-display"
import { GameOver } from "./game-over"
import { VictoryCard } from "./victory-card"
import { useMinigameScore } from "@/hooks/use-matchgame-score"

interface GameControllerProps {
  expansion: Tables<"expansion"> & {
    instances: Tables<"instance">[]
    bosses: Tables<"npc">[]
  }
}

export function GameController({ expansion }: GameControllerProps) {
  const [gameState, setGameState] = useState<"playing" | "gameOver" | "victory">("playing")
  const [score, setScore] = useState(0)
  const { highScore, updateHighScore } = useMinigameScore(expansion.slug)
  const [currentBoss, setCurrentBoss] = useState<Tables<"npc"> | null>(null)
  const [displayedInstances, setDisplayedInstances] = useState<Tables<"instance">[]>([])
  const [remainingBosses, setRemainingBosses] = useState<Tables<"npc">[]>([])

  const bosses = useMemo(() => {
    return expansion.bosses
  }, [expansion.bosses])

  const selectRandomBoss = () => {
    if (!remainingBosses.length) {
      setGameState("victory")
      return
    }
    const randomIndex = Math.floor(Math.random() * remainingBosses.length)
    const selectedBoss = remainingBosses[randomIndex]
    setCurrentBoss(selectedBoss)
    setRemainingBosses(remainingBosses.filter(boss => boss.id !== selectedBoss.id))
    if (score > highScore) {
      updateHighScore(score)
    }
  }

  // Initialize remaining bosses when expansion changes
  useEffect(() => {
    if (bosses?.length) {
      setRemainingBosses([...bosses])
    }
  }, [bosses])

  // Generate 6 instances (5 random + 1 matching the current boss)
  useEffect(() => {
    if (!currentBoss || !expansion.instances.length) return

    // Find the instance that matches the current boss
    const matchingInstance = expansion.instances.find(
      (instance) => instance.id === currentBoss.instance_id
    )

    if (!matchingInstance) return

    // Get all instances except the matching one
    const otherInstances = expansion.instances.filter(
      (instance) => instance.id !== currentBoss.instance_id
    )

    // Shuffle the other instances
    const shuffledInstances = [...otherInstances].sort(() => Math.random() - 0.5)

    // Take 5 random instances
    const randomInstances = shuffledInstances.slice(0, 7)

    // Combine the 5 random instances with the matching instance
    const combinedInstances = [...randomInstances, matchingInstance]

    // Shuffle the combined instances to make the matching instance appear in a random position
    const finalInstances = combinedInstances.sort(() => Math.random() - 0.5)

    setDisplayedInstances(finalInstances)
  }, [currentBoss, expansion.instances])

  const handleInstanceSelect = (instance: Tables<"instance"> | null) => {
    if (instance && currentBoss && instance.id === currentBoss.instance_id) {
      setScore(score + 1)
      selectRandomBoss()
    } else {
      setGameState("gameOver")
      if (score > highScore) {
        updateHighScore(score)
      }
    }
  }

  const restartGame = () => {
    setGameState("playing")
    setScore(0)
    setRemainingBosses([...bosses])
    setCurrentBoss(null)
  }

  // Initial boss selection
  useEffect(() => {
    if (!currentBoss && remainingBosses.length > 0) {
      selectRandomBoss()
    }
  }, [currentBoss, remainingBosses])

  if (!currentBoss) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <ScoreDisplay
          score={score}
          highScore={highScore}
          total={bosses.length}
        />
      </div>

      {gameState === "playing" ? (
        <div className="flex flex-col items-center gap-4">
          <BossDisplay boss={currentBoss} />
          <InstanceSelector
            instances={displayedInstances}
            onInstanceChange={handleInstanceSelect}
            correctInstanceId={currentBoss.instance_id}
          />
        </div>
      ) : gameState === "victory" ? (
        <VictoryCard
          score={score}
          onRestart={restartGame}
        />
      ) : (
        <GameOver
          score={score}
          highScore={highScore}
          onRestart={restartGame}
          correctInstanceName={displayedInstances.find(instance => instance.id === currentBoss.instance_id)?.name || ""}
          bossName={currentBoss.name || ""}
        />
      )}
    </div>
  )
}

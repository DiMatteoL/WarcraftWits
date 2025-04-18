"use client"

import { useState, useEffect } from "react"
import { Tables } from "@/types/database"
import { BossDisplay } from "./boss-display"
import { InstanceSelector } from "@/components/minigame/instance-selector"
import { ScoreDisplay } from "./score-display"
import { GameOver } from "./game-over"

interface GameControllerProps {
  expansion: Tables<"expansion"> & {
    instances: Tables<"instance">[]
    bosses: Tables<"npc">[]
  }
}

export function GameController({ expansion }: GameControllerProps) {
  const [gameState, setGameState] = useState<"playing" | "gameOver">("playing")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [currentBoss, setCurrentBoss] = useState<Tables<"npc"> | null>(null)
  const [selectedInstance, setSelectedInstance] = useState<Tables<"instance"> | null>(null)
  const [displayedInstances, setDisplayedInstances] = useState<Tables<"instance">[]>([])

  const selectRandomBoss = () => {
    if (!expansion.bosses?.length) return
    const randomIndex = Math.floor(Math.random() * expansion.bosses.length)
    setCurrentBoss(expansion.bosses[randomIndex])
  }

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
    const randomInstances = shuffledInstances.slice(0, 5)

    // Combine the 5 random instances with the matching instance
    const combinedInstances = [...randomInstances, matchingInstance]

    // Shuffle the combined instances to make the matching instance appear in a random position
    const finalInstances = combinedInstances.sort(() => Math.random() - 0.5)

    setDisplayedInstances(finalInstances)
  }, [currentBoss, expansion.instances])

  const handleInstanceSelect = (instance: Tables<"instance"> | null) => {
    setSelectedInstance(instance)
    if (instance && currentBoss && instance.id === currentBoss.instance_id) {
      setScore(score + 1)
      selectRandomBoss()
    } else {
      setGameState("gameOver")
      if (score > highScore) {
        setHighScore(score)
      }
    }
  }

  const restartGame = () => {
    setGameState("playing")
    setScore(0)
    setSelectedInstance(null)
    selectRandomBoss()
  }


  if (!currentBoss) {
    selectRandomBoss()
    return null
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <ScoreDisplay score={score} highScore={highScore} />
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
      ) : (
        <GameOver score={score} highScore={highScore} onRestart={restartGame} />
      )}
    </div>
  )
}

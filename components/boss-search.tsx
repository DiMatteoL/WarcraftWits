"use client"

import { useState, useEffect, useRef } from "react"
import { AutoSelectInput } from "@/components/auto-select-input"
import type { Boss } from "@/types/game"
import { useReward } from "react-rewards"
import { wowEmojis } from "@/lib/wow-emojis"

interface BossSearchProps {
  bosses: Boss[]
  foundBosses: Boss[]
  onBossFound: (boss: Boss) => void
  instanceFilter?: number
}

export function BossSearch({ bosses, foundBosses, onBossFound, instanceFilter }: BossSearchProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<Boss[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { reward: rewardDesktop } = useReward('rewardDesktop', 'emoji', {
    emoji: wowEmojis,
    elementCount: Math.floor(Math.random() * 6) + 5, // Random number between 5 and 10
    startVelocity: 20,
  })
  const { reward: rewardMobile } = useReward('rewardMobile', 'emoji', {
    emoji: wowEmojis,
    elementCount: Math.floor(Math.random() * 6) + 5, // Random number between 5 and 10
    startVelocity: 20,
  })

  // Filter bosses based on input and instance
  useEffect(() => {
    if (inputValue.length >= 3) {
      const searchTerm = inputValue.toLowerCase()
      const filteredBosses = bosses
        .filter(
          (boss) =>
            boss.name?.toLowerCase().includes(searchTerm) &&
            !foundBosses.some((found) => found.id === boss.id) &&
            (!instanceFilter || boss.instance_id === instanceFilter),
        )
        // Sort results to prioritize bosses that start with the search term
        .sort((a, b) => {
          const aName = a.name?.toLowerCase() || ""
          const bName = b.name?.toLowerCase() || ""
          const aStartsWith = aName.startsWith(searchTerm) ? 0 : 1
          const bStartsWith = bName.startsWith(searchTerm) ? 0 : 1
          return aStartsWith - bStartsWith
        })
        .slice(0, 5)

      setSuggestions(filteredBosses)
    } else {
      setSuggestions([])
    }
  }, [inputValue, bosses, foundBosses, instanceFilter])

  // Handle suggestion click
  const handleSuggestionClick = (boss: Boss) => {
    // Trigger the reward animation with a random WoW emoji
    rewardMobile()
    rewardDesktop()
    // Add the boss to found bosses
    onBossFound(boss)
    setInputValue("")
    setSuggestions([])
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative mb-1">
        <div className="relative">
          <AutoSelectInput
            type="text"
            placeholder="Boss Name"
            className="wow-border"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            priority={10} // High priority to ensure this input is focused
          />
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border/50 rounded-md shadow-md transition-all duration-300">
            {suggestions.map((boss) => (
              <div
                key={boss.id}
                className="px-4 py-2 cursor-pointer hover:bg-muted"
                onClick={() => handleSuggestionClick(boss)}
              >
                {boss.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

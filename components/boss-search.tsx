"use client"

import { useState, useRef } from "react"
import { AutoSelectInput } from "@/components/auto-select-input"
import type { Boss } from "@/types/game"
import createFuzzySearch from '@nozbe/microfuzz'


interface BossSearchProps {
  bosses: Boss[]
  foundBosses: Boss[]
  onBossFound: (boss: Boss) => void
  instanceFilter?: number
}

export function BossSearch({ bosses, foundBosses, onBossFound, instanceFilter }: BossSearchProps) {
  const [inputValue, setInputValue] = useState("")
  const [isError, setIsError] = useState(false)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const contextualBosses = bosses.filter(boss =>
      boss.name
      && foundBosses.every((found) => found.id !== boss.id)
      && (!instanceFilter
      || boss.instance_id === instanceFilter))
    const fuzzySearch = createFuzzySearch(contextualBosses, { key: "name" });
    const results = fuzzySearch(inputValue);
    const bestResult = results?.[0];
    const matchedBoss = bestResult?.item;
    const nameLength = matchedBoss?.name?.length || 0;
    let score = bestResult?.score || Infinity

    // Adjust score based on input length vs boss name length
    if (inputValue.length < 4 && nameLength > 4) {
      // Add penalty to score (1 point per character difference)
      const lengthDifference = nameLength - inputValue.length;
      score += lengthDifference;
    }


    if (score < 3.5) {
      console.log(bestResult, score)
      const matchedBoss = results[0].item;
      // Boss found, add it
      onBossFound(matchedBoss)
      setInputValue("")
      setIsError(false)
    } else {
      if (inputContainerRef.current) {
        inputContainerRef.current.classList.add("animate-shake")
        setTimeout(() => {
          if (inputContainerRef.current) {
            inputContainerRef.current.classList.remove("animate-shake")
          }
        }, 500)
      }

      // Reset error state after animation
      setTimeout(() => {
        setIsError(false)
      }, 500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div ref={inputContainerRef} className={`relative mb-1 ${isError ? "animate-shake" : ""}`}>
        <div className="relative">
          <AutoSelectInput
            type="text"
            placeholder="Boss Name"
            className={`wow-border ${isError ? "border-destructive" : ""}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            priority={10}
            autoFocus={true}
            selectAllOnFocus={true}
          />
        </div>
      </div>
    </form>
  )
}

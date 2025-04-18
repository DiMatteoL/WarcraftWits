"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { AutoSelectInput } from "@/components/auto-select-input"
import type { Boss } from "@/types/game"
import createFuzzySearch from '@nozbe/microfuzz'

// List of common words that should be penalized in the search
const COMMON_WORDS = [
  "the", "of", "lord", "commander", "lady", "high", "king", "general",
  "prince", "watcher", "baron", "grand", "and", "barov", "devourer",
  "gatewatcher", "instructor", "master", "prophet", "shade", "warlord"
];

interface BossSearchProps {
  bosses: Boss[]
  foundBosses: Boss[]
  onBossFound: (boss: Boss) => void
  instanceFilter?: number
  name?: string
}

export function BossSearch({ bosses, foundBosses, onBossFound, instanceFilter, name }: BossSearchProps) {
  const [inputValue, setInputValue] = useState("")
  const [isError, setIsError] = useState(false)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Memoize the filtered bosses list
  const contextualBosses = useMemo(() =>
    bosses.filter(boss =>
      boss.name
      && foundBosses.every((found) => found.id !== boss.id)
      && (!instanceFilter || boss.instance_id === instanceFilter)),
    [bosses, foundBosses, instanceFilter]
  );

  // Memoize the fuzzy search instance
  const fuzzySearch = useMemo(() =>
    createFuzzySearch(contextualBosses, { key: "name" }),
    [contextualBosses]
  );

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const cleanInputValue = inputValue.replace(/[^\w\s]/gi, '').toLowerCase()
    const results = fuzzySearch(cleanInputValue);
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

    // Penalize if the input is just a common word
    if (COMMON_WORDS.includes(cleanInputValue.trim())) {
      score += 5; // Significant penalty for common words
    }

    // Penalize if the boss name contains the input as a standalone word
    if (matchedBoss?.name) {
      const bossWords = matchedBoss.name.toLowerCase().split(/\s+/);
      if (bossWords.includes(cleanInputValue) && COMMON_WORDS.includes(cleanInputValue)) {
        score += 3; // Additional penalty if the input is a common word that appears as a standalone word in the boss name
      }
    }

    if (score < 3.5) {
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
  }, [inputValue, fuzzySearch, onBossFound]);

  // Debounced input handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div ref={inputContainerRef} className={`relative mb-1 ${isError ? "animate-shake" : ""}`}>
        <div className="relative">
          <AutoSelectInput
            type="text"
            placeholder={`${name || ''} Boss Name`}
            className={`wow-border ${isError ? "border-destructive" : ""}`}
            value={inputValue}
            onChange={handleInputChange}
            priority={10}
            autoFocus={true}
            selectAllOnFocus={true}
          />
        </div>
      </div>
    </form>
  )
}

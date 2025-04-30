"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { AutoSelectInput } from "@/components/auto-select-input"
import type { Boss } from "@/types/game"
import levenshtein from 'fast-levenshtein'
import { Trash2 } from "lucide-react"

// List of common words that should be removed from the search
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
  onReset?: () => void
}

export function BossSearch({ bosses, foundBosses, onBossFound, instanceFilter, name, onReset }: BossSearchProps) {
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

  // Helper function to remove common words from a string
  const clean = (str: string): string => {
    const words = str.toLowerCase().split(/\s+/);
    const filteredWords = words.filter(word => !COMMON_WORDS.includes(word));
    return filteredWords.join(' ').replace(/[^\w\s]/gi, '').toLowerCase().trim();;
  };

  // Helper function to get allowed distance based on string length
  const getAllowedDistance = (length: number): number => {
    if (length <= 5) return 0;
    if (length <= 9) return 1;
    if (length <= 14) return 2;
    return 3;
  };

  const isMatch = (search: string, name: string): boolean => {
    const totalDistance = levenshtein.get(search, name)

    const allowedDistance = getAllowedDistance(name.length)

    return totalDistance <= allowedDistance;
  }

  const isBossMatch = (input: string, boss: Boss): boolean => {
    if (!boss.name) return false;

    const bossName = boss.name.toLowerCase();
    const search = input.toLowerCase()
    if (isMatch(search, bossName)) return true;

    const cleanBossName = clean(bossName);
    const cleanSearch = clean(search)
    if (isMatch(cleanSearch, cleanBossName)) return true;

    const splittedNames = cleanBossName.split(" ")
    for (const name of splittedNames) {
      if (isMatch(search, name)) return true;
    }

    return false;
  };

  // Find the best match for an input string among a list of bosses
  const findMatch = (input: string, bossList: Boss[]): Boss | null => {
    if (!input.trim()) return null;

    for (const boss of bossList) {
      if (isBossMatch(input, boss)) {
        return boss;
      }
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const match = findMatch(inputValue, contextualBosses);

    if (match) {
      // Boss found, add it
      onBossFound(match)
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
  }, [inputValue, contextualBosses, onBossFound]);

  // Debounced input handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div ref={inputContainerRef} className={`relative mb-1 ${isError ? "animate-shake" : ""}`}>
        <div className="relative flex items-center">
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
          {onReset && !!foundBosses?.length && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute right-2 p-1"
              title="Reset found bosses"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

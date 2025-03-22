"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { expansionData } from "@/lib/data"
import { MapSelector } from "@/components/map-selector"
import { InstanceIcon } from "@/components/instance-icon"
import { BossSearch } from "@/components/boss-search"
import { BossList } from "@/components/boss-list"
import { ProgressIndicator } from "@/components/progress-indicator"
import { MapTitleDisplay } from "@/components/map-title-display"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import type { Map, InstanceWithCompletion } from "@/types/game"

// Update the right side panel styling to be more understated
const rightSidePanelStyles =
  "w-full md:w-1/4 h-1/2 md:h-screen bg-card overflow-y-auto border-l border-border/50 shadow-md"

export default function ExpansionPage({ params }: { params: Promise<{ id: string }> }) {
  const id = use(params).id
  const expansion = expansionData[id as keyof typeof expansionData]
  if (!expansion) {
    notFound()
  }

  // State
  const [selectedMap, setSelectedMap] = useState<Map>(expansion.maps[0])
  const { foundBosses, addFoundBoss, clearFoundBosses, isLoaded } = useFoundBosses(id)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Calculate boss counts
  const foundBossCount = foundBosses.length
  const totalBossCount = expansion.bosses.length
  const completionPercentage = totalBossCount > 0 ? Math.round((foundBossCount / totalBossCount) * 100) : 0

  // Calculate completion rates for each instance
  const instanceCompletionRates: InstanceWithCompletion[] = expansion.instances.map((instance) => {
    const instanceBosses = expansion.bosses.filter((boss) => boss.instance === instance.name)
    const foundInstanceBosses = foundBosses.filter((boss) => boss.instance === instance.name)
    const completionRate =
      instanceBosses.length > 0 ? Math.round((foundInstanceBosses.length / instanceBosses.length) * 100) : 0

    return {
      ...instance,
      calculatedCompletionRate: completionRate,
    }
  })

  // Clear hovered instance when component mounts or unmounts
  useEffect(() => {
    clearHoveredInstance()
    return () => {
      clearHoveredInstance()
    }
  }, [clearHoveredInstance])

  // Clear hovered instance when map changes
  useEffect(() => {
    clearHoveredInstance()
  }, [selectedMap, clearHoveredInstance])

  // Handle reset of found bosses for this expansion
  const handleResetExpansion = () => {
    if (window.confirm(`Are you sure you want to reset all found bosses for ${expansion.name}?`)) {
      clearFoundBosses()
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary font-bold text-xl">Loading...</div>
      </div>
    )
  }

  // Determine if we should use compact mode based on instance count
  const useCompactMode = instanceCompletionRates.length > 8

  // Calculate the maximum gap based on the number of instances and icon size
  const getMaxGap = () => {
    const instanceCount = instanceCompletionRates.length
    if (instanceCount > 12) return 8 // Smallest gap for many instances
    if (instanceCount > 8) return 12 // Medium gap
    return 16 // Largest gap for fewer instances
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" onMouseLeave={() => clearHoveredInstance()}>
      {/* Left side - Map display (75% width) */}
      <div className="w-full md:w-3/4 h-1/2 md:h-screen bg-muted flex flex-col">
        {/* Map selector */}
        <div className="p-4 bg-card border-b border-border">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {expansion.maps.map((map) => (
              <MapSelector
                key={map.id}
                map={map}
                isSelected={selectedMap.id === map.id}
                onClick={() => {
                  setSelectedMap(map)
                  clearHoveredInstance()
                }}
              />
            ))}
          </div>
        </div>

        {/* Main map display */}
        <div className="relative flex-grow overflow-hidden">
          <Image
            src={selectedMap.image || "/placeholder.svg"}
            alt={selectedMap.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <MapTitleDisplay mapName={selectedMap.name} />
          </div>
        </div>
      </div>

      {/* Right side - Boss tracking (25% width) with visual separator */}
      <div className={rightSidePanelStyles}>
        <div className="p-4">
          {/* Mobile Layout - Reordered */}
          <div className="md:hidden">
            {/* 1. Navigation button */}
            <div className="mb-4">
              <Link href="/" onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Other expansions
                </Button>
              </Link>
            </div>

            {/* 2. Boss name input with suggestions */}
            <BossSearch bosses={expansion.bosses} foundBosses={foundBosses} onBossFound={addFoundBoss} />

            {/* 3. Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* 4. Boss percentage */}
            <ProgressIndicator percentage={completionPercentage} label="Bosses named" name={expansion.name} />

            {/* 5. Instance icons */}
            <div className="mb-6 -mx-1 mt-4">
              <div
                className="flex flex-wrap justify-start"
                style={{
                  gap: `${getMaxGap()}px`,
                  maxWidth: "100%",
                }}
              >
                {instanceCompletionRates.map((instance) => (
                  <InstanceIcon
                    key={instance.id}
                    instance={instance}
                    expansionId={id}
                    foundBosses={foundBosses}
                    allBosses={expansion.bosses}
                    size={useCompactMode ? "compact" : "normal"}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-left mb-4">
              {`${foundBossCount}/${totalBossCount} bosses found`}
            </div>
          </div>

          {/* Desktop Layout - Unchanged */}
          <div className="hidden md:block">
            {/* Navigation button to return to expansion picker */}
            <div className="mb-4">
              <Link href="/" onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Other expansions
                </Button>
              </Link>
            </div>

            {/* Boss percentage */}
            <ProgressIndicator percentage={completionPercentage} label="Bosses named" name={expansion.name} />

            {/* Instance icons */}
            <div className="mb-6 -mx-1">
              <div
                className="flex flex-wrap justify-start"
                style={{
                  gap: `${getMaxGap()}px`,
                  maxWidth: "100%",
                }}
              >
                {instanceCompletionRates.map((instance) => (
                  <InstanceIcon
                    key={instance.id}
                    instance={instance}
                    expansionId={id}
                    foundBosses={foundBosses}
                    allBosses={expansion.bosses}
                    size={useCompactMode ? "compact" : "normal"}
                  />
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* Boss name input with suggestions */}
            <BossSearch bosses={expansion.bosses} foundBosses={foundBosses} onBossFound={addFoundBoss} />

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-right mb-4">
              {`${foundBossCount}/${totalBossCount} bosses found`}
            </div>

            {/* Boss list */}
            <BossList bosses={foundBosses} />
          </div>
        </div>
      </div>
      {/* Fixed Reset Button in bottom-right corner */}
      {foundBossCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetExpansion}
            className="fixed-action-button rounded-full bg-card shadow-md border border-border hover:bg-destructive/10 hover:text-destructive transition-colors duration-300 flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Progress</span>
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { expansionData } from "@/lib/data"
import { MapSelector } from "@/components/map-selector"
import { BossSearch } from "@/components/boss-search"
import { BossList } from "@/components/boss-list"
import { ProgressIndicator } from "@/components/progress-indicator"
import { MapTitleDisplay } from "@/components/map-title-display"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import type { InstanceMap, InstanceWithCompletion } from "@/types/game"

// Update the right side panel styling to be more understated
const rightSidePanelStyles =
  "w-full md:w-1/4 h-1/2 md:h-screen bg-card overflow-y-auto border-l border-border/50 shadow-md"

export default function InstancePage({ params }: { params: Promise<{ id: string; instanceId: string }> }) {
  const { id, instanceId } = use(params);
  // Get expansion data
  const expansion = expansionData[id as keyof typeof expansionData]
  if (!expansion) {
    notFound()
  }

  // Get instance data
  const instance = expansion.instances.find((i) => i.id === instanceId)
  if (!instance) {
    notFound()
  }

  // State
  const [selectedInstanceMapIndex, setSelectedInstanceMapIndex] = useState(0)
  const { foundBosses, addFoundBoss, isLoaded } = useFoundBosses(id)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Calculate instance-specific counts
  const instanceBosses = expansion.bosses.filter((b) => b.instance === instance.name)
  const foundInstanceBosses = foundBosses.filter((b) => b.instance === instance.name)
  const foundCount = foundInstanceBosses.length
  const totalCount = instanceBosses.length
  const completionPercentage = totalCount > 0 ? Math.round((foundCount / totalCount) * 100) : 0

  // Create an instance with completion rate for the progress indicator
  const instanceWithCompletion: InstanceWithCompletion = {
    ...instance,
    calculatedCompletionRate: completionPercentage,
  }

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
  }, [selectedInstanceMapIndex, clearHoveredInstance])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary font-bold text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" onMouseLeave={() => clearHoveredInstance()}>
      {/* Left side - Map display (75% width) */}
      <div className="w-full md:w-3/4 h-1/2 md:h-screen bg-muted flex flex-col">
        {/* Instance map selector */}
        {instance.maps.length > 1 && (
          <div className="p-4 bg-card border-b border-border">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {instance.maps.map((map: InstanceMap, index: number) => (
                <MapSelector
                  key={map.id}
                  map={map}
                  isSelected={selectedInstanceMapIndex === index}
                  onClick={() => {
                    setSelectedInstanceMapIndex(index)
                    clearHoveredInstance()
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main map display */}
        <div className="relative flex-grow overflow-hidden">
          <Image
            src={instance.maps[selectedInstanceMapIndex]?.image || "/placeholder.svg"}
            alt={instance.maps[selectedInstanceMapIndex]?.name || instance.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <MapTitleDisplay mapName={instance.maps[selectedInstanceMapIndex]?.name || instance.name} />
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
              <Link href={`/expansion/${id}`} onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  All instances
                </Button>
              </Link>
            </div>

            {/* 2. Boss name input with suggestions */}
            <BossSearch
              bosses={expansion.bosses}
              foundBosses={foundBosses}
              onBossFound={addFoundBoss}
              instanceFilter={instance.name}
            />

            {/* 3. Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* 4. Boss percentage */}
            <ProgressIndicator percentage={completionPercentage} label="Bosses named" name={instance.name} />


            {/* Boss list - filtered by instance */}
            <BossList bosses={foundBosses} instanceFilter={instance.name} />

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-right mb-4 mt-4">
              {`${foundCount}/${totalCount} bosses found`}
            </div>
          </div>

          {/* Desktop Layout - Unchanged */}
          <div className="hidden md:block">
            {/* Navigation button */}
            <div className="mb-4">
              <Link href={`/expansion/${id}`} onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  All instances
                </Button>
              </Link>
            </div>

            {/* Boss percentage */}
            <ProgressIndicator percentage={completionPercentage} label="Bosses named" name={instance.name} />

            {/* Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* Boss name input with suggestions */}
            <BossSearch
              bosses={expansion.bosses}
              foundBosses={foundBosses}
              onBossFound={addFoundBoss}
              instanceFilter={instance.name}
            />

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-right mb-4">
              {`${foundCount}/${totalCount} bosses found`}
            </div>

            {/* Boss list - filtered by instance */}
            <BossList bosses={foundBosses} instanceFilter={instance.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

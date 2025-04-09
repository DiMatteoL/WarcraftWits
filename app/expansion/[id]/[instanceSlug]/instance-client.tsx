"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MapSelector } from "@/components/map-selector"
import { BossSearch } from "@/components/boss-search"
import { BossList } from "@/components/boss-list"
import { ProgressIndicator } from "@/components/progress-indicator"
import { MapTitleDisplay } from "@/components/map-title-display"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import { Tables } from "@/types/database"

// Update the right side panel styling to be more understated
const rightSidePanelStyles =
  "w-full md:w-1/4 h-1/2 md:h-screen bg-card overflow-y-auto border-l border-border/50 shadow-md"

type InstanceData = Tables<"instance"> & {
  npc: Tables<"npc">[];
  map: Tables<"map">[];
  expansion: Tables<"expansion">;
}

type InstanceClientProps = {
  expansionId: string;
  instance: InstanceData;
}

export function InstanceClient({ expansionId, instance }: InstanceClientProps) {
  const [selectedInstanceMapIndex, setSelectedInstanceMapIndex] = useState(0)
  const { foundBosses, addFoundBoss } = useFoundBosses(expansionId)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Clear hovered instance when component mounts/unmounts
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

  // Calculate statistics
  const foundInstanceBosses = foundBosses.filter((b) => b.instance_id === instance.id)
  const foundCount = foundInstanceBosses.length
  const totalCount = instance.npc.length
  const completionPercentage = totalCount > 0 ? Math.round((foundCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" onMouseLeave={() => clearHoveredInstance()}>
      {/* Left side - Map display (75% width) */}
      <div className="w-full md:w-3/4 h-1/2 md:h-screen bg-muted flex flex-col">
        {/* Instance map selector */}
        {instance.map.length > 1 && (
          <div className="p-4 bg-card border-b border-border">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {instance.map.map((map, index) => (
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
            src={instance.map[selectedInstanceMapIndex]?.uri || "/placeholder.svg"}
            alt={instance.name || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <MapTitleDisplay mapName={instance.name || ""} />
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
              <Link href={`/expansion/${expansionId}`} onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  All instances
                </Button>
              </Link>
            </div>

            {/* 2. Boss name input with suggestions */}
            <BossSearch
              bosses={instance.npc}
              foundBosses={foundBosses}
              onBossFound={addFoundBoss}
              instanceFilter={instance.id}
            />

            {/* 3. Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* 4. Boss percentage */}
            <ProgressIndicator
              percentage={completionPercentage}
              label="Bosses named"
              name={instance.name || ""}
              expansionName={instance.expansion?.name || ""}
            />


            {/* Boss list - filtered by instance */}
            <span id="rewardMobile" />
            <BossList bosses={foundBosses} instanceFilter={instance.id} instances={[instance]} />

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-right mb-4 mt-4">
              {`${foundCount}/${totalCount} bosses found`}
            </div>
          </div>

          {/* Desktop Layout - Unchanged */}
          <div className="hidden md:block">
            {/* Navigation button */}
            <div className="mb-4">
              <Link href={`/expansion/${expansionId}`} onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  All instances
                </Button>
              </Link>
            </div>

            <ProgressIndicator
              percentage={completionPercentage}
              label="Bosses named"
              name={instance.name || ""}
              expansionName={instance.expansion?.name || ""}
            />

            {/* Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* Boss name input with suggestions */}
            <BossSearch
              bosses={instance.npc}
              foundBosses={foundBosses}
              onBossFound={addFoundBoss}
              instanceFilter={instance.id}
            />

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-right mb-4">
              {`${foundCount}/${totalCount} bosses found`}
            </div>

            {/* Boss list - filtered by instance */}
            <span id="rewardDesktop" />
            <BossList allBosses={instance.npc} bosses={foundBosses} instanceFilter={instance.id} instances={[instance]} />
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapSelector } from "@/components/map-selector"
import { MapTitleDisplay } from "@/components/map-title-display"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import { Tables } from "@/types/database"
import { InstanceWithCompletion } from "@/types/game"
import { GameInterface } from "@/components/game-interface"
import { ImageCarousel } from "@/components/image-carousel/image-carousel"
import { ImageWithOverlay } from "@/components/image-with-overlay"

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

  // Calculate completion rate for the instance
  const foundInstanceBosses = foundBosses.filter((b) => b.instance_id === instance.id)
  const foundCount = foundInstanceBosses.length
  const totalCount = instance.npc.length
  const completionPercentage = totalCount > 0 ? Math.round((foundCount / totalCount) * 100) : 0

  // Create an instance with completion rate for the SidePanel
  const instanceWithCompletion: InstanceWithCompletion = {
    ...instance,
    calculatedCompletionRate: completionPercentage
  }

  // Prepare slides and thumbnails for ImageCarousel
  const slides = instance.map.map((map) => (
    <ImageWithOverlay
      key={map.id}
      src={map.uri || "/placeholder.svg"}
      alt={map.name || `Map ${map.id}`}
      pins={[]}
    />
  ))

  const thumbnails = instance.map.map((map) => ({
    src: map.uri || "/placeholder.svg",
    alt: map.name || `Map ${map.id}`,
    name: map.name || `Map ${map.id}`
  }))

  // Prepare the left content for the GameInterface
  const leftContent = (
    <div className="relative flex-grow overflow-hidden">
      <ImageCarousel
        slides={slides}
        thumbnails={thumbnails}
        className="h-full"
      />
      <div className="absolute bottom-4 left-4 z-10">
        <MapTitleDisplay mapName={instance.name || ""} />
      </div>
    </div>
  )

  return (
    <GameInterface
      leftContent={leftContent}
      expansion={instance.expansion}
      instances={[instanceWithCompletion]}
      bosses={instance.npc}
      foundBosses={foundBosses}
      onBossFound={addFoundBoss}
      clearHoveredInstance={clearHoveredInstance}
      instanceName={instance.name || undefined}
      instanceFilter={instance.id.toString()}
      backLink={`/expansion/${expansionId}`}
      backText="All instances"
    />
  )
}

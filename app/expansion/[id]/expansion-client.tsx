"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstanceIcon } from "@/components/instance-icon"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import type { InstanceWithCompletion } from "@/types/game"
import type { Tables } from "@/types/database"
import { ImageWithOverlay, Pin } from "@/components/image-with-overlay"
import { ImageCarousel } from "@/components/image-carousel/image-carousel"
import { GameInterface } from "@/components/game-interface"

type ExtendedMap = Tables<"map"> & {
  pin: (Tables<"pin"> & {
    instance: Tables<"instance"> | null
  })[]
}

type ExpansionClientProps = {
  id: string
  expansion: Tables<"expansion">
  instances: Tables<"instance">[]
  maps: ExtendedMap[]
  bosses: Tables<"npc">[]
}

export function ExpansionClient({ id, expansion, instances, maps, bosses }: ExpansionClientProps) {
  const [selectedMap, setSelectedMap] = useState<ExtendedMap | null>(null)
  const { foundBosses, addFoundBoss, clearFoundBosses } = useFoundBosses(id)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Set first map as selected when component mounts
  useEffect(() => {
    if (maps.length > 0 && !selectedMap) {
      setSelectedMap(maps[0])
    }
  }, [maps, selectedMap])

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
    if (expansion?.name && window.confirm(`Are you sure you want to reset all found bosses for ${expansion.name}?`)) {
      clearFoundBosses()
    }
  }

  // Calculate boss counts
  const totalBossCount = bosses.length
  const foundBossCount = foundBosses.length
  const completionPercentage = totalBossCount > 0 ? Math.round((foundBossCount / totalBossCount) * 100) : 0

  // Calculate completion rates for each instance
  const instanceCompletionRates: InstanceWithCompletion[] = instances.map((instance) => {
    const instanceBosses = bosses.filter((boss) => boss.instance_id === instance.id)
    const foundInstanceBosses = foundBosses.filter((boss) => {
      const matchingBoss = bosses.find(b => b.name === boss.name && b.instance_id === instance.id)
      return !!matchingBoss
    })

    const completionRate =
      instanceBosses.length > 0 ? Math.round((foundInstanceBosses.length / instanceBosses.length) * 100) : 0

    return { ...instance, calculatedCompletionRate: completionRate }
  })

  // Prepare slides and thumbnails for ImageCarousel
  const slides = maps.map((map) => (
    <ImageWithOverlay
      key={map.id}
      src={map.uri || "/placeholder.svg"}
      alt={`Map ${map.id || ''}`}
      pins={map.pin?.map((pin) => {
        const instance = pin.instance || null;
        if (!instance) return null;

        const instanceWithCompletion = instanceCompletionRates.find(i => i.id === instance.id);

        return {
          component: <InstanceIcon
            instance={instanceWithCompletion || {...instance, calculatedCompletionRate: 0}}
            foundBosses={foundBosses}
            allBosses={bosses}
            size="compact"
          />,
          position: { x: pin.x_percent || 0, y: pin.y_percent || 0 }
        };
      }).filter(Boolean) as Pin[] || []}
    />
  ))

  const thumbnails = maps.map((map) => ({
    src: map.uri || "/placeholder.svg",
    alt: `Map ${map.id || ''}`,
    name: map.name || `Map ${map.id}`
  }))

  // Prepare the left content for the GameInterface
  const leftContent = (
    <ImageCarousel
      slides={slides}
      thumbnails={thumbnails}
      className="h-full"
    />
  )

  // Prepare the footer content for the GameInterface
  const footerContent = foundBosses.length > 0 ? (
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
  ) : null

  return (
    <GameInterface
      leftContent={leftContent}
      expansion={expansion}
      instances={instanceCompletionRates}
      bosses={bosses}
      foundBosses={foundBosses}
      onBossFound={addFoundBoss}
      clearHoveredInstance={clearHoveredInstance}
      footerContent={footerContent}
    />
  )
}

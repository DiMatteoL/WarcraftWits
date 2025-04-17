"use client"

import { ReactNode } from "react"
import { useMedia } from "react-use"
import { SidePanel } from "@/components/side-panel"
import { Tables } from "@/types/database"
import { InstanceWithCompletion } from "@/types/game"
import { ImageCarousel } from "@/components/image-carousel/image-carousel"
import { ImageWithOverlay, Pin } from "@/components/image-with-overlay"
import { InstanceIcon } from "@/components/instance-icon"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type GameInterfaceProps = {
  // Right side panel props
  expansion: Tables<"expansion">
  instances: InstanceWithCompletion[]
  bosses: Tables<"npc">[]
  foundBosses: Tables<"npc">[]
  onBossFound: (boss: Tables<"npc">) => void
  clearHoveredInstance: () => void
  clearFoundBosses?: () => void

  // Optional props
  instanceName?: string
  instanceFilter?: string
  backLink?: string
  backText?: string

  // Optional right side content (for custom content)
  rightContent?: ReactNode

  // Map data for the carousel
  maps: (Tables<"map"> & {
    pin: (Tables<"pin"> & {
      instance: Tables<"instance"> | null
    })[]
  })[]
}

export function GameInterface({
  expansion,
  instances,
  bosses,
  foundBosses,
  onBossFound,
  clearHoveredInstance,
  clearFoundBosses,
  instanceName,
  instanceFilter,
  backLink,
  backText,
  rightContent,
  maps
}: GameInterfaceProps) {
  const isDesktop = useMedia('(min-width: 768px)', false)

  // Convert instanceFilter from string to number if it exists
  const numericInstanceFilter = instanceFilter ? parseInt(instanceFilter, 10) : undefined

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

  const thumbnails = maps.filter((map) => map.uri).map((map) => ({
    src: map.uri || "/placeholder.svg",
    alt: `Map ${map.id || ''}`,
    name: map.name || `Map ${map.id}`
  }))
  console.log(thumbnails)

  // Prepare the footer content
  const footerContent = foundBosses.length > 0 && clearFoundBosses ? (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        variant="outline"
        size="sm"
        onClick={clearFoundBosses}
        className="fixed-action-button rounded-full bg-card shadow-md border border-border hover:bg-destructive/10 hover:text-destructive transition-colors duration-300 flex items-center gap-1.5"
      >
        <Trash2 className="h-4 w-4" />
        <span>Reset Progress</span>
      </Button>
    </div>
  ) : null

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" onMouseLeave={() => clearHoveredInstance()}>
      <div className="w-screen md:w-3/4 md:h-screen bg-muted flex flex-col aspect-[3/2] md:aspect-auto">
        <ImageCarousel
          slides={slides}
          thumbnails={thumbnails}
          className="h-full"
        />
      </div>

      {rightContent || (
        <SidePanel
          expansion={expansion}
          instances={instances}
          bosses={bosses}
          foundBosses={foundBosses}
          onBossFound={onBossFound}
          clearHoveredInstance={clearHoveredInstance}
          isDesktop={isDesktop}
          instanceName={instanceName}
          instanceFilter={numericInstanceFilter}
          backLink={backLink}
          backText={backText}
        />
      )}

      {/* Footer content (like reset button) */}
      {footerContent}
    </div>
  )
}

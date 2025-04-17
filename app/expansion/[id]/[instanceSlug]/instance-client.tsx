"use client"

import { useEffect } from "react"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import { Tables } from "@/types/database"
import { InstanceWithCompletion } from "@/types/game"
import { GameInterface } from "@/components/game-interface"

type InstanceData = Tables<"instance"> & {
  npc: Tables<"npc">[];
  map: (Tables<"map"> & {
    pin: (Tables<"pin"> & {
      instance: Tables<"instance"> | null
    })[]
  })[];
  expansion: Tables<"expansion">;
}

type InstanceClientProps = {
  expansionId: string;
  instance: InstanceData;
}

export function InstanceClient({ expansionId, instance }: InstanceClientProps) {
  const { foundBosses, addFoundBoss } = useFoundBosses(expansionId)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Clear hovered instance when component mounts/unmounts
  useEffect(() => {
    clearHoveredInstance()
    return () => {
      clearHoveredInstance()
    }
  }, [clearHoveredInstance])

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

  return (
    <GameInterface
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
      maps={instance.map}
    />
  )
}

"use client"

import { useState, useEffect } from "react"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import type { InstanceWithCompletion } from "@/types/game"
import type { Tables } from "@/types/database"
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
  const { foundBosses, addFoundBoss, clearFoundBosses } = useFoundBosses(id)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Clear hovered instance when component mounts or unmounts
  useEffect(() => {
    clearHoveredInstance()
    return () => {
      clearHoveredInstance()
    }
  }, [clearHoveredInstance])

  // Handle reset of found bosses for this expansion
  const handleResetExpansion = () => {
    if (expansion?.name && window.confirm(`Are you sure you want to reset all found bosses for ${expansion.name}?`)) {
      clearFoundBosses()
    }
  }

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

  return (
    <GameInterface
      expansion={expansion}
      instances={instanceCompletionRates}
      bosses={bosses}
      foundBosses={foundBosses}
      onBossFound={addFoundBoss}
      clearHoveredInstance={clearHoveredInstance}
      clearFoundBosses={handleResetExpansion}
      maps={maps}
    />
  )
}

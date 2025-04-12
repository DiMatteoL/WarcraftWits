"use client"

import Image from "next/image"
import type { Boss } from "@/types/game"
import { DEFAULT_IMAGE } from "@/lib/constants"
import { Tables } from "@/types/database"
import { memo, useMemo } from "react"

interface BossListProps {
  bosses: Boss[]
  instanceFilter?: number
  allBosses?: Tables<"npc">[]
  instances?: Tables<"instance">[]
}

export const BossList = memo(function BossList({ bosses, instanceFilter, allBosses = [], instances = [] }: BossListProps) {
  // Filter bosses by instance if needed
  const filteredBosses = useMemo(() =>
    instanceFilter ? bosses.filter((boss) => boss.instance_id === instanceFilter) : bosses,
    [bosses, instanceFilter]
  );

  const sortedBosses = useMemo(() => [...filteredBosses].reverse(), [filteredBosses]);

  const getBossImage = useMemo(() => (boss: Boss) => {
    const matchingBoss = allBosses.find(b => b.name === boss.name);
    return matchingBoss?.background_uri || matchingBoss?.logo_uri || DEFAULT_IMAGE;
  }, [allBosses]);

  if (sortedBosses.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        <span id="reward" />
        {instanceFilter ? "No bosses found for this instance yet." : "No bosses found yet."}
      </div>
    )
  }

  // Get image for boss by looking up in allBosses if available

  return (
    <div className="space-y-2 h-[calc(100vh-460px)] max-h-full overflow-y-auto pr-2">
      <span id="reward" />
      {sortedBosses.map((boss, index) => (
        <div key={`${boss.name}-${boss.instance_id}-${index}`} className="flex items-center gap-3 pr-2 hover:bg-muted rounded-md transition-colors">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50 transition-all duration-300">
            <Image
              src={getBossImage(boss)}
              alt={boss.name || ""}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm">{boss.name}</h3>
            <p className="text-xs text-muted-foreground">{instances.find(instance => instance.id === boss.instance_id)?.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
})

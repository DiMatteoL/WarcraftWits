"use client"

import Image from "next/image"
import type { Boss } from "@/types/game"
import { DEFAULT_IMAGE } from "@/lib/constants"
import { Tables } from "@/types/database"

interface BossListProps {
  bosses: Boss[]
  instanceFilter?: string
  allBosses?: Tables<"npc">[]
}

export function BossList({ bosses, instanceFilter, allBosses = [] }: BossListProps) {
  const filteredBosses = instanceFilter ? bosses.filter((boss) => boss.instance === instanceFilter) : bosses

  if (filteredBosses.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        {instanceFilter ? "No bosses found for this instance yet." : "No bosses found yet."}
      </div>
    )
  }

  // Get image for boss by looking up in allBosses if available
  const getBossImage = (boss: Boss) => {
    // Try to find the image in allBosses
    const matchingBoss = allBosses.find(b => b.name === boss.name);
    return matchingBoss?.background_uri || DEFAULT_IMAGE;
  };

  return (
    <div className="space-y-3">
      {filteredBosses.map((boss, index) => (
        <div key={`${boss.name}-${boss.instance}-${index}`} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50 transition-all duration-300">
            <Image
              src={getBossImage(boss)}
              alt={boss.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm">{boss.name}</h3>
            <p className="text-xs text-muted-foreground">{boss.instance}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

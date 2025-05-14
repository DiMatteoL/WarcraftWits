"use client"

import Image from "next/image"
import type { Boss } from "@/types/game"
import { DEFAULT_IMAGE } from "@/lib/constants"
import { Tables } from "@/types/database"
import { memo, useMemo } from "react"
import { AdsenseAd } from "@/components/Adsense-ad"

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

  return (
    <div className="gap-2 min-h-[350px] h-full overflow-y-auto flex flex-col w-full overflow-x-hidden">
      <span id="reward" />
      {!sortedBosses?.length ? <p className="px-4">No bosses found yet.</p> :
      sortedBosses.map((boss, index) => (
        <div key={`${boss.name}-${boss.instance_id}-${index}`} className="flex items-center gap-3 pr-2 hover:bg-muted rounded-md transition-colors px-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50 transition-all duration-300">
            <Image
              src={getBossImage(boss)}
              alt={boss.name || ""}
              width={48}
              height={48}
              className="object-cover w-full h-full object-top"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm">{boss.name}</h3>
            <p className="text-xs text-muted-foreground">{instances.find(instance => instance.id === boss.instance_id)?.name}</p>
          </div>
        </div>
      ))}
      <div className="hidden md:block">
        <AdsenseAd />
      </div>
    </div>
  )
})

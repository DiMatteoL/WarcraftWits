"use client"

import Image from "next/image"
import type { Boss } from "@/types/game"
import { DEFAULT_IMAGE } from "@/lib/constants"

interface BossListProps {
  bosses: Boss[]
  instanceFilter?: string
}

export function BossList({ bosses, instanceFilter }: BossListProps) {
  const filteredBosses = instanceFilter ? bosses.filter((boss) => boss.instance === instanceFilter) : bosses

  if (filteredBosses.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        {instanceFilter ? "No bosses found for this instance yet." : "No bosses found yet."}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredBosses.map((boss) => (
        <div key={boss.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50 transition-all duration-300">
            <Image
              src={`${DEFAULT_IMAGE}?height=100&width=100`}
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


"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DEFAULT_IMAGE } from "@/lib/constants"
import type { Boss } from "@/types/game"

interface BossDisplayProps {
  boss: Boss
}

export function BossDisplay({ boss }: BossDisplayProps) {
  return (
    <Card className="overflow-hidden border border-primary/30 shadow-md w-full sm:w-auto sticky top-4 z-10">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 border-2 border-primary/50 transition-all duration-300 relative">
            <Image
              src={boss.logo_uri || DEFAULT_IMAGE}
              alt={boss.name || ""}
              width={96}
              height={96}
              className="object-cover w-full h-full object-top"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-primary mb-2">{boss.name}</h3>
            <p className="text-muted-foreground">Which instance is this boss from?</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

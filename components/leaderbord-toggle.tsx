"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import { PrefilledLeaderboardModal } from "@/components/leaderboard-modal"

export function LeaderboardToggle() {
  const [leaderboardOpen, setLeaderboardOpen] = React.useState(false)

  return (
    <>
    <Button variant="ghost" className="flex items-center justify-between w-full" onClick={() => setLeaderboardOpen(true)}>
      <Trophy className="h-[1.2rem] w-[1.2rem]" />
      <span>Leaderboard</span>
    </Button>
    <PrefilledLeaderboardModal
        open={leaderboardOpen}
        onOpenChange={setLeaderboardOpen}
      />
    </>
  )
}

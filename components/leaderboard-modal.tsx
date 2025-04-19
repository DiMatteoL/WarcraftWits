"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tables } from "@/types/database"
import { useSupabase } from "@/contexts/supabase-context"
import { UserProfileDisplay } from "@/components/user-profile-display"
import { Trophy, Medal } from "lucide-react"
import { BOSS_MEMORY_GAME_TYPE, INSTANCE_MATCHER_GAME_TYPE, USER_ID_STORAGE_KEY } from "@/lib/constants"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface LeaderboardWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expansionSlug?: string
  gameType?: string
}

export function PrefilledLeaderboardModal({
  open,
  onOpenChange,
}: LeaderboardWrapperProps) {
  const pathname = usePathname()
  const expansionMatch = useMemo(() => pathname.match(/\/(match|expansion)\/([^\/]+)(?:\/|$)/), [pathname]);

  return (
    <LeaderboardModal
      open={open}
      onOpenChange={onOpenChange}
      initialExpansion={expansionMatch && expansionMatch[2] ? expansionMatch[2] : "classic"}
      initialGameType={pathname.includes("match") ? INSTANCE_MATCHER_GAME_TYPE : BOSS_MEMORY_GAME_TYPE}
    />
  )
}

interface LeaderboardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialExpansion: string
  initialGameType: string
}

export function LeaderboardModal({
  open,
  onOpenChange,
  initialExpansion,
  initialGameType
}: LeaderboardModalProps) {
  const [selectedGame, setSelectedGame] = React.useState<string>(initialGameType)
  const [selectedExpansion, setSelectedExpansion] = React.useState<string>(initialExpansion)
  const [expansions, setExpansions] = React.useState<Tables<"expansion">[]>([])
  const [scores, setScores] = React.useState<Tables<"score">[]>([])
  const [loading, setLoading] = React.useState(true)
  const [scoresLoading, setScoresLoading] = React.useState(false)
  const [currentUserId, setCurrentUserId] = React.useState<string>("")
  const [userRank, setUserRank] = React.useState<number | null>(null)
  const [userPercentile, setUserPercentile] = React.useState<number | null>(null)
  const supabase = useSupabase()

  // Update selected game and expansion when initial values change
  React.useEffect(() => {
    setSelectedGame(initialGameType)
    setSelectedExpansion(initialExpansion)
  }, [initialGameType, initialExpansion])

  // Load current user ID from localStorage
  React.useEffect(() => {
    const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY)
    if (storedUserId) {
      setCurrentUserId(storedUserId)
    }
  }, [])

  React.useEffect(() => {
    async function fetchExpansions() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("expansion")
          .select("*")
          .eq("is_active", true)
          .order("release_date", { ascending: true })

        if (error) {
          console.error("Error fetching expansions:", error)
          return
        }

        setExpansions(data || [])

        // If we have data and the initial expansion doesn't exist in the list,
        // set the first expansion as default
        if (data && data.length > 0) {
          const expansionExists = data.some(exp => exp.slug === initialExpansion)
          if (!expansionExists) {
            setSelectedExpansion(data[0].slug || "")
          }
        }
      } catch (err) {
        console.error("Error fetching expansions:", err)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchExpansions()
    }
  }, [open, supabase, initialExpansion])

  // Reset user rank when game or expansion changes
  React.useEffect(() => {
    setUserRank(null)
  }, [selectedGame, selectedExpansion])

  React.useEffect(() => {
    async function fetchScores() {
      if (!selectedGame || !selectedExpansion) {
        setScores([])
        return
      }

      try {
        setScoresLoading(true)
        const { data, error } = await supabase
          .from("score")
          .select("*")
          .eq("game_name", selectedGame)
          .eq("expansion_slug", selectedExpansion)
          .order("personal_best", { ascending: false })
          .limit(20)

        if (error) {
          console.error("Error fetching scores:", error)
          return
        }

        setScores(data || [])

        // Get total count of players for percentile calculation
        const { count: totalPlayers, error: countError } = await supabase
          .from("score")
          .select("*", { count: "exact", head: true })
          .eq("game_name", selectedGame)
          .eq("expansion_slug", selectedExpansion)

        if (countError) {
          console.error("Error getting total player count:", countError)
          return
        }

        // Find user's rank in the leaderboard
        if (currentUserId && data) {
          const userIndex = data.findIndex(score => score.identifier === currentUserId)
          if (userIndex !== -1) {
            // User is in the top 20
            setUserRank(userIndex + 1)
            // Calculate percentile (lower is better)
            if (totalPlayers) {
              const percentile = ((userIndex + 1) / totalPlayers) * 100
              setUserPercentile(percentile)
            }
          } else {
            // User is not in the top 20, fetch their rank
            const { data: userScore, error: userError } = await supabase
              .from("score")
              .select("personal_best")
              .eq("identifier", currentUserId)
              .eq("game_name", selectedGame)
              .eq("expansion_slug", selectedExpansion)
              .single()

            if (!userError && userScore) {
              // Count how many scores are better than the user's score
              const { count, error: rankError } = await supabase
                .from("score")
                .select("*", { count: "exact", head: true })
                .eq("game_name", selectedGame)
                .eq("expansion_slug", selectedExpansion)
                .gt("personal_best", userScore.personal_best)

              if (!rankError && count !== null) {
                const rank = count + 1 // Add 1 because count is 0-based
                setUserRank(rank)
                // Calculate percentile
                if (totalPlayers) {
                  const percentile = (rank / totalPlayers) * 100
                  setUserPercentile(percentile)
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching scores:", err)
      } finally {
        setScoresLoading(false)
      }
    }

    fetchScores()
  }, [selectedGame, selectedExpansion, supabase, currentUserId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100vw] h-[100dvh] sm:w-[75vw] sm:h-[75vh] sm:max-w-none sm:max-h-none p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle>Leaderboard</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {loading ? <></> :
            <div className="flex-1">
              <Label htmlFor="game">Game Type</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger id="game">
                  <SelectValue placeholder="Select a game type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BOSS_MEMORY_GAME_TYPE}>Boss Memory</SelectItem>
                  <SelectItem value={INSTANCE_MATCHER_GAME_TYPE}>Instance Matcher</SelectItem>
                </SelectContent>
              </Select>
            </div>}
            <div className="flex-1">
              <Label htmlFor="expansion">Expansion</Label>
              <Select value={selectedExpansion} onValueChange={setSelectedExpansion}>
                <SelectTrigger id="expansion">
                  <SelectValue placeholder="Select an expansion" />
                </SelectTrigger>
                <SelectContent>
                  {expansions.map((expansion) => (
                    <SelectItem key={`${expansion.id}-${expansion.slug}`} value={expansion.slug || ""}>
                      {expansion.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {userRank && (
            <div className="mb-4 p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-primary" />
                <span className="font-medium">Your Rank:</span>
                <span className="font-bold text-primary">#{userRank}</span>
                {userPercentile !== null && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Top {userPercentile.toFixed(1)}%)
                  </span>
                )}
              </div>
              <UserProfileDisplay userId={currentUserId} />
            </div>
          )}

          <div className="space-y-4">
            {scoresLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading scores...</div>
            ) : scores.length > 0 ? (
              <div className="space-y-4">
                {scores.map((score, index) => (
                  <div
                    key={score.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      score.identifier === currentUserId
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/50 bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <UserProfileDisplay userId={score.identifier || ""} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="font-bold">{score.personal_best}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedGame && selectedExpansion ? (
              <div className="text-center py-8 text-muted-foreground">No scores found for this combination.</div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Select a game type and expansion to view scores.</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

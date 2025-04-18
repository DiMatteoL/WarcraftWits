"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameController } from "@/components/matchgame/game-controller"
import { useParams } from "next/navigation"
import { Database } from "@/types/database"
import { supabase } from "@/lib/supabase"

type Expansion = Database["public"]["Tables"]["expansion"]["Row"] & {
  instances: Database["public"]["Tables"]["instance"]["Row"][]
  bosses: Database["public"]["Tables"]["npc"]["Row"][]
}

export default function BossInstanceMinigame() {
  const [mounted, setMounted] = useState(false)
  const [expansion, setExpansion] = useState<Expansion | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const expansionSlug = params.expansionSlug as string

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch expansion data
  useEffect(() => {
    const fetchExpansion = async () => {
      if (!mounted) return

      setLoading(true)

      try {
        // Fetch the expansion by slug
        const { data: expansionData, error: expansionError } = await supabase
          .from("expansion")
          .select("*")
          .eq("slug", expansionSlug)
          .single()

        if (expansionError) throw expansionError

        if (expansionData) {
          // Fetch instances for this expansion
          const { data: instancesData, error: instancesError } = await supabase
            .from("instance")
            .select("*")
            .eq("expansion_id", expansionData.id)

          if (instancesError) throw instancesError

          // Get instance IDs
          const instanceIds = instancesData?.map((instance) => instance.id) || []

          // Fetch bosses (NPCs) for this expansion
          const { data: bossesData, error: bossesError } = await supabase
            .from("npc")
            .select("*")
            .in("instance_id", instanceIds)

          if (bossesError) throw bossesError

          // Combine the data
          setExpansion({
            ...expansionData,
            instances: instancesData || [],
            bosses: bossesData || []
          })
        }
      } catch (error) {
        console.error("Error fetching expansion data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpansion()
  }, [mounted, expansionSlug])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary font-bold text-xl">Loading...</div>
      </div>
    )
  }

  if (!expansion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-primary font-bold text-xl">Expansion not found</div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto min-h-screen flex flex-col">
      <div className="flex items-center mb-8">
        <Link href="/match">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All Expansions
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center mb-8">
        {/* WoW Logo */}
        <div className="w-24 h-24 mb-4 relative">
           <Image src="/android-chrome-192x192.png" alt="WarcraftWits Logo" fill className="object-contain" priority />
        </div>

        {/* Title */}
        <h1 className="text-center mb-2">Instance Matcher</h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground text-lg max-w-2xl">Match each boss to their correct instance</p>
      </div>

      {/* Game Controller */}
      <GameController expansion={expansion} />
    </div>
  )
}

"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MapSelector } from "@/components/map-selector"
import { InstanceIcon } from "@/components/instance-icon"
import { BossSearch } from "@/components/boss-search"
import { BossList } from "@/components/boss-list"
import { ProgressIndicator } from "@/components/progress-indicator"
import { MapTitleDisplay } from "@/components/map-title-display"
import { useFoundBosses } from "@/hooks/use-found-bosses"
import { useHoveredInstanceStore } from "@/lib/store"
import { useSupabase } from "@/contexts/supabase-context"
import type { Map, InstanceWithCompletion, Boss } from "@/types/game"
import type { Tables } from "@/types/database"

// Update the right side panel styling to be more understated
const rightSidePanelStyles =
  "w-full md:w-1/4 h-1/2 md:h-screen bg-card overflow-y-auto border-l border-border/50 shadow-md"

export default function ExpansionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = useSupabase()

  // State
  const [loading, setLoading] = useState(true)
  const [expansion, setExpansion] = useState<Tables<"expansion"> | null>(null)
  const [instances, setInstances] = useState<Tables<"instance">[]>([])
  const [maps, setMaps] = useState<Tables<"map">[]>([])
  const [bosses, setBosses] = useState<Tables<"npc">[]>([])
  const [selectedMap, setSelectedMap] = useState<Tables<"map"> | null>(null)

  const { foundBosses, addFoundBoss, clearFoundBosses, isLoaded } = useFoundBosses(id)
  const { clearHoveredInstance } = useHoveredInstanceStore()

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchExpansionData() {
      try {
        setLoading(true)

        // 1. Fetch expansion
        const { data: expansionData, error: expansionError } = await supabase
          .from("expansion")
          .select("*")
          .eq("slug", id)
          .single()

        if (expansionError || !expansionData) {
          throw new Error("Expansion not found")
        }

        setExpansion(expansionData)

        // 2. Fetch instances for this expansion
        const { data: instancesData, error: instancesError } = await supabase
          .from("instance")
          .select("*")
          .eq("expansion_id", expansionData.id)
          .order("name")

        if (instancesError) throw instancesError
        setInstances(instancesData || [])

        // 3. Fetch maps for these instances
        const instanceIds = instancesData?.map(i => i.id) || []
        if (instanceIds.length) {
          const { data: mapsData, error: mapsError } = await supabase
            .from("map")
            .select("*")
            .in("instance_id", instanceIds)

          if (mapsError) throw mapsError
          setMaps(mapsData || [])

          // Set first map as selected
          if (mapsData && mapsData.length > 0) {
            setSelectedMap(mapsData[0])
          }
        }

        // 4. Fetch NPCs (bosses) for these instances
        if (instanceIds.length) {
          const { data: bossesData, error: bossesError } = await supabase
            .from("npc")
            .select("*")
            .in("instance_id", instanceIds)

          if (bossesError) throw bossesError
          setBosses(bossesData || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchExpansionData()
  }, [id, supabase])

  // Calculate boss counts
  const totalBossCount = bosses.length
  const foundBossCount = foundBosses.length
  const completionPercentage = totalBossCount > 0 ? Math.round((foundBossCount / totalBossCount) * 100) : 0

  // Calculate completion rates for each instance
  const instanceCompletionRates: InstanceWithCompletion[] = instances.map((instance) => {
    const instanceBosses = bosses.filter((boss) => boss.instance_id === instance.id)
    const foundInstanceBosses = foundBosses.filter((boss) => {
      const matchingBoss = bosses.find(b => b.name === boss.name && b.instance_id === instance.id)
      return !!matchingBoss
    })

    const completionRate =
      instanceBosses.length > 0 ? Math.round((foundInstanceBosses.length / instanceBosses.length) * 100) : 0

    return {
      id: String(instance.id),
      name: instance.name || "Unknown",
      icon: instance.logo_uri || "/placeholder.svg",
      calculatedCompletionRate: completionRate,
      background: instance.backgroud_uri || "/placeholder.svg",
      shortName: instance.slug || "Unknown"
    }
  })

  // Clear hovered instance when component mounts or unmounts
  useEffect(() => {
    clearHoveredInstance()
    return () => {
      clearHoveredInstance()
    }
  }, [clearHoveredInstance])

  // Clear hovered instance when map changes
  useEffect(() => {
    clearHoveredInstance()
  }, [selectedMap, clearHoveredInstance])

  // Handle reset of found bosses for this expansion
  const handleResetExpansion = () => {
    if (expansion?.name && window.confirm(`Are you sure you want to reset all found bosses for ${expansion.name}?`)) {
      clearFoundBosses()
    }
  }

  // Show loading state while fetching data
  if (loading || !isLoaded || !expansion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary font-bold text-xl">Loading...</div>
      </div>
    )
  }

  // Determine if we should use compact mode based on instance count
  const useCompactMode = instanceCompletionRates.length > 8

  // Calculate the maximum gap based on the number of instances and icon size
  const getMaxGap = () => {
    const instanceCount = instanceCompletionRates.length
    if (instanceCount > 12) return 8 // Smallest gap for many instances
    if (instanceCount > 8) return 12 // Medium gap
    return 16 // Largest gap for fewer instances
  }

  // Format bosses for the search component
  const formattedBosses: Boss[] = bosses.map(boss => ({
    name: boss.name || "Unknown",
    instance: instances.find(i => i.id === boss.instance_id)?.name || "Unknown",
    image: boss.logo_uri || "/placeholder.svg"
  }))

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" onMouseLeave={() => clearHoveredInstance()}>
      {/* Left side - Map display (75% width) */}
      <div className="w-full md:w-3/4 h-1/2 md:h-screen bg-muted flex flex-col">
        {/* Map selector */}
        <div className="p-4 bg-card border-b border-border">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {maps.map((map) => (
              <MapSelector
                key={map.id}
                map={{
                  id: String(map.id),
                  name: `Map ${map.id}`,
                  image: map.uri || "/placeholder.svg"
                }}
                isSelected={selectedMap?.id === map.id}
                onClick={() => {
                  setSelectedMap(map)
                  clearHoveredInstance()
                }}
              />
            ))}
          </div>
        </div>

        {/* Main map display */}
        <div className="relative flex-grow overflow-hidden">
          <Image
            src={selectedMap?.uri || "/placeholder.svg"}
            alt={`Map ${selectedMap?.id || ''}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <MapTitleDisplay mapName={
              instances.find(i => i.id === selectedMap?.instance_id)?.name || "Map"
            } />
          </div>
        </div>
      </div>

      {/* Right side - Boss tracking (25% width) with visual separator */}
      <div className={rightSidePanelStyles}>
        <div className="p-4">
          {/* Mobile Layout - Reordered */}
          <div className="md:hidden">
            {/* 1. Navigation button */}
            <div className="mb-4">
              <Link href="/" onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Other expansions
                </Button>
              </Link>
            </div>

            {/* 2. Boss name input with suggestions */}
            <BossSearch bosses={formattedBosses} foundBosses={foundBosses} onBossFound={addFoundBoss} />

            {/* 3. Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* 4. Boss percentage */}
            <ProgressIndicator percentage={completionPercentage} label="Bosses named" name={expansion.name || "Expansion"} />

            {/* 5. Instance icons */}
            <div className="mb-6 -mx-1 mt-4">
              <div
                className="flex flex-wrap justify-start"
                style={{
                  gap: `${getMaxGap()}px`,
                  maxWidth: "100%",
                }}
              >
                {instanceCompletionRates.map((instance) => (
                  <InstanceIcon
                    key={instance.id}
                    instance={instance}
                    expansionId={id}
                    foundBosses={foundBosses}
                    allBosses={formattedBosses}
                    size={useCompactMode ? "compact" : "normal"}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-left mb-4">
              {`${foundBossCount}/${totalBossCount} bosses found`}
            </div>
          </div>

          {/* Desktop Layout - Unchanged */}
          <div className="hidden md:block">
            {/* Navigation button to return to expansion picker */}
            <div className="mb-4">
              <Link href="/" onClick={() => clearHoveredInstance()}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Other expansions
                </Button>
              </Link>
            </div>

            {/* Boss percentage */}
            <ProgressIndicator percentage={completionPercentage} label="Bosses named" name={expansion.name || "Expansion"} />

            {/* Instance icons */}
            <div className="mb-6 -mx-1">
              <div
                className="flex flex-wrap justify-start"
                style={{
                  gap: `${getMaxGap()}px`,
                  maxWidth: "100%",
                }}
              >
                {instanceCompletionRates.map((instance) => (
                  <InstanceIcon
                    key={instance.id}
                    instance={instance}
                    expansionId={id}
                    foundBosses={foundBosses}
                    allBosses={formattedBosses}
                    size={useCompactMode ? "compact" : "normal"}
                  />
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-border my-4"></div>

            {/* Boss name input with suggestions */}
            <BossSearch bosses={formattedBosses} foundBosses={foundBosses} onBossFound={addFoundBoss} />

            {/* Dynamic boss counter */}
            <div className="text-sm text-muted-foreground text-right mb-4">
              {`${foundBossCount}/${totalBossCount} bosses found`}
            </div>

            {/* Boss list */}
            <BossList bosses={foundBosses} allBosses={bosses} />
          </div>
        </div>
      </div>

      {/* Fixed Reset Button in bottom-right corner */}
      {foundBossCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetExpansion}
            className="fixed-action-button rounded-full bg-card shadow-md border border-border hover:bg-destructive/10 hover:text-destructive transition-colors duration-300 flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Progress</span>
          </Button>
        </div>
      )}
    </div>
  )
}

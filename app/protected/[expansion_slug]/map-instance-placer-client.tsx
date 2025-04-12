"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MapSelectorClient } from "./map-selector-client"
import { InstancePickerClient } from "./instance-picker-client"
import { Tables } from "@/types/database"
import { useSupabase } from "@/contexts/supabase-context"

interface BossPickerClientProps {
  maps: (Tables<"map"> & {
    pin: (Tables<"pin"> & {
      instance: Tables<"instance"> | null
    })[]
  })[]
  instances: Tables<"instance">[]
  totalPages: number
  expansionSlug: string
}

export function MapInstancePlacerClient({ maps, instances, expansionSlug }: BossPickerClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null)
  const supabase = useSupabase()
  const [pinnedInstanceIds, setPinnedInstanceIds] = useState<number[]>([])

  // Initialize selected instance from URL
  useEffect(() => {
    const instanceId = searchParams.get('instance_id')
    setSelectedInstanceId(instanceId ? parseInt(instanceId) : null)
  }, [searchParams])

  // Initialize pins from the current map and extract pinned instance IDs
  useEffect(() => {
    if (maps.length > 0) {
      // Extract unique instance IDs from all pins across all maps
      const allPins = maps.flatMap(map => map.pin || [])
      const uniqueInstanceIds = Array.from(new Set(
        allPins
          .filter(pin => pin.instance !== null)
          .map(pin => pin.instance!.id)
      ))

      setPinnedInstanceIds(uniqueInstanceIds)
    }
  }, [maps])

  const addPin = async (mapId: number, position: { x: number; y: number }) => {
    if (!selectedInstanceId) {
      alert("Please select an instance first")
      return
    }

    try {
      // Insert the pin into the database
      const { error } = await supabase
        .from('pin')
        .insert({
          map_id: mapId,
          x_percent: position.x,
          y_percent: position.y,
          instance_id: selectedInstanceId
        })
        .select()

      if (error) {
        console.error("Error inserting pin:", error)
        alert(`Error adding pin: ${error.message}`)
        return
      }

      router.refresh()
    } catch (err) {
      console.error("Error in addPin function:", err)
      alert("An error occurred while adding the pin")
    }
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="w-3/4">
        <MapSelectorClient
          maps={maps}
          addPin={addPin}
        />
      </div>
      <div className="w-1/4">
        <InstancePickerClient
          expansionSlug={expansionSlug}
          instances={instances}
          pinnedInstanceIds={pinnedInstanceIds}
        />
      </div>
    </div>
  )
}

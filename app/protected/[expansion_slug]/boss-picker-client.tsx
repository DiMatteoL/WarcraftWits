"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MapSelectorClient } from "./map-selector-client"
import { InstancePickerClient } from "./instance-picker-client"
import { Tables } from "@/types/database"
import { useSupabase } from "@/contexts/supabase-context"

interface BossPickerClientProps {
  maps: Tables<"map">[]
  instances: Tables<"instance">[]
  currentPage: number
  totalPages: number
  expansionSlug: string
}

export function BossPickerClient({ maps, instances, currentPage, totalPages, expansionSlug }: BossPickerClientProps) {
  const searchParams = useSearchParams()
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null)
  const supabase = useSupabase()
  const [pins, setPins] = useState<Tables<"pin">[]>([])

  // Initialize selected instance from URL
  useEffect(() => {
    const instanceId = searchParams.get('instance_id')
    setSelectedInstanceId(instanceId)
  }, [searchParams])

  // Fetch pins for the first map
  useEffect(() => {
    const fetchPins = async () => {
      if (maps.length > 0) {
        const { data, error } = await supabase
          .from('pin')
          .select('*')
          .eq('map_id', maps[0].id)

        if (error) {
          console.error("Error fetching pins:", error)
          return
        }

        setPins(data || [])
      }
    }

    fetchPins()
  }, [maps, supabase])

  const addPin = async (mapId: number, position: { x: number; y: number }) => {
    if (!selectedInstanceId) {
      alert("Please select an instance first")
      return
    }

    try {
      // Insert the pin into the database
      const { data, error } = await supabase
        .from('pin')
        .insert({
          map_id: mapId,
          instance_id: parseInt(selectedInstanceId),
          x_percent: position.x,
          y_percent: position.y
        })
        .select()

      if (error) {
        console.error("Error inserting pin:", error)
        alert(`Error adding pin: ${error.message}`)
        return
      }

      // Update the pins state with the new pin
      if (data && data.length > 0) {
        setPins(prevPins => [...prevPins, data[0]])
      }
    } catch (err) {
      console.error("Error in addPin function:", err)
      alert("An error occurred while adding the pin")
    }
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="w-1/2">
        <MapSelectorClient
          maps={maps}
          currentPage={currentPage}
          totalPages={totalPages}
          addPin={addPin}
          pins={pins}
        />
      </div>
      <div className="w-1/2">
        <InstancePickerClient expansionSlug={expansionSlug} instances={instances} />
      </div>
    </div>
  )
}

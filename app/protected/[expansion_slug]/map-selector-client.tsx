"use client"

import { Tables } from "@/types/database";
import { ImageWithOverlay } from "../../../components/image-with-overlay"
import { InstanceIcon } from "@/components/instance-icon";
import { useState } from "react";

interface Pin {
  component: React.ReactNode
  position: { x: number; y: number }
}

interface MapSelectorClientProps {
  maps: (Tables<"map"> & {
    pin: (Tables<"pin"> & {
      instance: Tables<"instance"> | null
    })[]
  })[]
  addPin: (mapId: number, position: { x: number; y: number }) => Promise<void>
}

export function MapSelectorClient({
  maps,
  addPin,
}: MapSelectorClientProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const currentMap = maps[currentPage]

  // Convert database pins to the format expected by ImageWithOverlay
  const formattedPins = currentMap.pin.map(pin => {
    // Find the instance associated with this pin
    const instance = pin?.instance || null
    if (!instance) return null

    return {
      component: <InstanceIcon instance={{...instance, calculatedCompletionRate: 0}} />,
      position: { x: pin.x_percent || 0, y: pin.y_percent || 0 }
    }
  }).filter(Boolean) as Pin[]



  return (
    <div className="p-4">
      {currentMap && (
        <div key={currentMap.id} className="mt-2 mx-auto relative w-full h-[1000px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full">
              <ImageWithOverlay
                src={currentMap.uri!}
                alt={`${currentMap.name} background`}
                onClick={(position) => {
                  addPin(currentMap.id, position);
                }}
                pins={formattedPins}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: maps.length }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-4 py-2 rounded ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

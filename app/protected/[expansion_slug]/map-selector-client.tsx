"use client"

import { Tables } from "@/types/database";
import { ImageWithOverlay } from "../../../components/image-with-overlay"

interface Pin {
  component: React.ReactNode
  position: { x: number; y: number }
}

interface MapSelectorClientProps {
  maps: Tables<"map">[]
  currentPage: number
  totalPages: number
  addPin: (mapId: number, position: { x: number; y: number }) => Promise<void>
  pins: Tables<"pin">[]
}

export function MapSelectorClient({
  maps,
  currentPage,
  totalPages,
  addPin,
  pins,
}: MapSelectorClientProps) {
  // Convert database pins to the format expected by ImageWithOverlay
  const formattedPins: Pin[] = pins.map(pin => ({
    component: <div className="w-4 h-4 bg-red-500 rounded-full" />,
    position: { x: pin.x_percent || 0, y: pin.y_percent || 0 }
  }))

  return (
    <div className="p-4">
      {maps?.map((map) => (
        <div key={map.id} className="mt-2 mx-auto">
          <ImageWithOverlay
            src={map.uri!}
            alt={`${map.name} background`}
            width={1000}
            height={1000}
            onClick={(position) => {
              addPin(map.id, position);
            }}
            pins={formattedPins}
          />
        </div>
      ))}

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i}
            href={`?page=${i}`}
            className={`px-4 py-2 rounded ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </div>
  )
}

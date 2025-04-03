"use client"

import { ImageWithOverlay } from "./image-with-overlay"

interface Map {
  id: string
  name: string
  uri: string | null
}

interface MapSelectorClientProps {
  maps: Map[]
  currentPage: number
  totalPages: number
}

export function MapSelectorClient({ maps, currentPage, totalPages }: MapSelectorClientProps) {
  const pins = [
    {
      component: <div className="w-4 h-4 bg-blue-500 rounded-full" />,
      position: { x: 25, y: 25 }
    },
    {
      component: <div className="w-4 h-4 bg-red-500 rounded-full" />,
      position: { x: 50, y: 50 }
    },
    {
      component: <div className="w-4 h-4 bg-green-500 rounded-full" />,
      position: { x: 75, y: 75 }
    }
  ]

  return (
    <div className="mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maps?.map((map) => (
          <div key={map.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{map.name}</h3>
            {map.uri && (
              <div className="mt-2 mx-auto">
                <ImageWithOverlay
                  src={map.uri}
                  alt={`${map.name} background`}
                  width={1000}
                  height={1000}
                  onClick={(position) => {
                    console.log(`Clicked at position: ${position.x}, ${position.y}`);
                  }}
                  pins={pins}
                />
              </div>
            )}
          </div>
        ))}
      </div>

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

"use client"

import { useHoveredInstanceStore } from "@/lib/store"
import { useState, useEffect } from "react"

interface MapTitleDisplayProps {
  mapName: string
}

export function MapTitleDisplay({ mapName }: MapTitleDisplayProps) {
  const { hoveredInstance } = useHoveredInstanceStore()
  const [isVisible, setIsVisible] = useState(false)
  const [displayedInstance, setDisplayedInstance] = useState<string | null>(null)

  // Use useEffect to handle the animation state and instance name
  useEffect(() => {
    if (hoveredInstance) {
      setDisplayedInstance(hoveredInstance.name)
      setIsVisible(true)
    } else {
      // Small delay before hiding to allow for a smooth transition
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Only clear the displayed instance name after the animation completes
        setTimeout(() => {
          if (!hoveredInstance) {
            setDisplayedInstance(null)
          }
        }, 200)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hoveredInstance])

  return (
    <div className="flex flex-col">
      <h2 className="text-primary text-2xl font-bold">{mapName}</h2>

      <div
        className={`flex items-center mt-1 transition-all duration-200 ${
          isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="h-4 w-1 bg-primary/50 rounded-full mr-2"></div>
        <span className="text-primary/90 text-lg font-medium">{displayedInstance || ""}</span>
      </div>
    </div>
  )
}


"use client"

import Image from "next/image"
import { useHoveredInstanceStore } from "@/lib/store"
import type { Map } from "@/types/game"

interface MapSelectorProps {
  map: Map
  isSelected: boolean
  onClick: () => void
}

export function MapSelector({ map, isSelected, onClick }: MapSelectorProps) {
  const { clearHoveredInstance } = useHoveredInstanceStore()

  const handleClick = () => {
    clearHoveredInstance()
    onClick()
  }

  return (
    <div
      onClick={handleClick}
      className={`relative w-24 h-16 rounded-md overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? "border-2 border-primary/70 ring-1 ring-primary/50 shadow-sm"
          : "border border-border/30 opacity-90 hover:opacity-100"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick()
        }
      }}
    >
      <Image src={map.uri || "/placeholder.svg"} alt={map.name || map.uri || ""} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
      {map.name && <span className="absolute bottom-1 left-0 right-0 text-xs font-medium text-center text-primary">{map.name}</span>}
    </div>
  )
}

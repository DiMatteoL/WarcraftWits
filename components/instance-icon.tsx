"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { InstanceWithCompletion, Boss } from "@/types/game"
import { FollowingTooltip } from "@/components/following-tooltip"
import { useHoveredInstanceStore } from "@/lib/store"

interface InstanceIconProps {
  instance: InstanceWithCompletion
  expansionId: string
  foundBosses: Boss[]
  allBosses: Boss[]
  size?: "compact" | "normal"
}

export function InstanceIcon({ instance, expansionId, foundBosses, allBosses, size = "normal" }: InstanceIconProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | undefined>(undefined)
  const { setHoveredInstance, clearHoveredInstance } = useHoveredInstanceStore()
  const router = useRouter()

  // Size configuration based on the size prop
  const isCompact = size === "compact"

  // Adjust radius and dimensions based on size
  const svgSize = isCompact ? 40 : 44
  const radius = isCompact ? 18 : 20
  const circleStrokeWidth = isCompact ? 1.5 : 2
  const iconSize = isCompact ? "w-9 h-9" : "w-10 h-10"
  const fontSize = isCompact ? "text-xs" : "text-sm"

  // Calculate instance-specific boss counts
  const instanceBosses = allBosses.filter((boss) => boss.instance === instance.name)
  const foundInstanceBosses = foundBosses.filter((boss) => boss.instance === instance.name)

  // Calculate completion percentage for the progress circle
  const completionRate =
    instanceBosses.length > 0 ? Math.round((foundInstanceBosses.length / instanceBosses.length) * 100) : 0

  // Calculate circle properties for the progress indicator
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (circumference * completionRate) / 100

  const bossCount = `${foundInstanceBosses.length}/${instanceBosses.length}`

  // Get the first map image for the tooltip
  const instanceImage = instance.maps[0]?.image || "/placeholder.svg"

  // Handle mouse enter with position
  const handleMouseEnter = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
    setShowTooltip(true)
    setHoveredInstance(instance)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setShowTooltip(false)
    clearHoveredInstance()
  }

  // Handle click - ensure context is cleared when navigating
  const handleClick = (e: React.MouseEvent) => {
    if (showTooltip) {
      e.preventDefault()
      return
    }

    // Clear the hovered instance before navigation
    clearHoveredInstance()
  }

  // Ensure context is cleared when component unmounts
  useEffect(() => {
    return () => {
      clearHoveredInstance()
    }
  }, [clearHoveredInstance])

  return (
    <div className="flex-shrink-0">
      <Link href={`/expansion/${expansionId}/${instance.id}`} onClick={handleClick}>
        <div
          className="relative flex items-center justify-center transition-transform hover:scale-110"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute">
            {/* Background circle */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 215, 0, 0.1)"
              strokeWidth={circleStrokeWidth}
            />

            {/* Progress circle */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth={circleStrokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
              className="transition-all duration-500"
            />
          </svg>

          <div
            className={`${iconSize} rounded-full flex items-center justify-center ${fontSize} font-bold transition-all bg-muted text-muted-foreground hover:bg-muted/80`}
          >
            {instance.shortName}
          </div>
        </div>
      </Link>

      {/* Following Tooltip */}
      <FollowingTooltip
        show={showTooltip}
        offsetX={15}
        offsetY={15}
        position="bottom-left"
        initialMousePosition={mousePosition}
      >
        <div className="w-48 bg-card rounded-md shadow-md border border-border/50 overflow-hidden transition-all duration-300">
          <div className="relative h-24 w-full">
            <Image src={instanceImage || "/placeholder.svg"} alt={instance.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-sm mb-1">{instance.name}</h4>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Bosses found:</span>
              <span className="font-medium">{bossCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completion:</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
          </div>
        </div>
      </FollowingTooltip>
    </div>
  )
}


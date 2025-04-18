"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import type { InstanceWithCompletion, Boss } from "@/types/game"
import { FollowingTooltip } from "@/components/following-tooltip"
import { useHoveredInstanceStore } from "@/lib/store"
import { useMedia } from "react-use"

interface InstanceIconProps {
  instance: InstanceWithCompletion
  foundBosses?: Boss[]
  allBosses?: Boss[]
  size?: "compact" | "normal"
}

export function InstanceIcon({ instance, foundBosses = [], allBosses = [], size = "normal" }: InstanceIconProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { setHoveredInstance, clearHoveredInstance, hoveredInstanceId } = useHoveredInstanceStore()
  const pathname = usePathname()
  const isDesktop = useMedia('(min-width: 768px)', false)

  // Check if this instance is currently being hovered by another component
  const isHoveredByOther = useMemo(() => hoveredInstanceId?.toString() === instance.id.toString() && !showTooltip, [hoveredInstanceId])
  // Size configuration based on the size prop
  const isCompact = size === "compact"
  const isSmallScreen = !isDesktop

  // Adjust radius and dimensions based on size
  const svgSize = isCompact && isSmallScreen ? 20 : isCompact ? 40 : 44
  const radius = isCompact && isSmallScreen ? 9 : isCompact ? 18 : 20
  const circleStrokeWidth = isCompact && isSmallScreen ? 1 : isCompact ? 1.5 : 2
  const iconSize = isCompact && isSmallScreen ? "w-5 h-5" : isCompact ? "w-9 h-9" : "w-10 h-10"
  const fontSize = isCompact && isSmallScreen ? "text-[7px]" : isCompact ? "text-xs" : "text-sm"

  // Calculate instance-specific boss counts
  const instanceBosses = allBosses.filter((boss) => boss.instance_id === instance.id)
  const foundInstanceBosses = foundBosses.filter((boss) => boss.instance_id === instance.id)

  // Calculate completion percentage for the progress circle
  const completionRate =
    instanceBosses.length > 0 ? Math.round((foundInstanceBosses.length / instanceBosses.length) * 100) : 0

  // Calculate circle properties for the progress indicator
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (circumference * completionRate) / 100

  const bossCount = `${foundInstanceBosses.length}/${instanceBosses.length}`


  // Handle mouse enter with position
  const handleMouseEnter = () => {
    setShowTooltip(true)
    setHoveredInstance(instance)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setShowTooltip(false)
    clearHoveredInstance()
  }

  // Handle click - ensure context is cleared when navigating
  const handleClick = () => {
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
      <Link href={`${pathname}/${instance.slug}`} onClick={handleClick}>
        <div
          className={`relative flex items-center justify-center transition-transform hover:scale-110 ${
            showTooltip || isHoveredByOther ? "z-100" : ""
          }`}
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
            className={`${iconSize} rounded-full flex items-center justify-center ${fontSize} font-bold transition-all bg-muted ${
              isHoveredByOther
                ? "text-primary scale-125"
                : "text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {instance.slug}
          </div>
        </div>
      </Link>

      {/* Following Tooltip */}
      <FollowingTooltip
        show={showTooltip}
        offsetX={15}
        offsetY={15}
        position="bottom-left"
      >
        <div className="w-48 bg-card rounded-md shadow-md border border-border/50 overflow-hidden transition-all duration-300">
          <div className="relative h-24 w-full">
            <Image src={instance.backgroud_uri || "/placeholder.svg"} alt={instance.name || "unknown"} fill className="object-cover" />
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

"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"

interface FollowingTooltipProps {
  children: ReactNode
  show: boolean
  offsetX?: number
  offsetY?: number
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
  initialMousePosition?: { x: number; y: number }
}

export function FollowingTooltip({
  children,
  show,
  offsetX = 10,
  offsetY = 10,
  position = "bottom-left",
  initialMousePosition,
}: FollowingTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isPositioned, setIsPositioned] = useState(false)

  // Position the tooltip based on mouse coordinates
  const positionTooltip = (tooltip: HTMLElement, mouseX: number, mouseY: number) => {
    const tooltipWidth = tooltip.offsetWidth
    const tooltipHeight = tooltip.offsetHeight
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = 0
    let y = 0

    // Calculate position based on specified corner
    switch (position) {
      case "bottom-left":
        x = mouseX - tooltipWidth - offsetX
        y = mouseY + offsetY
        break
      case "bottom-right":
        x = mouseX + offsetX
        y = mouseY + offsetY
        break
      case "top-left":
        x = mouseX - tooltipWidth - offsetX
        y = mouseY - tooltipHeight - offsetY
        break
      case "top-right":
        x = mouseX + offsetX
        y = mouseY - tooltipHeight - offsetY
        break
    }

    // Ensure tooltip stays within viewport bounds
    if (x < 10) x = 10
    if (y < 10) y = 10
    if (x + tooltipWidth > viewportWidth - 10) x = viewportWidth - tooltipWidth - 10
    if (y + tooltipHeight > viewportHeight - 10) y = viewportHeight - tooltipHeight - 10

    // Apply position directly to DOM for immediate update
    tooltip.style.left = `${x}px`
    tooltip.style.top = `${y}px`

    if (!isPositioned) {
      setIsPositioned(true)
    }
  }

  // Reset positioning when tooltip is hidden
  useEffect(() => {
    if (!show) {
      setIsPositioned(false)
    }
  }, [show])

  // Handle initial positioning
  useEffect(() => {
    if (show && tooltipRef.current && initialMousePosition) {
      const tooltip = tooltipRef.current

      // Use setTimeout to ensure the tooltip has rendered with dimensions
      setTimeout(() => {
        if (tooltip && document.body.contains(tooltip)) {
          positionTooltip(tooltip, initialMousePosition.x, initialMousePosition.y)
        }
      }, 0)
    }
  }, [show, initialMousePosition, offsetX, offsetY, position])

  // Handle mouse movement
  useEffect(() => {
    if (!show) return

    let rafId: number | null = null
    const tooltip = tooltipRef.current
    if (!tooltip) return

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending animation frame to avoid queuing updates
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      // Use requestAnimationFrame for smoother updates
      rafId = requestAnimationFrame(() => {
        if (tooltip && document.body.contains(tooltip)) {
          positionTooltip(tooltip, e.clientX, e.clientY)
        }
      })
    }

    // Add event listener with passive option for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [show, offsetX, offsetY, position])

  if (!show) return null

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] pointer-events-none transition-opacity duration-150 ${
        isPositioned ? "opacity-100" : "opacity-0"
      }`}
      style={{
        left: initialMousePosition ? `${initialMousePosition.x}px` : "0px",
        top: initialMousePosition ? `${initialMousePosition.y}px` : "0px",
        willChange: "transform, left, top",
        transform: "translateZ(0)", // Hardware acceleration
      }}
    >
      {children}
    </div>
  )
}


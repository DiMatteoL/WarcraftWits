"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { useMedia } from "react-use"

interface ZoomableImageProps {
  children: ReactNode
  className?: string
}

export function ZoomableImage({ children, className }: ZoomableImageProps) {
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [initialDistance, setInitialDistance] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMedia("(min-width: 768px)", false)

  const resetZoom = () => {
    setScale(1)
    setTranslateX(0)
    setTranslateY(0)
    setIsZooming(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDesktop) return

    if (e.touches.length === 2) {
      // Pinch to zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
      setInitialDistance(distance)
      setIsZooming(true)
    } else if (e.touches.length === 1) {
      // Single touch for drag
      setStartX(e.touches[0].clientX)
      setStartY(e.touches[0].clientY)
      setIsDragging(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDesktop) return

    if (scale > 1) {
      // Only prevent default when zoomed in to allow carousel swiping when not zoomed
      e.preventDefault()
    }

    if (e.touches.length === 2 && isZooming) {
      // Handle pinch zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      const newScale = Math.max(1, Math.min(3, (scale * distance) / initialDistance))
      setScale(newScale)
      setInitialDistance(distance)
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const diffX = currentX - startX
      const diffY = currentY - startY

      // When zoomed in, pan the image
      const containerWidth = containerRef.current?.clientWidth || 0
      const containerHeight = containerRef.current?.clientHeight || 0

      // Calculate boundaries to prevent panning outside image bounds
      const maxTranslateX = (containerWidth * (scale - 1)) / 2
      const maxTranslateY = (containerHeight * (scale - 1)) / 2

      const newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX + diffX))
      const newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY + diffY))

      setTranslateX(newTranslateX)
      setTranslateY(newTranslateY)

      setStartX(currentX)
      setStartY(currentY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsZooming(false)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isDesktop) return

    if (scale > 1) {
      resetZoom()
    } else {
      setScale(2)

      // Center zoom on double-click position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const offsetX = (e.clientX - rect.left) / rect.width
        const offsetY = (e.clientY - rect.top) / rect.height

        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight

        setTranslateX((offsetX - 0.5) * containerWidth * -1)
        setTranslateY((offsetY - 0.5) * containerHeight * -1)
      }
    }
  }

  // Reset zoom when component unmounts or when changing to desktop
  useEffect(() => {
    resetZoom()
  }, [isDesktop])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full touch-none ${className || ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transition: isDragging || isZooming ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}

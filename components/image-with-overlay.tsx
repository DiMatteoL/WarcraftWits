"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface Pin {
  component: React.ReactNode
  position: { x: number; y: number }
}

interface ImageWithOverlayProps {
  src: string
  alt: string
  onClick?: (position: { x: number; y: number }) => void
  pins?: Pin[]
}

export function ImageWithOverlay({ src, alt, onClick, pins }: ImageWithOverlayProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  // Calculate the actual image dimensions based on container size and 3:2 aspect ratio
  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight
      const aspectRatio = 3/2

      // Calculate dimensions that fit within the container while maintaining aspect ratio
      let width = containerWidth
      let height = width / aspectRatio

      // If height exceeds container, scale based on height
      if (height > containerHeight) {
        height = containerHeight
        width = height * aspectRatio
      }

      setImageDimensions({ width, height })
    }
  }

  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) return

    updateDimensions()

    const observer = new ResizeObserver(() => {
      updateDimensions()
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageDimensions) return

    const rect = containerRef.current.getBoundingClientRect()

    // Calculate the image's position within the container
    const imageLeft = (rect.width - imageDimensions.width) / 2
    const imageTop = (rect.height - imageDimensions.height) / 2

    // Calculate relative position within the image
    const relativeX = e.clientX - rect.left - imageLeft
    const relativeY = e.clientY - rect.top - imageTop

    // Convert to percentage (0-100)
    const x = (relativeX / imageDimensions.width) * 100
    const y = (relativeY / imageDimensions.height) * 100

    // Only set position if within image bounds
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setPosition({ x, y })
    } else {
      setPosition(null)
    }
  }

  const handleMouseLeave = () => {
    setPosition(null)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && position) {
      onClick(position)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
      >
      {imageDimensions && (
        <div
          className="relative"
          style={{
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
          {position && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
              x: {position.x.toFixed(2)}, y: {position.y.toFixed(2)}
            </div>
          )}
          {pins?.map((pin, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${pin.position.x}%`,
                top: `${pin.position.y}%`
              }}
            >
              {pin.component}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

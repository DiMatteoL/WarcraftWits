"use client"

import { useState } from "react"
import Image from "next/image"

interface Pin {
  component: React.ReactNode
  position: { x: number; y: number }
}

interface ImageWithOverlayProps {
  src: string
  alt: string
  width: number
  height: number
  onClick?: (position: { x: number; y: number }) => void
  pins?: Pin[]
}

export function ImageWithOverlay({ src, alt, width, height, onClick, pins }: ImageWithOverlayProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
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
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
      />
      {position && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
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
  )
}

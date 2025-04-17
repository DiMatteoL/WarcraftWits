"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface ThumbnailProps {
  src: string
  alt: string
  name: string
}

interface CarouselThumbnailsProps {
  thumbnails: ThumbnailProps[]
  activeIndex: number
  onSelect: (index: number) => void
  className?: string
}

export function CarouselThumbnails({ thumbnails, activeIndex, onSelect, className }: CarouselThumbnailsProps) {
  return (
    <div className={cn("flex space-x-2 overflow-x-auto justify-center", className)}>
      {thumbnails.map((thumbnail, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 transition-colors",
            index === activeIndex ? "border-primary" : "border-transparent",
          )}
          aria-label={`View ${thumbnail.name}`}
        >
          <Image
            src={thumbnail.src || "/placeholder.svg"}
            alt={thumbnail.alt}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}

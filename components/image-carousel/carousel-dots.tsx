"use client"

import { cn } from "@/lib/utils"

interface CarouselDotsProps {
  count: number
  activeIndex: number
  onSelect: (index: number) => void
  className?: string
}

export function CarouselDots({ count, activeIndex, onSelect, className }: CarouselDotsProps) {
  return (
    <div className={cn("flex space-x-2 z-10", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn("w-2 h-2 rounded-full transition-colors", index === activeIndex ? "bg-white" : "bg-white/50")}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

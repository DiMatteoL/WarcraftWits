"use client"

import type React from "react"
import { useState, useRef, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMedia } from "react-use"

interface ThumbnailProps {
  src: string
  alt: string
  name: string
}

interface ZoomableCarouselProps {
  slides: ReactNode[]
  thumbnails: ThumbnailProps[]
  className?: string
}

export function ZoomableCarousel({ slides, thumbnails, className }: ZoomableCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [initialDistance, setInitialDistance] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMedia("(min-width: 768px)", false)

  const nextSlide = () => {
    if (scale > 1) return // Don't change slides when zoomed in
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
    resetZoom()
  }

  const prevSlide = () => {
    if (scale > 1) return // Don't change slides when zoomed in
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
    resetZoom()
  }

  const goToSlide = (index: number) => {
    if (scale > 1) return // Don't change slides when zoomed in
    setCurrentIndex(index)
    resetZoom()
  }

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
      // Single touch for drag or swipe
      setStartX(e.touches[0].clientX)
      setStartY(e.touches[0].clientY)
      setIsDragging(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDesktop) return

    e.preventDefault() // Prevent browser default behavior

    if (e.touches.length === 2 && isZooming) {
      // Handle pinch zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      const newScale = Math.max(1, Math.min(3, (scale * distance) / initialDistance))
      setScale(newScale)
      setInitialDistance(distance)
    } else if (e.touches.length === 1 && isDragging) {
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const diffX = currentX - startX
      const diffY = currentY - startY

      if (scale > 1) {
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
      } else {
        // When not zoomed, handle horizontal swipe for slide change
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            prevSlide()
          } else {
            nextSlide()
          }
          setIsDragging(false)
        }
      }

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
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="relative w-full h-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0 overflow-hidden">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  transform:
                    index === currentIndex ? `scale(${scale}) translate(${translateX}px, ${translateY}px)` : "none",
                  transition: isDragging || isZooming ? "none" : "transform 0.3s ease-out",
                }}
              >
                {slide}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {thumbnails.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex ? "bg-white" : "bg-white/50",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
        {thumbnails.map((thumbnail, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors",
              index === currentIndex ? "border-primary" : "border-transparent",
            )}
            aria-label={`View ${thumbnail.name}`}
          >
            <img src={thumbnail.src || "/placeholder.svg"} alt={thumbnail.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

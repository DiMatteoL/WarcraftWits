"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import { ZoomableImage } from "./zoomable-image"
import { CarouselDots } from "./carousel-dots"
import { cn } from "@/lib/utils"
import { CarouselThumbnails } from "@/components/image-carousel/carousel-thumbnails"
import { useMedia } from "react-use"

interface ThumbnailProps {
  src: string
  alt: string
  name: string
}

interface ImageCarouselProps {
  slides: ReactNode[]
  thumbnails: ThumbnailProps[]
  className?: string
}

export function ImageCarousel({ slides, thumbnails, className }: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const isDesktop = useMedia("(min-width: 768px)", false)

  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  const handleThumbnailSelect = (index: number) => {
    api?.scrollTo(index)
  }

  return (
    <div className={cn("h-full flex flex-col overflow-hidden", className)}>
      {isDesktop ? <div className="flex-shrink-0 border-b py-2 px-4">
      <CarouselThumbnails
        thumbnails={thumbnails}
        activeIndex={current}
        onSelect={handleThumbnailSelect}
      />
      </div> : null}

      <Carousel setApi={setApi} className="w-full flex-grow overflow-hidden">
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <ZoomableImage>{slide}</ZoomableImage>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 bg-black/30 hover:bg-black/50 text-white" />
        <CarouselNext className="right-2 bg-black/30 hover:bg-black/50 text-white" />

        <CarouselDots
          count={slides.length}
          activeIndex={current}
          onSelect={handleThumbnailSelect}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        />
      </Carousel>
    </div>
  )
}

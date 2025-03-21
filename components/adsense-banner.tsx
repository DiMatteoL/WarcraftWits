"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdSenseBannerProps {
  client: string
  slot: string
  format?: string
  responsive?: boolean
  style?: React.CSSProperties
  className?: string
  id: string // Unique identifier for this ad
  onClose?: () => void
  isAnchor?: boolean // Flag for anchor ads
}

export function AdSenseBanner({
  client,
  slot,
  format = "auto",
  responsive = true,
  style = {},
  className = "",
  id,
  onClose,
  isAnchor = false,
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip during development if window.adsbygoogle is not available
    if (typeof window === "undefined" || !window.adsbygoogle) {
      console.log("AdSense not available in development mode")
      return
    }

    try {
      // Push the ad only if it hasn't been pushed already
      if (adRef.current && adRef.current.innerHTML === "") {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("Error loading AdSense ad:", error)
    }
  }, [])

  // For anchor ads, we don't need our custom close button as Google provides one
  const showCloseButton = onClose && !isAnchor

  return (
    <div ref={adRef} className={`relative ${className}`}>
      {/* Close button - only for non-anchor ads */}
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background/90 shadow-sm z-10 hover:bg-background"
          onClick={onClose}
          aria-label="Close advertisement"
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(isAnchor ? { "data-ad-layout": "anchor" } : {})}
      />
    </div>
  )
}


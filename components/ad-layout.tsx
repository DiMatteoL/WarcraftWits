"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useScreenWidth } from "@/hooks/use-screen-width"
import { useAdVisibility } from "@/hooks/use-ad-visibility"
import { AdSenseBanner } from "@/components/adsense-banner"

// Replace these with your actual AdSense client and slot IDs
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"
const ADSENSE_SLOT_SIDE_LEFT = "XXXXXXXXXX"
const ADSENSE_SLOT_SIDE_RIGHT = "XXXXXXXXXX"
const ADSENSE_SLOT_BOTTOM = "XXXXXXXXXX"
const ADSENSE_SLOT_ANCHOR = "XXXXXXXXXX" // Specific slot for anchor ads

// Ad IDs for visibility tracking
const AD_ID_LEFT = "side-left"
const AD_ID_RIGHT = "side-right"
const AD_ID_BOTTOM = "bottom"
const AD_ID_ANCHOR = "anchor"

interface AdLayoutProps {
  children: React.ReactNode
}

export function AdLayout({ children }: AdLayoutProps) {
  const pathname = usePathname()
  const { isWide } = useScreenWidth()
  const { isAdVisible, closeAd, isLoaded } = useAdVisibility()
  const isHomePage = pathname === "/"

  // Determine if we should show side ads
  const showSideAds = isHomePage && isWide

  // Check individual ad visibility
  const leftAdVisible = isLoaded && isAdVisible(AD_ID_LEFT)
  const rightAdVisible = isLoaded && isAdVisible(AD_ID_RIGHT)
  const anchorAdVisible = isLoaded && isAdVisible(AD_ID_ANCHOR)

  // Only show side ads if they're visible
  const showLeftAd = showSideAds && leftAdVisible
  const showRightAd = showSideAds && rightAdVisible

  // Show anchor ad on non-homepage or narrow screens, and only if it's visible
  const showAnchorAd = !showSideAds && anchorAdVisible

  // Calculate content margins based on visible ads
  const contentMarginLeft = showLeftAd ? "ml-[170px]" : ""
  const contentMarginRight = showRightAd ? "mr-[170px]" : ""

  // No need for bottom margin with anchor ads as they float over content
  // Google's anchor ads have their own padding mechanism

  return (
    <div className="relative min-h-screen">
      {/* Main content with conditional margins for ads */}
      <div className={`${contentMarginLeft} ${contentMarginRight} transition-all duration-300`}>{children}</div>

      {/* Left side ad (only on homepage and wide screens) */}
      {showLeftAd && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 w-[160px] h-[600px] z-30 p-2">
          <AdSenseBanner
            id={AD_ID_LEFT}
            client={ADSENSE_CLIENT}
            slot={ADSENSE_SLOT_SIDE_LEFT}
            style={{ display: "block", width: "160px", height: "600px" }}
            responsive={false}
            className="bg-muted/30 backdrop-blur-sm rounded-md shadow-md"
            onClose={() => closeAd(AD_ID_LEFT)}
          />
        </div>
      )}

      {/* Right side ad (only on homepage and wide screens) */}
      {showRightAd && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 w-[160px] h-[600px] z-30 p-2">
          <AdSenseBanner
            id={AD_ID_RIGHT}
            client={ADSENSE_CLIENT}
            slot={ADSENSE_SLOT_SIDE_RIGHT}
            style={{ display: "block", width: "160px", height: "600px" }}
            responsive={false}
            className="bg-muted/30 backdrop-blur-sm rounded-md shadow-md"
            onClose={() => closeAd(AD_ID_RIGHT)}
          />
        </div>
      )}

      {/* Anchor ad (on all pages when not showing side ads) */}
      {showAnchorAd && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <AdSenseBanner
            id={AD_ID_ANCHOR}
            client={ADSENSE_CLIENT}
            slot={ADSENSE_SLOT_ANCHOR}
            format="auto"
            responsive={true}
            isAnchor={true}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}


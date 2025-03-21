"use client"

import { useState, useEffect } from "react"

// Key for localStorage
const AD_VISIBILITY_KEY = "wow-memory-ad-visibility"

// How long ads stay closed (in hours)
const AD_CLOSE_DURATION = 24

// Special handling for anchor ads - they use Google's built-in collapse
// so we don't need to track them the same way
const ANCHOR_AD_IDS = ["anchor"]

interface AdVisibilityState {
  [adId: string]: {
    closed: boolean
    timestamp: number
  }
}

export function useAdVisibility() {
  const [adVisibility, setAdVisibility] = useState<AdVisibilityState>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load visibility state from localStorage
  useEffect(() => {
    try {
      const storedVisibility = localStorage.getItem(AD_VISIBILITY_KEY)
      if (storedVisibility) {
        const parsedVisibility = JSON.parse(storedVisibility) as AdVisibilityState

        // Filter out expired closed states
        const now = Date.now()
        const filteredVisibility: AdVisibilityState = {}

        Object.entries(parsedVisibility).forEach(([adId, state]) => {
          // If closed more than AD_CLOSE_DURATION hours ago, reset to visible
          const hoursSinceClosed = (now - state.timestamp) / (1000 * 60 * 60)
          if (!state.closed || hoursSinceClosed < AD_CLOSE_DURATION) {
            filteredVisibility[adId] = state
          }
        })

        setAdVisibility(filteredVisibility)
      }
    } catch (error) {
      console.error("Error loading ad visibility state:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save visibility state to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(AD_VISIBILITY_KEY, JSON.stringify(adVisibility))
      } catch (error) {
        console.error("Error saving ad visibility state:", error)
      }
    }
  }, [adVisibility, isLoaded])

  // Check if an ad is visible
  const isAdVisible = (adId: string): boolean => {
    // Anchor ads are always considered visible since Google handles their visibility
    if (ANCHOR_AD_IDS.includes(adId)) {
      return true
    }
    return !adVisibility[adId]?.closed
  }

  // Close an ad
  const closeAd = (adId: string) => {
    // Don't track anchor ads in our system
    if (ANCHOR_AD_IDS.includes(adId)) {
      return
    }

    setAdVisibility((prev) => ({
      ...prev,
      [adId]: {
        closed: true,
        timestamp: Date.now(),
      },
    }))
  }

  // Reset all ad visibility
  const resetAllAds = () => {
    setAdVisibility({})
  }

  return {
    isAdVisible,
    closeAd,
    resetAllAds,
    isLoaded,
  }
}


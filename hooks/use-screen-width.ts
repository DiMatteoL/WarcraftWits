"use client"

import { useState, useEffect } from "react"

export function useScreenWidth() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [isWide, setIsWide] = useState<boolean>(width > 1300)

  useEffect(() => {
    // Set initial width
    setWidth(window.innerWidth)
    setIsWide(window.innerWidth > 1300)

    // Handle resize with debounce for better performance
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth)
        setIsWide(window.innerWidth > 1300)
      }, 100)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return { width, isWide }
}


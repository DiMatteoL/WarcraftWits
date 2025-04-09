"use client"

import { useState, useEffect } from "react"

interface ProgressIndicatorProps {
  percentage: number
  label: string
  name: string
  expansionName?: string
}

export function ProgressIndicator({ percentage, label, name, expansionName }: ProgressIndicatorProps) {
  const [isNameVisible, setIsNameVisible] = useState(false)

  useEffect(() => {
    // Trigger the animation after a short delay to ensure the component is mounted
    const timer = setTimeout(() => {
      setIsNameVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-primary mb-1">
        {expansionName ? (
          <div className="flex items-center">
            <span>{expansionName}</span>
            <span
              className={`transition-all duration-500 ease-in-out transform ${
                isNameVisible
                  ? "translate-x-0 translate-y-0 opacity-100"
                  : "translate-x-[-20px] translate-y-4 opacity-0"
              }`}
            >
              &nbsp;&gt;&nbsp;{name}
            </span>
          </div>
        ) : (
          name
        )}
      </h2>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold mr-2">{percentage}%</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

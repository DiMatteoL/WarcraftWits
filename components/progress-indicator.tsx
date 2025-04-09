"use client"

import { useState, useEffect } from "react"
import { ArrowDownRight, CornerDownRight } from "lucide-react"

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
          <div className="flex flex-col">
            <span>{expansionName}</span>
            <div className="flex items-center">
              <span
                className={`flex items-center transition-all duration-500 ease-in-out transform ${
                  isNameVisible
                  ? "translate-x-0 translate-y-0 opacity-100"
                  : "translate-y-[-20px] translate-x-[-12px] opacity-0"
                  }`}
              >
                <CornerDownRight className="h-4 w-4 mr-1" />
                {name}
              </span>
            </div>
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

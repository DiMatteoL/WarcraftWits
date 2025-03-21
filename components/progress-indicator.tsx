"use client"

interface ProgressIndicatorProps {
  percentage: number
  label: string
  name: string
}

export function ProgressIndicator({ percentage, label, name }: ProgressIndicatorProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-primary mb-1">{name}</h2>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold mr-2">{percentage}%</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}


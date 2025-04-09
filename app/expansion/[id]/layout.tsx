import type React from "react"
import { Suspense } from "react"

export default function ExpansionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { ExpansionSelector } from "@/components/expansion-selector"
import type { Tables } from "@/types/database"

interface ExpansionSelectorClientProps {
  expansions: Tables<"expansion">[]
  currentExpansion: string
}

export function ExpansionSelectorClient({ expansions, currentExpansion }: ExpansionSelectorClientProps) {
  const router = useRouter()

  const handleExpansionChange = (slug: string) => {
    router.push(`/protected/${slug}`)
  }

  return (
    <ExpansionSelector
      expansions={expansions}
      currentExpansion={currentExpansion}
      onExpansionChange={handleExpansionChange}
    />
  )
}

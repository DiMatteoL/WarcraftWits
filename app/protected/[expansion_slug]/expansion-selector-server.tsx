import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ExpansionSelectorClient } from "./expansion-selector-client"

export async function ExpansionSelectorServer({ expansionSlug }: { expansionSlug: string }) {
  const supabase = await createClient()

  // Fetch all expansions
  const { data: expansions, error: expansionsError } = await supabase
    .from("expansion")
    .select("*")
    .order("release_date", { ascending: true })

  if (expansionsError) {
    throw new Error(`Failed to load expansions: ${expansionsError.message}`)
  }

  // Find the current expansion from the list
  const currentExpansion = expansions?.find(exp => exp.slug === expansionSlug)
  if (!currentExpansion) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <ExpansionSelectorClient
        expansions={expansions || []}
        currentExpansion={currentExpansion.slug || ""}
      />
    </div>
  )
}

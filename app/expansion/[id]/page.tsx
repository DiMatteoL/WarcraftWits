import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { ExpansionClient } from "./expansion-client"

export default async function ExpansionPage({ params }: { params: { id: string } }) {
  // Create a Supabase client configured for server-side
  const supabase = await createClient()

  // 1. Fetch expansion
  const { data: expansion, error: expansionError } = await supabase
    .from("expansion")
    .select("*")
    .eq("slug", (await params).id)
    .single()

  if (expansionError || !expansion) {
    notFound()
  }

  // 2. Fetch instances for this expansion with related maps and bosses
  const { data: instances, error: instancesError } = await supabase
    .from("instance")
    .select(`
      *,
      map(*),
      npc(*)
    `)
    .eq("expansion_id", expansion.id)
    .order("name")

  if (instancesError) {
    throw new Error(`Failed to load instances: ${instancesError.message}`)
  }

  // Extract maps and bosses from the joined query results
  const { data: maps, error: mapsError } = await supabase
    .from("map")
    .select(`*`)
    .eq("expansion_id", expansion.id)
    .is("instance_id", null)
    .order("index")

  if (mapsError) {
    throw new Error(`Failed to load maps: ${mapsError.message}`)
  }

  const bosses = instances?.flatMap(instance => instance.npc || []) || []

  return (
    <Suspense>
      <ExpansionClient
        id={(await params).id}
        expansion={expansion}
        instances={instances || []}
        maps={maps || []}
        bosses={bosses}
      />
    </Suspense>
  )
}

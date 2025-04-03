import { createClient } from "@/utils/supabase/server"
import { MapSelectorClient } from "./map-selector-client"

const MAPS_PER_PAGE = 10

export async function MapSelectorServer({
  expansionSlug,
  page = 0
}: {
  expansionSlug: string
  page?: number
}) {
  const supabase = await createClient()

  // First get the expansion ID
  const { data: expansion, error: expansionError } = await supabase
    .from("expansion")
    .select("id")
    .eq("slug", expansionSlug)
    .single()

  if (expansionError || !expansion) {
    throw new Error(`Failed to load expansion: ${expansionError?.message}`)
  }

  // Fetch maps for this expansion with pagination
  const { data: maps, error: mapsError, count } = await supabase
    .from("map")
    .select("*", { count: "exact" })
    .eq("expansion_id", expansion.id)
    .is("instance_id", null)
    .order("name")
    .range(page * MAPS_PER_PAGE, (page + 1) * MAPS_PER_PAGE - 1)

  if (mapsError) {
    throw new Error(`Failed to load maps: ${mapsError.message}`)
  }

  const totalPages = Math.ceil((count || 0) / MAPS_PER_PAGE)

  return <MapSelectorClient maps={maps || []} currentPage={page} totalPages={totalPages} />
}

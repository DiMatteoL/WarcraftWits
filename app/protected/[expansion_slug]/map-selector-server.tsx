import { createClient } from "@/utils/supabase/server"
import { BossPickerClient } from "./boss-picker-client"

const MAPS_PER_PAGE = 1

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
    .order("index")
    .range(page * MAPS_PER_PAGE, page * MAPS_PER_PAGE)

  if (mapsError) {
    throw new Error(`Failed to load maps: ${mapsError.message}`)
  }

  const totalPages = Math.ceil((count || 0) / MAPS_PER_PAGE)

  const { data: instances, error: instancesError } = await supabase
    .from("instance")
    .select("*")
    .eq("expansion_id", expansion.id)
    .order("name")

  if (instancesError) {
    throw new Error(`Failed to load instances: ${instancesError.message}`)
  }

  return <BossPickerClient
    expansionSlug={expansionSlug}
    maps={maps || []}
    instances={instances || []}
    currentPage={page}
    totalPages={totalPages}
  />
}

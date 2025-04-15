import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { ExpansionClient } from "./expansion-client"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const { id } = await params;
  const { data: expansion, error } = await supabase
    .from("expansion")
    .select("*")
    .eq("slug", id)
    .single()

  if (error || !expansion) {
    return {
      title: "Expansion Not Found - Warcraft Wits",
      description: "The expansion you're looking for doesn't exist or has been removed from the game."
    }
  }

  return {
    title: `${expansion.name} - Warcraft Wits`,
    description: `Test your knowledge of World of Warcraft bosses in ${expansion.name}. Challenge yourself to name as many raid and dungeon bosses as you can remember!`,
    openGraph: {
      title: `${expansion.name} - Warcraft Wits`,
      description: `Test your knowledge of World of Warcraft bosses in ${expansion.name}. Challenge yourself to name as many raid and dungeon bosses as you can remember!`,
      images: expansion.logo_uri ? [
        {
          url: expansion.logo_uri,
          width: 512,
          height: 512,
          alt: `${expansion.name} Logo`,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${expansion.name} - Warcraft Wits`,
      description: `Test your knowledge of World of Warcraft bosses in ${expansion.name}. Challenge yourself to name as many raid and dungeon bosses as you can remember!`,
      images: expansion.logo_uri ? [expansion.logo_uri] : undefined,
    }
  }
}

export default async function ExpansionPage({ params }: { params: Promise<{ id: string }> }) {
  // Create a Supabase client configured for server-side
  const supabase = await createClient()
  const { id } = await params;

  // 1. Fetch expansion
  const { data: expansion, error: expansionError } = await supabase
    .from("expansion")
    .select("*")
    .eq("slug", id)
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
    .select(`
      *,
      pin(*, instance(*))
    `)
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
        id={id}
        expansion={expansion}
        instances={instances || []}
        maps={maps || []}
        bosses={bosses}
      />
    </Suspense>
  )
}

import { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { MatchGameClient } from "./match-game-client"

export async function generateMetadata({ params }: { params: Promise<{ expansionSlug: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const { expansionSlug } = await params;
  const { data: expansion, error } = await supabase
    .from("expansion")
    .select("*")
    .eq("slug", expansionSlug)
    .single()

  if (error || !expansion) {
    return {
      title: "Expansion Not Found - Warcraft Wits",
      description: "The expansion you're looking for doesn't exist or has been removed from the game."
    }
  }

  return {
    title: `${expansion.name} Instance Matcher - Warcraft Wits`,
    description: `Test your knowledge of World of Warcraft instances in ${expansion.name}. Match each boss to their correct instance!`,
    openGraph: {
      title: `${expansion.name} Instance Matcher - Warcraft Wits`,
      description: `Test your knowledge of World of Warcraft instances in ${expansion.name}. Match each boss to their correct instance!`,
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
      title: `${expansion.name} Instance Matcher - Warcraft Wits`,
      description: `Test your knowledge of World of Warcraft instances in ${expansion.name}. Match each boss to their correct instance!`,
      images: expansion.logo_uri ? [expansion.logo_uri] : undefined,
    }
  }
}

export default async function MatchGamePage({ params }: { params: Promise<{ expansionSlug: string }> }) {
  const { expansionSlug } = await params;
  const supabase = await createClient()

  // Fetch expansion data
  const { data: expansion, error: expansionError } = await supabase
    .from("expansion")
    .select("*")
    .eq("slug", expansionSlug)
    .single()

  if (expansionError || !expansion) {
    notFound()
  }

  // Fetch instances for this expansion
  const { data: instances, error: instancesError } = await supabase
    .from("instance")
    .select("*")
    .eq("expansion_id", expansion.id)

  if (instancesError) {
    throw new Error(`Failed to load instances: ${instancesError.message}`)
  }

  // Get instance IDs
  const instanceIds = instances?.map((instance) => instance.id) || []

  // Fetch bosses (NPCs) for this expansion
  const { data: bosses, error: bossesError } = await supabase
    .from("npc")
    .select("*")
    .in("instance_id", instanceIds)

  if (bossesError) {
    throw new Error(`Failed to load bosses: ${bossesError.message}`)
  }

  const expansionData = {
    ...expansion,
    instances: instances || [],
    bosses: bosses || []
  }

  return <MatchGameClient expansion={expansionData} />
}

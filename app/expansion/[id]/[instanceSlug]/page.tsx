// This is a Server Component
import { createClient } from "@/utils/supabase/server"
import { InstanceClient } from "./instance-client"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string; instanceSlug: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const { instanceSlug } = await params;
  const { data: instance, error } = await supabase
    .from("instance")
    .select("*, expansion(*)")
    .eq("slug", instanceSlug)
    .single()

  if (error || !instance) {
    return {
      title: "Instance Not Found - Warcraft Wits",
      description: "The instance you're looking for doesn't exist or has been removed from the game."
    }
  }

  return {
    title: `${instance.name} - ${instance.expansion?.name} - Warcraft Wits`,
    description: `Test your knowledge of World of Warcraft bosses in ${instance.name} from ${instance.expansion?.name}. Challenge yourself to name as many raid and dungeon bosses as you can remember!`,
    openGraph: {
      title: `${instance.name} - ${instance.expansion?.name} - Warcraft Wits`,
      description: `Test your knowledge of World of Warcraft bosses in ${instance.name} from ${instance.expansion?.name}. Challenge yourself to name as many raid and dungeon bosses as you can remember!`,
      images: instance.logo_uri ? [
        {
          url: instance.logo_uri,
          width: 512,
          height: 512,
          alt: `${instance.name} Logo`,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${instance.name} - ${instance.expansion?.name} - Warcraft Wits`,
      description: `Test your knowledge of World of Warcraft bosses in ${instance.name} from ${instance.expansion?.name}. Challenge yourself to name as many raid and dungeon bosses as you can remember!`,
      images: instance.logo_uri ? [instance.logo_uri] : undefined,
    }
  }
}

export default async function InstancePage({ params }: { params: Promise<{ id: string; instanceSlug: string }> }) {
  // Create a Supabase client configured for server-side
  const supabase = await createClient()
  const { id, instanceSlug } = await params;

  // Fetch instance data
  const { data: instance, error } = await supabase
    .from("instance")
    .select("*, npc(*), map(*), expansion(*)")
    .eq("slug", instanceSlug)
    .single()

  if (error) {
    throw new Error(`Failed to load instance: ${error.message}`)
  }

  return (
      <InstanceClient
        expansionId={id}
        instance={instance}
      />
  )
}

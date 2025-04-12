// This is a Server Component
import { createClient } from "@/utils/supabase/server"
import { InstanceClient } from "./instance-client"

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

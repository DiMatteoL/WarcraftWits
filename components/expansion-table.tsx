"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExpansionCard } from "@/components/expansion-card"
import { Tables } from "@/types/database"
import { useSupabase } from "@/contexts/supabase-context"

export function ExpansionTable() {
  const supabase = useSupabase()
  const [expansions, setExpansions] = useState<Tables<"expansion">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExpansions() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("expansion")
          .select("*")
          .order("release_date", { ascending: true })


        const a = await supabase.storage
        .from('images')
        .createSignedUploadUrl('https://wowpedia.fandom.com/wiki/Cataclysm_instance_maps?file=WorldMap-BaradinHold.jpg', )

        console.log(a)
        setExpansions(data || [])
      } catch (err) {
        console.error("Error fetching expansions:", err)
        setError("Failed to load expansions")
      } finally {
        setLoading(false)
      }
    }

    fetchExpansions()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-64 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {expansions.map((expansion) => (
        <Link href={`/expansion/${expansion.slug}`} key={expansion.id} prefetch={true}>
          <ExpansionCard
            name={expansion.name || "Unknown Expansion"}
            image={expansion.logo_uri || "/placeholder.svg"}
          />
        </Link>
      ))}
    </div>
  )
}

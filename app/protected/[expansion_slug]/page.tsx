import { Suspense } from "react"
import { ExpansionSelectorServer } from "./expansion-selector-server"
import { MapSelectorServer } from "./map-selector-server"

export default async function ExpansionPage({
  params,
  searchParams
}: {
  params: Promise<{ expansion_slug: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const { expansion_slug } = await params;
  const { page } = await searchParams;

  return (
    <Suspense>
      <ExpansionSelectorServer expansionSlug={expansion_slug} />
      <MapSelectorServer expansionSlug={expansion_slug} page={page ? parseInt(page) : undefined} />
    </Suspense>
  )
}

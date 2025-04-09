import { Suspense } from "react"
import { ExpansionSelectorServer } from "./expansion-selector-server"
import { MapSelectorServer } from "./map-selector-server"

export default function ExpansionPage({
  params,
  searchParams
}: {
  params: { expansion_slug: string }
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 0

  return (
    <Suspense>
      <ExpansionSelectorServer expansionSlug={params.expansion_slug} />
      <MapSelectorServer expansionSlug={params.expansion_slug} page={page} />
    </Suspense>
  )
}

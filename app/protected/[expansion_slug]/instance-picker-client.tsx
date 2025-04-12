"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tables } from "@/types/database"
import { Suspense } from "react"


interface InstancePickerClientProps {
  instances: Tables<"instance">[]
  expansionSlug: string
  pinnedInstanceIds: number[]
}

function InstancePickerClientInner({ expansionSlug, instances, pinnedInstanceIds }: InstancePickerClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleInstanceClick = (instanceId: number) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update or add the instance_id parameter
    params.set('instance_id', instanceId.toString())

    // Update the URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const selectedInstanceId = searchParams.get('instance_id') ? parseInt(searchParams.get('instance_id')!) : null

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-4">Instances</h2>
      <div className="grid grid-cols-1 gap-3 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
        {instances.map((instance) => (
          <div
            key={instance.id}
            className={`p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              selectedInstanceId! === instance.id! ? 'bg-yellow-50/10' : ''
            }`}
            onClick={() => handleInstanceClick(instance.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="font-medium">{instance.name}</h3>
                {pinnedInstanceIds.includes(instance.id) && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                    Pinned
                  </span>
                )}
              </div>
              <a
                href={`/protected/${expansionSlug}/${instance.slug}`}
                className="text-gray-500 hover:text-blue-500"
                onClick={(e) => e.stopPropagation()} // Prevent triggering the parent onClick
              >
                Pin Bosses
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function InstancePickerClient(props: InstancePickerClientProps) {
  return (
    <Suspense fallback={<div className="h-full">Loading instances...</div>}>
      <InstancePickerClientInner {...props} />
    </Suspense>
  )
}

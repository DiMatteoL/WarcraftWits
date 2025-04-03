"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tables } from "@/types/database"
import { Button } from "@/components/ui/button"


interface InstancePickerClientProps {
  instances: Tables<"instance">[]
  expansionSlug: string
}

export function InstancePickerClient({ expansionSlug, instances }: InstancePickerClientProps) {
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
              <h3 className="font-medium">{instance.name}</h3>
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

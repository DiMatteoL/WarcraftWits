import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/progress-indicator"
import { BossSearch } from "@/components/boss-search"
import { BossList } from "@/components/boss-list"
import { InstanceIcon } from "@/components/instance-icon"
import type { InstanceWithCompletion } from "@/types/game"
import type { Tables } from "@/types/database"

type SidePanelProps = {
  expansion: Tables<"expansion">
  instances: InstanceWithCompletion[]
  bosses: Tables<"npc">[]
  foundBosses: Tables<"npc">[]
  onBossFound: (boss: Tables<"npc">) => void
  clearHoveredInstance: () => void
  isDesktop: boolean
  instanceName?: string // Optional instance name to display instead of expansion name
  instanceFilter?: number // Optional instance ID to filter bosses
  backLink?: string // Optional back link URL
  backText?: string // Optional back button text
}

export function SidePanel({
  expansion,
  instances,
  bosses,
  foundBosses,
  onBossFound,
  clearHoveredInstance,
  isDesktop,
  instanceName,
  instanceFilter,
  backLink = "/",
  backText = "Other expansions"
}: SidePanelProps) {
  // Calculate boss counts
  const totalBossCount = instanceFilter
    ? bosses.filter(b => b.instance_id === instanceFilter).length
    : bosses.length
  const foundBossCount = instanceFilter
    ? foundBosses.filter(b => b.instance_id === instanceFilter).length
    : foundBosses.length
  const completionPercentage = totalBossCount > 0 ? Math.round((foundBossCount / totalBossCount) * 100) : 0

  // Determine if we should use compact mode based on instance count
  const useCompactMode = instances.length > 8

  // Calculate the maximum gap based on the number of instances and icon size
  const getMaxGap = () => {
    const instanceCount = instances.length
    if (instanceCount > 12) return 6 // Smallest gap for many instances
    if (instanceCount > 8) return 8 // Medium gap
    return 12 // Largest gap for fewer instances
  }

  // Display name for the progress indicator
  const displayName = instanceName || expansion.name || "Expansion"

  // Handle null case for expansion name
  const expansionName = expansion.name || undefined

  return (
    <div
      className={`w-full md:w-1/4 h-full md:h-screen bg-card overflow-y-auto border-l border-border/50 shadow-md overflow-hidden p-4 grid gap-4 ${
        isDesktop
          ? "grid-areas-desktop grid-cols-1 grid-rows-[auto_auto_auto_1px_1fr]"
          : "grid-areas-mobile grid-cols-1 grid-rows-[auto_auto_1px_1fr]"
      }`}
      style={{
        gridTemplateAreas: isDesktop
          ? `
            "nav"
            "progress"
            "instances"
            "separator"
            "search"
          `
          : `
            "nav"
            "progress"
            "separator"
            "search"
          `
      }}
    >
      {/* Navigation Area */}
      <div className="grid-area-nav">
        <Link href={backLink} onClick={() => clearHoveredInstance()}>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 py-1 h-8">
            <ChevronLeft className="mr-1 h-4 w-4" />
            {backText}
          </Button>
        </Link>
      </div>

      {/* Progress Area */}
      <div className="grid-area-progress">
        <ProgressIndicator
          percentage={completionPercentage}
          label="Bosses named"
          name={displayName}
          expansionName={instanceName ? expansionName : undefined}
        />
      </div>

      {/* Instances Area - Only show on desktop */}
      {isDesktop && (
        <div className="grid-area-instances">
          {!instanceFilter && (
            <div
              className="flex flex-wrap justify-start"
              style={{
                gap: `${getMaxGap()}px`,
                maxWidth: "100%",
              }}
            >
              {instances.map((instance) => (
                <InstanceIcon
                  key={instance.id}
                  instance={instance}
                  foundBosses={foundBosses}
                  allBosses={bosses}
                  size={useCompactMode ? "compact" : "normal"}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Separator */}
      <div className="grid-area-separator h-px bg-border" />

      {/* Search Area */}
      <div className="grid-area-search">
        <BossSearch
          bosses={bosses}
          foundBosses={foundBosses}
          onBossFound={onBossFound}
          instanceFilter={instanceFilter}
        />
        <div className="text-sm text-muted-foreground flex justify-end w-full">
          {`${foundBossCount}/${totalBossCount} bosses found`}
        </div>
        <BossList
          bosses={foundBosses}
          allBosses={bosses}
          instances={instances}
          instanceFilter={instanceFilter}
        />
      </div>
    </div>
  )
}

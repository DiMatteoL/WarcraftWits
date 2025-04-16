"use client"

import { ReactNode } from "react"
import { useMedia } from "react-use"
import { SidePanel } from "@/components/side-panel"
import { Tables } from "@/types/database"
import { InstanceWithCompletion } from "@/types/game"

type GameInterfaceProps = {
  // Left side content (map display)
  leftContent: ReactNode;

  // Right side panel props
  expansion: Tables<"expansion">;
  instances: InstanceWithCompletion[];
  bosses: Tables<"npc">[];
  foundBosses: Tables<"npc">[];
  onBossFound: (boss: Tables<"npc">) => void;
  clearHoveredInstance: () => void;

  // Optional props
  instanceName?: string;
  instanceFilter?: string;
  backLink?: string;
  backText?: string;

  // Optional right side content (for custom content)
  rightContent?: ReactNode;

  // Optional footer content (like reset button)
  footerContent?: ReactNode;
}

export function GameInterface({
  leftContent,
  expansion,
  instances,
  bosses,
  foundBosses,
  onBossFound,
  clearHoveredInstance,
  instanceName,
  instanceFilter,
  backLink,
  backText,
  rightContent,
  footerContent
}: GameInterfaceProps) {
  const isDesktop = useMedia('(min-width: 768px)', false)

  // Convert instanceFilter from string to number if it exists
  const numericInstanceFilter = instanceFilter ? parseInt(instanceFilter, 10) : undefined

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" onMouseLeave={() => clearHoveredInstance()}>
      {/* Left side - Map display (75% width) */}
      <div className="w-full md:w-3/4 md:h-screen bg-muted flex flex-col">
        {leftContent}
      </div>

      {/* Right side - Boss tracking using SidePanel or custom content */}
      {rightContent || (
        <SidePanel
          expansion={expansion}
          instances={instances}
          bosses={bosses}
          foundBosses={foundBosses}
          onBossFound={onBossFound}
          clearHoveredInstance={clearHoveredInstance}
          isDesktop={isDesktop}
          instanceName={instanceName}
          instanceFilter={numericInstanceFilter}
          backLink={backLink}
          backText={backText}
        />
      )}

      {/* Footer content (like reset button) */}
      {footerContent}
    </div>
  )
}

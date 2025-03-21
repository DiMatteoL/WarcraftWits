import { create } from "zustand"
import type { Instance } from "@/types/game"

interface HoveredInstanceState {
  hoveredInstanceId: string | null
  hoveredInstance: Instance | null
  setHoveredInstance: (instance: Instance | null) => void
  clearHoveredInstance: () => void
}

// Create the store with proper reset functionality
export const useHoveredInstanceStore = create<HoveredInstanceState>((set) => ({
  hoveredInstanceId: null,
  hoveredInstance: null,
  setHoveredInstance: (instance) => {
    if (instance) {
      set({
        hoveredInstanceId: instance.id,
        hoveredInstance: instance,
      })
    } else {
      set({
        hoveredInstanceId: null,
        hoveredInstance: null,
      })
    }
  },
  clearHoveredInstance: () =>
    set({
      hoveredInstanceId: null,
      hoveredInstance: null,
    }),
}))


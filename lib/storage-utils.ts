import type { Boss } from "@/types/game"
import { STORAGE_KEY, STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION } from "@/lib/constants"

// Define the storage structure with expansion-specific boss lists
export interface FoundBossesStorage {
  // Metadata
  version: number
  lastUpdated: string
  // Data organized by expansion ID
  expansions: {
    [expansionId: string]: {
      bosses: Boss[]
      lastUpdated: string
    }
  }
}

/**
 * Utility functions for managing boss storage
 */
export const BossStorageUtils = {
  /**
   * Initialize storage with default structure
   */
  initializeStorage: (expansionId: string): FoundBossesStorage => {
    return {
      version: CURRENT_STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
      expansions: {
        [expansionId]: {
          bosses: [],
          lastUpdated: new Date().toISOString(),
        },
      },
    }
  },

  /**
   * Get the current storage data
   */
  getStorageData: (): FoundBossesStorage | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null

      return JSON.parse(data) as FoundBossesStorage
    } catch (error) {
      console.error("Failed to get storage data:", error)
      return null
    }
  },

  /**
   * Save storage data
   */
  saveStorageData: (data: FoundBossesStorage): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      localStorage.setItem(STORAGE_VERSION_KEY, data.version.toString())
      return true
    } catch (error) {
      console.error("Failed to save storage data:", error)
      return false
    }
  },

  /**
   * Get bosses for a specific expansion
   */
  getExpansionBosses: (expansionId: string): Boss[] => {
    const storage = BossStorageUtils.getStorageData()
    if (!storage || !storage.expansions[expansionId]) return []

    return storage.expansions[expansionId].bosses
  },

  /**
   * Add a boss to an expansion
   */
  addBossToExpansion: (expansionId: string, boss: Boss): boolean => {
    const storage = BossStorageUtils.getStorageData()
    if (!storage) return false

    // Initialize expansion if it doesn't exist
    if (!storage.expansions[expansionId]) {
      storage.expansions[expansionId] = {
        bosses: [],
        lastUpdated: new Date().toISOString(),
      }
    }

    // Check if boss already exists
    const existingBoss = storage.expansions[expansionId].bosses.find((b) => b.id === boss.id)
    if (existingBoss) return true // Already exists

    // Add boss
    storage.expansions[expansionId].bosses.push(boss)
    storage.expansions[expansionId].lastUpdated = new Date().toISOString()
    storage.lastUpdated = new Date().toISOString()

    return BossStorageUtils.saveStorageData(storage)
  },

  /**
   * Clear all bosses for an expansion
   */
  clearExpansionBosses: (expansionId: string): boolean => {
    const storage = BossStorageUtils.getStorageData()
    if (!storage) return false

    if (storage.expansions[expansionId]) {
      storage.expansions[expansionId].bosses = []
      storage.expansions[expansionId].lastUpdated = new Date().toISOString()
      storage.lastUpdated = new Date().toISOString()
    }

    return BossStorageUtils.saveStorageData(storage)
  },

  /**
   * Clear all storage data
   */
  clearAllData: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error("Failed to clear storage data:", error)
      return false
    }
  },

  /**
   * Get statistics about found bosses
   */
  getStats: () => {
    const storage = BossStorageUtils.getStorageData()
    if (!storage) return { total: 0, byExpansion: {} }

    const byExpansion: Record<string, number> = {}
    let total = 0

    Object.entries(storage.expansions).forEach(([expId, data]) => {
      byExpansion[expId] = data.bosses.length
      total += data.bosses.length
    })

    return {
      total,
      byExpansion,
      lastUpdated: storage.lastUpdated,
    }
  },
}


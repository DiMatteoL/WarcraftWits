"use client"

import { useState, useEffect, useRef } from "react"
import type { Boss } from "@/types/game"
import { STORAGE_KEY, STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION } from "@/lib/constants"

// Define the storage structure with expansion-specific boss lists
interface FoundBossesStorage {
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
 * Hook for managing found bosses with local storage persistence
 * Organizes bosses by expansion to prevent cross-expansion contamination
 */
export function useFoundBosses(expansionId: string) {
  const [foundBosses, setFoundBosses] = useState<Boss[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  // Use ref to avoid dependency cycles in useEffect
  const storageDataRef = useRef<FoundBossesStorage | null>(null)

  // Initialize or load storage data
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Check if we need to migrate from old format
        const storageVersion = localStorage.getItem(STORAGE_VERSION_KEY)
        const storedData = localStorage.getItem(STORAGE_KEY)

        let currentStorage: FoundBossesStorage = {
          version: CURRENT_STORAGE_VERSION,
          lastUpdated: new Date().toISOString(),
          expansions: {},
        }

        if (storedData) {
          if (!storageVersion || Number.parseInt(storageVersion) < CURRENT_STORAGE_VERSION) {
            // Need to migrate from old format
            currentStorage = await migrateStorageData(storedData, currentStorage)
          } else {
            // Already in current format
            try {
              currentStorage = JSON.parse(storedData) as FoundBossesStorage
            } catch (parseError) {
              console.error("Failed to parse stored bosses, initializing new storage:", parseError)
            }
          }
        }

        // Ensure the current expansion exists in storage
        if (!currentStorage.expansions[expansionId]) {
          currentStorage.expansions[expansionId] = {
            bosses: [],
            lastUpdated: new Date().toISOString(),
          }
        }

        // Set state with the loaded or initialized data
        storageDataRef.current = currentStorage
        setFoundBosses(currentStorage.expansions[expansionId]?.bosses || [])

        // Update storage version
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION.toString())
      } catch (error) {
        console.error("Failed to initialize boss storage:", error)
        // Initialize with empty data
        const emptyStorage: FoundBossesStorage = {
          version: CURRENT_STORAGE_VERSION,
          lastUpdated: new Date().toISOString(),
          expansions: {
            [expansionId]: {
              bosses: [],
              lastUpdated: new Date().toISOString(),
            },
          },
        }
        storageDataRef.current = emptyStorage
        setFoundBosses([])
      } finally {
        setIsLoaded(true)
      }
    }

    initializeStorage()
  }, [expansionId])

  // Save found bosses to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        const currentStorage = storageDataRef.current
        if (!currentStorage) return

        // Update the current expansion's bosses in the overall structure
        const updatedStorage: FoundBossesStorage = {
          ...currentStorage,
          lastUpdated: new Date().toISOString(),
          expansions: {
            ...currentStorage.expansions,
            [expansionId]: {
              bosses: foundBosses,
              lastUpdated: new Date().toISOString(),
            },
          },
        }

        // Update the ref without triggering a re-render
        storageDataRef.current = updatedStorage

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStorage))
      } catch (error) {
        console.error("Failed to save found bosses to localStorage:", error)
      }
    }
  }, [foundBosses, isLoaded, expansionId]) // Removed storageData from dependencies

  // Migrate from old storage format to new format
  const migrateStorageData = async (oldData: string, newStorage: FoundBossesStorage): Promise<FoundBossesStorage> => {
    try {
      const parsedData = JSON.parse(oldData)

      // Check if it's the previous format (object with expansion keys)
      if (typeof parsedData === "object" && !Array.isArray(parsedData) && !parsedData.version) {
        // Previous format: { expansionId: Boss[] }
        Object.entries(parsedData).forEach(([expId, bosses]) => {
          newStorage.expansions[expId] = {
            bosses: bosses as Boss[],
            lastUpdated: new Date().toISOString(),
          }
        })
      } else if (Array.isArray(parsedData)) {
        // Legacy format (flat array of bosses)
        // Group by instance name as a best guess for expansion
        const bossGroups: { [instance: string]: Boss[] } = {}

        parsedData.forEach((boss: Boss) => {
          if (!bossGroups[boss.instance]) {
            bossGroups[boss.instance] = []
          }
          bossGroups[boss.instance].push(boss)
        })

        // Place all bosses in the current expansion as a fallback
        // This is imperfect but preserves user data
        newStorage.expansions[expansionId] = {
          bosses: parsedData,
          lastUpdated: new Date().toISOString(),
        }

        console.info("Migrated legacy boss data to new format")
      }

      // Save the migrated data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage))
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION.toString())

      return newStorage
    } catch (error) {
      console.error("Migration failed:", error)
      return newStorage
    }
  }

  // Add a boss to the found bosses list
  const addFoundBoss = (boss: Boss) => {
    if (!foundBosses.some((found) => found.id === boss.id)) {
      setFoundBosses((prev) => [...prev, boss])
    }
  }

  // Remove a boss from the found bosses list
  const removeFoundBoss = (bossId: number) => {
    setFoundBosses((prev) => prev.filter((boss) => boss.id !== bossId))
  }

  // Clear all found bosses for the current expansion
  const clearFoundBosses = () => {
    setFoundBosses([])
  }

  // Get all found bosses across all expansions
  const getAllFoundBosses = (): Boss[] => {
    const storage = storageDataRef.current
    if (!storage) return []

    return Object.values(storage.expansions).flatMap((exp) => exp.bosses)
  }

  // Get found bosses for a specific expansion
  const getExpansionFoundBosses = (expId: string): Boss[] => {
    const storage = storageDataRef.current
    if (!storage || !storage.expansions[expId]) return []

    return storage.expansions[expId].bosses
  }

  // Clear all found bosses across all expansions
  const clearAllFoundBosses = () => {
    const resetStorage: FoundBossesStorage = {
      version: CURRENT_STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
      expansions: {
        [expansionId]: {
          bosses: [],
          lastUpdated: new Date().toISOString(),
        },
      },
    }

    storageDataRef.current = resetStorage
    setFoundBosses([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetStorage))
  }

  // Get statistics about found bosses
  const getFoundBossesStats = () => {
    const storage = storageDataRef.current
    if (!storage) return { total: 0, byExpansion: {} }

    const byExpansion: Record<string, number> = {}
    let total = 0

    Object.entries(storage.expansions).forEach(([expId, data]) => {
      byExpansion[expId] = data.bosses.length
      total += data.bosses.length
    })

    return { total, byExpansion }
  }

  return {
    foundBosses,
    addFoundBoss,
    removeFoundBoss,
    clearFoundBosses,
    clearAllFoundBosses,
    getAllFoundBosses,
    getExpansionFoundBosses,
    getFoundBossesStats,
    isLoaded,
  }
}


"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "react-use";
import type { Boss } from "@/types/game";
import {
  STORAGE_KEY,
  STORAGE_VERSION_KEY,
  CURRENT_STORAGE_VERSION,
} from "@/lib/constants";
import { useReward } from "react-rewards";
import { getRandomEmojis } from "@/lib/wow-emojis";
import { useUserScore } from "@/hooks/use-user-score";

// Define the storage structure with expansion-specific boss lists
interface FoundBossesStorage {
  // Metadata
  version: number;
  lastUpdated: string;
  // Data organized by expansion ID
  expansions: {
    [expansionId: string]: {
      bosses: Boss[];
      lastUpdated: string;
    };
  };
}

/**
 * Hook for managing found bosses with local storage persistence
 * Organizes bosses by expansion to prevent cross-expansion contamination
 */
export function useFoundBosses(expansionId: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageData, setStorageData] = useLocalStorage<FoundBossesStorage>(
    STORAGE_KEY,
    {
      version: CURRENT_STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
      expansions: {},
    }
  );

  const [foundBosses, setFoundBosses] = useState<Boss[]>([]);

  // Use the user score hook to get user ID and high score
  const {
    userId,
    highScore,
    updateHighScore,
    isLoaded: isUserScoreLoaded,
  } = useUserScore(expansionId);

  const { reward } = useReward("reward", "emoji", {
    emoji: getRandomEmojis(),
    elementCount: Math.floor(Math.random() * 6) + 5, // Random number between 5 and 10
    startVelocity: 20,
  });

  // Initialize or load storage data
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Check if we need to migrate from old format
        const storageVersion = localStorage.getItem(STORAGE_VERSION_KEY);

        if (storageData) {
          if (
            !storageVersion ||
            Number.parseInt(storageVersion) < CURRENT_STORAGE_VERSION
          ) {
            // Need to migrate from old format
            const migratedData = await migrateStorageData(
              JSON.stringify(storageData),
              storageData
            );
            setStorageData(migratedData);
          }
        }

        // Ensure the current expansion exists in storage
        if (storageData && !storageData.expansions[expansionId]) {
          const updatedStorage = {
            ...storageData,
            expansions: {
              ...storageData.expansions,
              [expansionId]: {
                bosses: [],
                lastUpdated: new Date().toISOString(),
              },
            },
          };
          setStorageData(updatedStorage);
        }

        // Set state with the loaded or initialized data
        if (storageData) {
          setFoundBosses(storageData.expansions[expansionId]?.bosses || []);
        }

        // Update storage version
        localStorage.setItem(
          STORAGE_VERSION_KEY,
          CURRENT_STORAGE_VERSION.toString()
        );
      } catch (error) {
        console.error("Failed to initialize boss storage:", error);
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
        };
        setStorageData(emptyStorage);
        setFoundBosses([]);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeStorage();
  }, [expansionId, storageData, setStorageData]);

  // Update foundBosses when storageData changes
  useEffect(() => {
    if (storageData && isLoaded) {
      setFoundBosses(storageData.expansions[expansionId]?.bosses || []);
    }
  }, [storageData, expansionId, isLoaded]);

  // Migrate from old storage format to new format
  const migrateStorageData = async (
    oldData: string,
    newStorage: FoundBossesStorage
  ): Promise<FoundBossesStorage> => {
    try {
      const parsedData = JSON.parse(oldData);

      // Check if it's the previous format (object with expansion keys)
      if (
        typeof parsedData === "object" &&
        !Array.isArray(parsedData) &&
        !parsedData.version
      ) {
        // Previous format: { expansionId: Boss[] }
        Object.entries(parsedData).forEach(([expId, bosses]) => {
          newStorage.expansions[expId] = {
            bosses: bosses as Boss[],
            lastUpdated: new Date().toISOString(),
          };
        });
      } else if (Array.isArray(parsedData)) {
        // Legacy format (flat array of bosses)
        // Group by instance name as a best guess for expansion
        const bossGroups: { [instance: string]: Boss[] } = {};

        parsedData.forEach((boss: Boss) => {
          const instanceId = boss.instance_id?.toString() || "unknown";
          if (!bossGroups[instanceId]) {
            bossGroups[instanceId] = [];
          }
          bossGroups[instanceId].push(boss);
        });

        // Place all bosses in the current expansion as a fallback
        // This is imperfect but preserves user data
        newStorage.expansions[expansionId] = {
          bosses: parsedData,
          lastUpdated: new Date().toISOString(),
        };

        console.info("Migrated legacy boss data to new format");
      }

      // Save the migrated data
      localStorage.setItem(
        STORAGE_VERSION_KEY,
        CURRENT_STORAGE_VERSION.toString()
      );

      return newStorage;
    } catch (error) {
      console.error("Migration failed:", error);
      return newStorage;
    }
  };

  // Add a boss to the found bosses list
  const addFoundBoss = (boss: Boss) => {
    if (!foundBosses.some((found) => found.id === boss.id)) {
      reward();

      const updatedBosses = [...foundBosses, boss];
      setFoundBosses(updatedBosses);

      if (storageData) {
        const updatedStorage = {
          ...storageData,
          lastUpdated: new Date().toISOString(),
          expansions: {
            ...storageData.expansions,
            [expansionId]: {
              bosses: updatedBosses,
              lastUpdated: new Date().toISOString(),
            },
          },
        };
        setStorageData(updatedStorage);

        // Update high score based on the number of found bosses
        updateHighScore(updatedBosses.length);
      }
    }
  };

  // Remove a boss from the found bosses list
  const removeFoundBoss = (bossId: number) => {
    const updatedBosses = foundBosses.filter((boss) => boss.id !== bossId);
    setFoundBosses(updatedBosses);

    if (storageData) {
      const updatedStorage = {
        ...storageData,
        lastUpdated: new Date().toISOString(),
        expansions: {
          ...storageData.expansions,
          [expansionId]: {
            bosses: updatedBosses,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      setStorageData(updatedStorage);

      // Update high score based on the number of found bosses
      updateHighScore(updatedBosses.length);
    }
  };

  // Clear all found bosses for the current expansion
  const clearFoundBosses = () => {
    setFoundBosses([]);

    if (storageData) {
      const updatedStorage = {
        ...storageData,
        lastUpdated: new Date().toISOString(),
        expansions: {
          ...storageData.expansions,
          [expansionId]: {
            bosses: [],
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      setStorageData(updatedStorage);

      // Update high score to 0
      updateHighScore(0);
    }
  };

  // Get all found bosses across all expansions
  const getAllFoundBosses = (): Boss[] => {
    if (!storageData) return [];

    return Object.values(storageData.expansions).flatMap((exp) => exp.bosses);
  };

  // Get found bosses for a specific expansion
  const getExpansionFoundBosses = (expId: string): Boss[] => {
    if (!storageData || !storageData.expansions[expId]) return [];

    return storageData.expansions[expId].bosses;
  };

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
    };

    setStorageData(resetStorage);
    setFoundBosses([]);

    // Update high score to 0
    updateHighScore(0);
  };

  // Get statistics about found bosses
  const getFoundBossesStats = () => {
    if (!storageData) return { total: 0, byExpansion: {} };

    const byExpansion: Record<string, number> = {};
    let total = 0;

    Object.entries(storageData.expansions).forEach(([expId, data]) => {
      byExpansion[expId] = data.bosses.length;
      total += data.bosses.length;
    });

    return { total, byExpansion };
  };

  return {
    foundBosses,
    addFoundBoss,
    removeFoundBoss,
    clearFoundBosses,
    clearAllFoundBosses,
    getAllFoundBosses,
    getExpansionFoundBosses,
    getFoundBossesStats,
    isLoaded: isLoaded && isUserScoreLoaded,
    userId,
    highScore,
  };
}

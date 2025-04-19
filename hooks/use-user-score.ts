"use client";

import { useState, useEffect } from "react";
import { BOSS_MEMORY_GAME_TYPE, USER_ID_STORAGE_KEY } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

/**
 * Hook for managing user ID and high scores
 */
export function useUserScore(expansionId: string) {
  const [userId, setUserId] = useState<string>("");
  const [highScore, setHighScore] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load user ID from localStorage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          // Only generate a new ID if one doesn't exist
          const newUserId = generateUUID();
          localStorage.setItem(USER_ID_STORAGE_KEY, newUserId);
          setUserId(newUserId);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load user ID:", error);
        setIsLoaded(true);
      }
    };

    loadUserId();
  }, [expansionId]);

  // Load high score from localStorage
  useEffect(() => {
    if (!userId) return;

    const loadHighScore = () => {
      try {
        const highScoreKey = `${BOSS_MEMORY_GAME_TYPE}-score-${expansionId}`;
        const storedHighScore = localStorage.getItem(highScoreKey);

        if (storedHighScore) {
          setHighScore(parseInt(storedHighScore, 10));
        }
      } catch (error) {
        console.error("Failed to load high score:", error);
      }
    };

    loadHighScore();
  }, [userId, expansionId]);

  // Update high score in both localStorage and Supabase
  const updateHighScore = async (score: number) => {
    if (score > highScore) {
      setHighScore(score);

      try {
        // Update localStorage
        const highScoreKey = `${BOSS_MEMORY_GAME_TYPE}-score-${expansionId}`;
        localStorage.setItem(highScoreKey, score.toString());

        // Only update Supabase if score is greater than 0
        if (score > 0) {
          setIsSyncing(true);

          const { data: existingRecord, error: checkError } = await supabase
            .from("score")
            .select("*")
            .eq("identifier", userId)
            .maybeSingle();

          if (checkError) {
            console.error("Error checking for existing record:", checkError);
          } else if (!existingRecord) {
            console.log("Record not found, creating new record");
            // Record doesn't exist, create it
            const { error: insertError } = await supabase.from("score").insert({
              identifier: userId,
              personal_best: score,
              expansion_slug: expansionId,
              game_name: BOSS_MEMORY_GAME_TYPE,
            });

            if (insertError) {
              console.error("Error inserting new record:", insertError);
            } else {
              console.log("Successfully created new record");
            }
          } else {
            console.log("Record found, updating with score:", score);
            // Record exists, update it
            const { data, error } = await supabase
              .from("score")
              .update({ personal_best: score })
              .eq("identifier", userId)
              .eq("game_name", BOSS_MEMORY_GAME_TYPE)
              .eq("expansion_slug", expansionId);

            console.log("Update result:", { data, error });

            if (error) {
              console.error("Error updating score:", error);
            } else {
              console.log("Successfully updated score");
            }
          }
        }
      } catch (error) {
        console.error("Failed to save high score:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Generate a UUID v4
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  return {
    userId,
    highScore,
    updateHighScore,
    isLoaded,
    isSyncing,
  };
}

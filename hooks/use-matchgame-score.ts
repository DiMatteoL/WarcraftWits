"use client";

import { useState, useEffect } from "react";
import { USER_ID_STORAGE_KEY } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

/**
 * Hook for managing matchgame high scores in local storage and Supabase
 */
export function useMinigameScore(expansionSlug: string | null) {
  const [highScore, setHighScore] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

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
      } catch (error) {
        console.error("Failed to load user ID:", error);
      }
    };

    loadUserId();
  }, []);

  // Load high score from localStorage
  useEffect(() => {
    const loadHighScore = () => {
      try {
        const highScoreKey = `wow-memory-matchgame-high-score-${expansionSlug}`;
        const storedHighScore = localStorage.getItem(highScoreKey);

        if (storedHighScore) {
          setHighScore(parseInt(storedHighScore, 10));
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load matchgame high score:", error);
        setIsLoaded(true);
      }
    };

    loadHighScore();
  }, [expansionSlug]);

  // Update high score in localStorage and Supabase
  const updateHighScore = async (score: number) => {
    if (score > highScore) {
      setHighScore(score);

      try {
        // Update localStorage
        const highScoreKey = `wow-memory-matchgame-high-score-${expansionSlug}`;
        localStorage.setItem(highScoreKey, score.toString());

        // Only update Supabase if score is greater than 0 and we have a userId
        if (score > 0 && userId && expansionSlug) {
          setIsSyncing(true);

          // First check if the record exists
          const identifier = `${userId}-${expansionSlug}-matchgame`;
          console.log(
            "Checking for matchgame record with identifier:",
            identifier
          );

          const { data: existingRecord, error: checkError } = await supabase
            .from("score")
            .select("*")
            .eq("identifier", identifier)
            .maybeSingle();

          if (checkError) {
            console.error(
              "Error checking for existing matchgame record:",
              checkError
            );
          } else if (!existingRecord) {
            console.log("Matchgame record not found, creating new record");
            // Record doesn't exist, create it
            const { error: insertError } = await supabase.from("score").insert({
              identifier: identifier,
              personal_best: score,
              expansion_slug: expansionSlug,
              game_name: "match-the-instance",
            });

            if (insertError) {
              console.error(
                "Error inserting new matchgame record:",
                insertError
              );
            } else {
              console.log("Successfully created new matchgame record");
            }
          } else {
            console.log("Matchgame record found, updating with score:", score);
            // Record exists, update it
            const { data, error } = await supabase
              .from("score")
              .update({ personal_best: score })
              .eq("identifier", identifier);

            console.log("Update result:", { data, error });

            if (error) {
              console.error("Error updating matchgame score:", error);
            } else {
              console.log("Successfully updated matchgame score");
            }
          }
        }
      } catch (error) {
        console.error("Failed to save matchgame high score:", error);
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
    highScore,
    updateHighScore,
    isLoaded,
    isSyncing,
  };
}

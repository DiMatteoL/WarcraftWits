"use client";

import { useEffect, useState } from "react";
import { USER_ID_STORAGE_KEY } from "@/lib/constants";
import { UserProfileDisplay } from "./user-profile-display";

export function UserProfileTitle() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return <UserProfileDisplay userId={userId} hasTitle />;
}

"use client";

import { useMemo } from "react";
import { generateUniqueNameFromUUID, generateEmojiFromText } from "@/utils/utils";

interface UserProfileDisplayProps {
  userId: string;
  hasTitle?: boolean;
}

export function UserProfileDisplay({ userId, hasTitle = false }: UserProfileDisplayProps) {
  const userName = useMemo(() => generateUniqueNameFromUUID(userId), [userId]);
  const emoji = useMemo(() => generateEmojiFromText(userName), [userName]);

  return (
    <div className="group relative">
      {hasTitle && <div className="text-xs text-muted-foreground/60 mb-1">your username</div>}
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors justify-between">
        <span className="text-base">{emoji}</span>
        <span className="text-muted-foreground capitalize">
          {userName || "New User"}
        </span>
      </div>
    </div>
  );
}

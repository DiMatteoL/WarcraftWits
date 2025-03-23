import { Tables } from "@/types/database";

export type Expansion = Tables<"expansion">;
export type Instance = Tables<"instance">;
export type Map = Tables<"map">;
export type Boss = Tables<"npc">;

export interface InstanceWithCompletion extends Instance {
  calculatedCompletionRate: number;
}

export interface GameData {
  [expansionId: string]: Expansion;
}

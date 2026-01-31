import { Tables } from "@/types/database";

export type Expansion = Tables<"ww_expansion">;
export type Instance = Tables<"ww_instance">;
export type Map = Tables<"ww_map">;
export type Boss = Tables<"ww_npc">;

export interface InstanceWithCompletion extends Instance {
  calculatedCompletionRate: number;
}

export interface GameData {
  [expansionId: string]: Expansion;
}

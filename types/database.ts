export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      expansion: {
        Row: {
          background_uri: string | null
          created_at: string
          id: number
          is_active: boolean
          logo_uri: string | null
          name: string | null
          release_date: string | null
          slug: string | null
        }
        Insert: {
          background_uri?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          logo_uri?: string | null
          name?: string | null
          release_date?: string | null
          slug?: string | null
        }
        Update: {
          background_uri?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          logo_uri?: string | null
          name?: string | null
          release_date?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      instance: {
        Row: {
          backgroud_uri: string | null
          created_at: string
          expansion_id: number
          id: number
          is_default: boolean
          logo_uri: string | null
          max_level: number | null
          min_level: number | null
          name: string | null
          player_limit: number | null
          slug: string | null
        }
        Insert: {
          backgroud_uri?: string | null
          created_at?: string
          expansion_id: number
          id?: number
          is_default?: boolean
          logo_uri?: string | null
          max_level?: number | null
          min_level?: number | null
          name?: string | null
          player_limit?: number | null
          slug?: string | null
        }
        Update: {
          backgroud_uri?: string | null
          created_at?: string
          expansion_id?: number
          id?: number
          is_default?: boolean
          logo_uri?: string | null
          max_level?: number | null
          min_level?: number | null
          name?: string | null
          player_limit?: number | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instance_expansion_id_fkey"
            columns: ["expansion_id"]
            isOneToOne: false
            referencedRelation: "expansion"
            referencedColumns: ["id"]
          },
        ]
      }
      map: {
        Row: {
          created_at: string
          expansion_id: number | null
          height_in_px: number | null
          id: number
          index: number | null
          instance_id: number | null
          name: string | null
          uri: string | null
          width_in_px: number | null
        }
        Insert: {
          created_at?: string
          expansion_id?: number | null
          height_in_px?: number | null
          id?: number
          index?: number | null
          instance_id?: number | null
          name?: string | null
          uri?: string | null
          width_in_px?: number | null
        }
        Update: {
          created_at?: string
          expansion_id?: number | null
          height_in_px?: number | null
          id?: number
          index?: number | null
          instance_id?: number | null
          name?: string | null
          uri?: string | null
          width_in_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "map_expansion_id_fkey"
            columns: ["expansion_id"]
            isOneToOne: false
            referencedRelation: "expansion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instance"
            referencedColumns: ["id"]
          },
        ]
      }
      npc: {
        Row: {
          background_uri: string | null
          created_at: string
          id: number
          index: number | null
          instance_id: number | null
          level: number | null
          logo_uri: string | null
          name: string | null
          pin_id: number | null
          slug: string | null
        }
        Insert: {
          background_uri?: string | null
          created_at?: string
          id?: number
          index?: number | null
          instance_id?: number | null
          level?: number | null
          logo_uri?: string | null
          name?: string | null
          pin_id?: number | null
          slug?: string | null
        }
        Update: {
          background_uri?: string | null
          created_at?: string
          id?: number
          index?: number | null
          instance_id?: number | null
          level?: number | null
          logo_uri?: string | null
          name?: string | null
          pin_id?: number | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "npc_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "npc_pin_id_fkey"
            columns: ["pin_id"]
            isOneToOne: false
            referencedRelation: "pin"
            referencedColumns: ["id"]
          },
        ]
      }
      pin: {
        Row: {
          created_at: string
          id: number
          instance_id: number | null
          logo_uri: string | null
          map_id: number | null
          npc_id: number | null
          x_percent: number | null
          y_percent: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          instance_id?: number | null
          logo_uri?: string | null
          map_id?: number | null
          npc_id?: number | null
          x_percent?: number | null
          y_percent?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          instance_id?: number | null
          logo_uri?: string | null
          map_id?: number | null
          npc_id?: number | null
          x_percent?: number | null
          y_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pin_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "instance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pin_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pin_npc_id_fkey"
            columns: ["npc_id"]
            isOneToOne: false
            referencedRelation: "npc"
            referencedColumns: ["id"]
          },
        ]
      }
      score: {
        Row: {
          created_at: string
          expansion_slug: string
          game_name: string | null
          id: number
          identifier: string | null
          personal_best: number | null
        }
        Insert: {
          created_at?: string
          expansion_slug: string
          game_name?: string | null
          id?: number
          identifier?: string | null
          personal_best?: number | null
        }
        Update: {
          created_at?: string
          expansion_slug?: string
          game_name?: string | null
          id?: number
          identifier?: string | null
          personal_best?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

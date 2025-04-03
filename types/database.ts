Need to install the following packages:
supabase@2.20.5
Ok to proceed? (y) export type Json =
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
          logo_uri: string | null
          name: string | null
          release_date: string | null
          slug: string | null
        }
        Insert: {
          background_uri?: string | null
          created_at?: string
          id?: number
          logo_uri?: string | null
          name?: string | null
          release_date?: string | null
          slug?: string | null
        }
        Update: {
          background_uri?: string | null
          created_at?: string
          id?: number
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
          instance_id: number
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
          instance_id: number
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
          instance_id?: number
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
          logo_uri: string | null
          map_id: number | null
          x_percent: number | null
          y_percent: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          logo_uri?: string | null
          map_id?: number | null
          x_percent?: number | null
          y_percent?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          logo_uri?: string | null
          map_id?: number | null
          x_percent?: number | null
          y_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pin_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

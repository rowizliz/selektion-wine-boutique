export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      birthday_gift_requests: {
        Row: {
          additional_notes: string | null
          birthday_message: string | null
          budget: string | null
          created_at: string
          cuisine_types: string[] | null
          favorite_colors: string[] | null
          food_allergies: string | null
          hobbies: string[] | null
          id: string
          music_genres: string[] | null
          recipient_birthday: string | null
          recipient_gender: string | null
          recipient_name: string
          relationship: string | null
          sender_name: string
          sender_phone: string
          status: string
          style_preferences: string[] | null
          taste_preferences: string[] | null
          tracking_token: string
          updated_at: string
          wine_style: string | null
          wine_types: string[] | null
        }
        Insert: {
          additional_notes?: string | null
          birthday_message?: string | null
          budget?: string | null
          created_at?: string
          cuisine_types?: string[] | null
          favorite_colors?: string[] | null
          food_allergies?: string | null
          hobbies?: string[] | null
          id?: string
          music_genres?: string[] | null
          recipient_birthday?: string | null
          recipient_gender?: string | null
          recipient_name: string
          relationship?: string | null
          sender_name: string
          sender_phone: string
          status?: string
          style_preferences?: string[] | null
          taste_preferences?: string[] | null
          tracking_token?: string
          updated_at?: string
          wine_style?: string | null
          wine_types?: string[] | null
        }
        Update: {
          additional_notes?: string | null
          birthday_message?: string | null
          budget?: string | null
          created_at?: string
          cuisine_types?: string[] | null
          favorite_colors?: string[] | null
          food_allergies?: string | null
          hobbies?: string[] | null
          id?: string
          music_genres?: string[] | null
          recipient_birthday?: string | null
          recipient_gender?: string | null
          recipient_name?: string
          relationship?: string | null
          sender_name?: string
          sender_phone?: string
          status?: string
          style_preferences?: string[] | null
          taste_preferences?: string[] | null
          tracking_token?: string
          updated_at?: string
          wine_style?: string | null
          wine_types?: string[] | null
        }
        Relationships: []
      }
      personalized_wine_requests: {
        Row: {
          additional_notes: string | null
          budget_range: string | null
          created_at: string
          cuisine_types: string[] | null
          customer_name: string
          hobbies: string[] | null
          id: string
          music_genres: string[] | null
          occasions: string[] | null
          phone: string
          recommendation_message: string | null
          recommendation_published_at: string | null
          status: string
          taste_spicy_level: number | null
          taste_sweet_level: number | null
          tracking_token: string
          updated_at: string
          wine_styles: string[] | null
          wine_types: string[] | null
        }
        Insert: {
          additional_notes?: string | null
          budget_range?: string | null
          created_at?: string
          cuisine_types?: string[] | null
          customer_name: string
          hobbies?: string[] | null
          id?: string
          music_genres?: string[] | null
          occasions?: string[] | null
          phone: string
          recommendation_message?: string | null
          recommendation_published_at?: string | null
          status?: string
          taste_spicy_level?: number | null
          taste_sweet_level?: number | null
          tracking_token?: string
          updated_at?: string
          wine_styles?: string[] | null
          wine_types?: string[] | null
        }
        Update: {
          additional_notes?: string | null
          budget_range?: string | null
          created_at?: string
          cuisine_types?: string[] | null
          customer_name?: string
          hobbies?: string[] | null
          id?: string
          music_genres?: string[] | null
          occasions?: string[] | null
          phone?: string
          recommendation_message?: string | null
          recommendation_published_at?: string | null
          status?: string
          taste_spicy_level?: number | null
          taste_sweet_level?: number | null
          tracking_token?: string
          updated_at?: string
          wine_styles?: string[] | null
          wine_types?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wine_recommendations: {
        Row: {
          created_at: string
          display_order: number
          id: string
          recommendation_reason: string | null
          request_id: string
          wine_id: string
          wine_image_url: string | null
          wine_name: string
          wine_price: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          recommendation_reason?: string | null
          request_id: string
          wine_id: string
          wine_image_url?: string | null
          wine_name: string
          wine_price: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          recommendation_reason?: string | null
          request_id?: string
          wine_id?: string
          wine_image_url?: string | null
          wine_name?: string
          wine_price?: string
        }
        Relationships: [
          {
            foreignKeyName: "wine_recommendations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "personalized_wine_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      wines: {
        Row: {
          acidity: number | null
          alcohol: string | null
          body: number | null
          category: string
          created_at: string
          description: string
          fizzy: number | null
          flavor_notes: string[] | null
          grapes: string
          id: string
          image_url: string | null
          name: string
          origin: string
          pairing: string | null
          price: string
          region: string | null
          story: string | null
          sweetness: number | null
          tannin: number | null
          tasting_notes: string | null
          temperature: string | null
          updated_at: string
          vintage: string | null
        }
        Insert: {
          acidity?: number | null
          alcohol?: string | null
          body?: number | null
          category: string
          created_at?: string
          description: string
          fizzy?: number | null
          flavor_notes?: string[] | null
          grapes: string
          id?: string
          image_url?: string | null
          name: string
          origin: string
          pairing?: string | null
          price: string
          region?: string | null
          story?: string | null
          sweetness?: number | null
          tannin?: number | null
          tasting_notes?: string | null
          temperature?: string | null
          updated_at?: string
          vintage?: string | null
        }
        Update: {
          acidity?: number | null
          alcohol?: string | null
          body?: number | null
          category?: string
          created_at?: string
          description?: string
          fizzy?: number | null
          flavor_notes?: string[] | null
          grapes?: string
          id?: string
          image_url?: string | null
          name?: string
          origin?: string
          pairing?: string | null
          price?: string
          region?: string | null
          story?: string | null
          sweetness?: number | null
          tannin?: number | null
          tasting_notes?: string | null
          temperature?: string | null
          updated_at?: string
          vintage?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_birthday_gift_request_status: {
        Args: { p_tracking_token: string }
        Returns: {
          created_at: string
          recipient_name: string
          sender_name: string
          status: string
          tracking_token: string
        }[]
      }
      get_personalized_wine_request_status: {
        Args: { p_tracking_token: string }
        Returns: {
          created_at: string
          customer_name: string
          status: string
          tracking_token: string
        }[]
      }
      get_wine_recommendation_by_token: {
        Args: { p_tracking_token: string }
        Returns: {
          customer_name: string
          recommendation_message: string
          recommendation_published_at: string
          request_id: string
          wines: Json
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

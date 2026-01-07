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
      collaborator_applications: {
        Row: {
          address: string | null
          admin_notes: string | null
          created_at: string
          cv_url: string | null
          date_of_birth: string | null
          email: string
          experience: string | null
          full_name: string
          id: string
          motivation: string | null
          occupation: string | null
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          created_at?: string
          cv_url?: string | null
          date_of_birth?: string | null
          email: string
          experience?: string | null
          full_name: string
          id?: string
          motivation?: string | null
          occupation?: string | null
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          created_at?: string
          cv_url?: string | null
          date_of_birth?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          motivation?: string | null
          occupation?: string | null
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaborator_order_items: {
        Row: {
          collaborator_price: number
          created_at: string
          id: string
          order_id: string
          original_price: number
          quantity: number
          wine_id: string | null
          wine_name: string
        }
        Insert: {
          collaborator_price: number
          created_at?: string
          id?: string
          order_id: string
          original_price: number
          quantity?: number
          wine_id?: string | null
          wine_name: string
        }
        Update: {
          collaborator_price?: number
          created_at?: string
          id?: string
          order_id?: string
          original_price?: number
          quantity?: number
          wine_id?: string | null
          wine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "collaborator_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborator_order_items_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborator_orders: {
        Row: {
          collaborator_id: string
          commission_added: boolean
          commission_amount: number
          created_at: string
          customer_address: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          collaborator_id: string
          commission_added?: boolean
          commission_amount?: number
          created_at?: string
          customer_address?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          collaborator_id?: string
          commission_added?: boolean
          commission_amount?: number
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_orders_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborator_profile_updates: {
        Row: {
          admin_notes: string | null
          collaborator_id: string
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          requested_avatar_url: string | null
          requested_bank_account_holder: string | null
          requested_bank_account_number: string | null
          requested_bank_name: string | null
          requested_name: string | null
          requested_phone: string | null
          requested_qr_code_url: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          collaborator_id: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_avatar_url?: string | null
          requested_bank_account_holder?: string | null
          requested_bank_account_number?: string | null
          requested_bank_name?: string | null
          requested_name?: string | null
          requested_phone?: string | null
          requested_qr_code_url?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          collaborator_id?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_avatar_url?: string | null
          requested_bank_account_holder?: string | null
          requested_bank_account_number?: string | null
          requested_bank_name?: string | null
          requested_name?: string | null
          requested_phone?: string | null
          requested_qr_code_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_profile_updates_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborators: {
        Row: {
          avatar_url: string | null
          bank_account_holder: string | null
          bank_account_number: string | null
          bank_name: string | null
          created_at: string
          discount_percent: number
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          qr_code_url: string | null
          updated_at: string
          user_id: string | null
          wallet_balance: number
        }
        Insert: {
          avatar_url?: string | null
          bank_account_holder?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          discount_percent?: number
          email: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          qr_code_url?: string | null
          updated_at?: string
          user_id?: string | null
          wallet_balance?: number
        }
        Update: {
          avatar_url?: string | null
          bank_account_holder?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string
          discount_percent?: number
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          qr_code_url?: string | null
          updated_at?: string
          user_id?: string | null
          wallet_balance?: number
        }
        Relationships: []
      }
      commission_tiers: {
        Row: {
          commission_percent: number
          created_at: string
          id: string
          max_quantity: number | null
          min_quantity: number
          updated_at: string
        }
        Insert: {
          commission_percent: number
          created_at?: string
          id?: string
          max_quantity?: number | null
          min_quantity: number
          updated_at?: string
        }
        Update: {
          commission_percent?: number
          created_at?: string
          id?: string
          max_quantity?: number | null
          min_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_invitations: {
        Row: {
          agenda: string | null
          cover_image_url: string | null
          created_at: string
          dress_code: string | null
          event_date: string
          id: string
          location: string
          location_url: string | null
          message: string | null
          pin_code: string
          title: string
          updated_at: string
          url_slug: string
        }
        Insert: {
          agenda?: string | null
          cover_image_url?: string | null
          created_at?: string
          dress_code?: string | null
          event_date: string
          id?: string
          location: string
          location_url?: string | null
          message?: string | null
          pin_code: string
          title: string
          updated_at?: string
          url_slug: string
        }
        Update: {
          agenda?: string | null
          cover_image_url?: string | null
          created_at?: string
          dress_code?: string | null
          event_date?: string
          id?: string
          location?: string
          location_url?: string | null
          message?: string | null
          pin_code?: string
          title?: string
          updated_at?: string
          url_slug?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          purchase_price: number
          quantity_in_stock: number
          updated_at: string
          wine_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          purchase_price?: number
          quantity_in_stock?: number
          updated_at?: string
          wine_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          purchase_price?: number
          quantity_in_stock?: number
          updated_at?: string
          wine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "inventory_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: true
            referencedRelation: "wines"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_profiles: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invitation_rsvps: {
        Row: {
          attending: boolean
          checked_in_at: string | null
          created_at: string
          guest_count: number | null
          guest_name: string
          id: string
          invitation_id: string
          note: string | null
          phone: string | null
        }
        Insert: {
          attending?: boolean
          checked_in_at?: string | null
          created_at?: string
          guest_count?: number | null
          guest_name: string
          id?: string
          invitation_id: string
          note?: string | null
          phone?: string | null
        }
        Update: {
          attending?: boolean
          checked_in_at?: string | null
          created_at?: string
          guest_count?: number | null
          guest_name?: string
          id?: string
          invitation_id?: string
          note?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "event_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          purchase_price: number
          quantity: number
          unit_price: number
          wine_id: string | null
          wine_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          purchase_price?: number
          quantity?: number
          unit_price: number
          wine_id?: string | null
          wine_name: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          purchase_price?: number
          quantity?: number
          unit_price?: number
          wine_id?: string | null
          wine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          customer_phone: string | null
          discount: number
          id: string
          notes: string | null
          order_type: string
          profile_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_phone?: string | null
          discount?: number
          id?: string
          notes?: string | null
          order_type?: string
          profile_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_phone?: string | null
          discount?: number
          id?: string
          notes?: string | null
          order_type?: string
          profile_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "inventory_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      password_change_requests: {
        Row: {
          admin_notes: string | null
          collaborator_id: string
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          collaborator_id: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          collaborator_id?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_change_requests_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
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
          url_slug: string | null
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
          url_slug?: string | null
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
          url_slug?: string | null
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
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          collaborator_id: string
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          status: string
          transfer_proof_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          collaborator_id: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          transfer_proof_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          collaborator_id?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          transfer_proof_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
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
      get_invitation_by_slug_with_pin: {
        Args: { p_pin_code: string; p_url_slug: string }
        Returns: {
          agenda: string
          cover_image_url: string
          dress_code: string
          event_date: string
          id: string
          location: string
          location_url: string
          message: string
          title: string
          url_slug: string
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
      get_wine_recommendation_by_slug: {
        Args: { p_url_slug: string }
        Returns: {
          customer_name: string
          recommendation_message: string
          recommendation_published_at: string
          request_id: string
          wines: Json
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
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_collaborator: { Args: never; Returns: boolean }
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

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
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: true
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          destination_slug: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          service_slug: string | null
          slug: string
          status: string
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          destination_slug?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          service_slug?: string | null
          slug: string
          status?: string
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          destination_slug?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          service_slug?: string | null
          slug?: string
          status?: string
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number
          booking_code: string
          created_at: string
          destination: string
          id: string
          provider_id: string | null
          status: string
          travel_date: string | null
          traveler_email: string | null
          traveler_name: string
          updated_at: string
        }
        Insert: {
          amount?: number
          booking_code: string
          created_at?: string
          destination: string
          id?: string
          provider_id?: string | null
          status?: string
          travel_date?: string | null
          traveler_email?: string | null
          traveler_name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_code?: string
          created_at?: string
          destination?: string
          id?: string
          provider_id?: string | null
          status?: string
          travel_date?: string | null
          traveler_email?: string | null
          traveler_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          provider_id: string
          rate: number
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          provider_id: string
          rate: number
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          provider_id?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          avg_flight_price: number | null
          avg_hotel_price: number | null
          avg_insurance_price: number | null
          climate: Json | null
          common_scams: Json | null
          continent: string
          cost_of_living_index: number | null
          country: string
          created_at: string
          currency: string | null
          description: string | null
          documents_required: Json | null
          faq: Json | null
          healthcare_info: string | null
          hero_image: string | null
          id: string
          internet_info: string | null
          is_featured: boolean | null
          language: string | null
          name: string
          neighborhoods: Json | null
          safety_index: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          timezone: string | null
          transport_info: string | null
          updated_at: string
          visa_info: Json | null
          visa_required: boolean | null
        }
        Insert: {
          avg_flight_price?: number | null
          avg_hotel_price?: number | null
          avg_insurance_price?: number | null
          climate?: Json | null
          common_scams?: Json | null
          continent?: string
          cost_of_living_index?: number | null
          country: string
          created_at?: string
          currency?: string | null
          description?: string | null
          documents_required?: Json | null
          faq?: Json | null
          healthcare_info?: string | null
          hero_image?: string | null
          id?: string
          internet_info?: string | null
          is_featured?: boolean | null
          language?: string | null
          name: string
          neighborhoods?: Json | null
          safety_index?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          timezone?: string | null
          transport_info?: string | null
          updated_at?: string
          visa_info?: Json | null
          visa_required?: boolean | null
        }
        Update: {
          avg_flight_price?: number | null
          avg_hotel_price?: number | null
          avg_insurance_price?: number | null
          climate?: Json | null
          common_scams?: Json | null
          continent?: string
          cost_of_living_index?: number | null
          country?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          documents_required?: Json | null
          faq?: Json | null
          healthcare_info?: string | null
          hero_image?: string | null
          id?: string
          internet_info?: string | null
          is_featured?: boolean | null
          language?: string | null
          name?: string
          neighborhoods?: Json | null
          safety_index?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          timezone?: string | null
          transport_info?: string | null
          updated_at?: string
          visa_info?: Json | null
          visa_required?: boolean | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          commission_rate: number
          created_at: string
          id: string
          name: string
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          id?: string
          name: string
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          id?: string
          name?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          faq: Json | null
          features: Json | null
          hero_image: string | null
          how_it_works: Json | null
          icon: string | null
          id: string
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          faq?: Json | null
          features?: Json | null
          hero_image?: string | null
          how_it_works?: Json | null
          icon?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          faq?: Json | null
          features?: Json | null
          hero_image?: string | null
          how_it_works?: Json | null
          icon?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          created_at: string
          destination: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          name: string
          rating: number
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          created_at?: string
          destination?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          name: string
          rating?: number
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          created_at?: string
          destination?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          name?: string
          rating?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_login: {
        Args: { p_password: string; p_username: string }
        Returns: Json
      }
      admin_logout: { Args: { p_session_token: string }; Returns: undefined }
      admin_update_provider_status: {
        Args: {
          p_provider_id: string
          p_session_token: string
          p_status: string
        }
        Returns: Json
      }
      admin_validate_session: {
        Args: { p_session_token: string }
        Returns: Json
      }
      get_dashboard_stats: { Args: never; Returns: Json }
      is_admin_session: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

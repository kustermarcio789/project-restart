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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          automation_type: string
          channel: string
          created_at: string | null
          executed_at: string | null
          id: string
          lead_id: string | null
          payload: Json | null
          result: Json | null
          status: string | null
        }
        Insert: {
          automation_type: string
          channel: string
          created_at?: string | null
          executed_at?: string | null
          id?: string
          lead_id?: string | null
          payload?: Json | null
          result?: Json | null
          status?: string | null
        }
        Update: {
          automation_type?: string
          channel?: string
          created_at?: string | null
          executed_at?: string | null
          id?: string
          lead_id?: string | null
          payload?: Json | null
          result?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      cost_simulator_presets: {
        Row: {
          avg_cost_brl: number
          avg_cost_eur: number | null
          avg_cost_usd: number | null
          category: string
          created_at: string
          destination_slug: string
          id: string
          item_name: string
          notes: string | null
        }
        Insert: {
          avg_cost_brl?: number
          avg_cost_eur?: number | null
          avg_cost_usd?: number | null
          category: string
          created_at?: string
          destination_slug: string
          id?: string
          item_name: string
          notes?: string | null
        }
        Update: {
          avg_cost_brl?: number
          avg_cost_eur?: number | null
          avg_cost_usd?: number | null
          category?: string
          created_at?: string
          destination_slug?: string
          id?: string
          item_name?: string
          notes?: string | null
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
      favorites: {
        Row: {
          created_at: string
          destination_slug: string | null
          id: string
          service_slug: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_slug?: string | null
          id?: string
          service_slug?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          destination_slug?: string | null
          id?: string
          service_slug?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journey_milestones: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          lead_id: string | null
          milestone_key: string
          sort_order: number | null
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          milestone_key: string
          sort_order?: number | null
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          milestone_key?: string
          sort_order?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_milestones_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          channel: string | null
          created_at: string
          created_by: string | null
          description: string | null
          event_type: string
          id: string
          lead_id: string
          metadata: Json | null
        }
        Insert: {
          channel?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_type: string
          id?: string
          lead_id: string
          metadata?: Json | null
        }
        Update: {
          channel?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_type?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          created_at: string
          destination_slug: string | null
          email: string | null
          id: string
          landing_page: string | null
          last_interaction_at: string | null
          lost_reason: string | null
          message: string | null
          name: string
          next_followup_at: string | null
          notes: string | null
          phone: string | null
          referrer: string | null
          score: number | null
          service_type: string | null
          source: string | null
          stage: string
          temperature: string | null
          travel_date_from: string | null
          travel_date_to: string | null
          travelers_count: number | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          created_at?: string
          destination_slug?: string | null
          email?: string | null
          id?: string
          landing_page?: string | null
          last_interaction_at?: string | null
          lost_reason?: string | null
          message?: string | null
          name: string
          next_followup_at?: string | null
          notes?: string | null
          phone?: string | null
          referrer?: string | null
          score?: number | null
          service_type?: string | null
          source?: string | null
          stage?: string
          temperature?: string | null
          travel_date_from?: string | null
          travel_date_to?: string | null
          travelers_count?: number | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          created_at?: string
          destination_slug?: string | null
          email?: string | null
          id?: string
          landing_page?: string | null
          last_interaction_at?: string | null
          lost_reason?: string | null
          message?: string | null
          name?: string
          next_followup_at?: string | null
          notes?: string | null
          phone?: string | null
          referrer?: string | null
          score?: number | null
          service_type?: string | null
          source?: string | null
          stage?: string
          temperature?: string | null
          travel_date_from?: string | null
          travel_date_to?: string | null
          travelers_count?: number | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_reviews: {
        Row: {
          comment: string | null
          created_at: string
          destination: string | null
          id: string
          is_approved: boolean | null
          provider_id: string
          rating: number
          reviewer_email: string | null
          reviewer_name: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          destination?: string | null
          id?: string
          is_approved?: boolean | null
          provider_id: string
          rating?: number
          reviewer_email?: string | null
          reviewer_name: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          destination?: string | null
          id?: string
          is_approved?: boolean | null
          provider_id?: string
          rating?: number
          reviewer_email?: string | null
          reviewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_services: {
        Row: {
          created_at: string
          destination_slug: string | null
          id: string
          is_active: boolean | null
          price_range: string | null
          provider_id: string
          service_slug: string
        }
        Insert: {
          created_at?: string
          destination_slug?: string | null
          id?: string
          is_active?: boolean | null
          price_range?: string | null
          provider_id: string
          service_slug: string
        }
        Update: {
          created_at?: string
          destination_slug?: string | null
          id?: string
          is_active?: boolean | null
          price_range?: string | null
          provider_id?: string
          service_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
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
      quote_items: {
        Row: {
          created_at: string
          description: string
          id: string
          notes: string | null
          quantity: number | null
          quote_id: string
          service_type: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          quantity?: number | null
          quote_id: string
          service_type: string
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          quote_id?: string
          service_type?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          currency: string
          id: string
          lead_id: string
          notes: string | null
          provider_id: string | null
          status: string
          total_amount: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          lead_id: string
          notes?: string | null
          provider_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          lead_id?: string
          notes?: string | null
          provider_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          attempts: number | null
          blocked_until: string | null
          first_attempt_at: string | null
          key: string
        }
        Insert: {
          attempts?: number | null
          blocked_until?: string | null
          first_attempt_at?: string | null
          key: string
        }
        Update: {
          attempts?: number | null
          blocked_until?: string | null
          first_attempt_at?: string | null
          key?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string | null
          entity_slug: string
          entity_type: string
          expires_at: string | null
          id: string
          metadata: Json | null
          reason: string | null
          rec_type: string
          score: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_slug: string
          entity_type: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          rec_type: string
          score?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_slug?: string
          entity_type?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          rec_type?: string
          score?: number | null
          user_id?: string | null
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
      support_tickets: {
        Row: {
          created_at: string
          id: string
          lead_id: string | null
          messages: Json | null
          priority: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id?: string | null
          messages?: Json | null
          priority?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string | null
          messages?: Json | null
          priority?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      user_behavior: {
        Row: {
          created_at: string | null
          entity_slug: string | null
          entity_type: string | null
          event_type: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_slug?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_slug?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_type: string
          file_url: string | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_type: string
          file_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_type?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          nationality: string | null
          passport_country: string | null
          phone: string | null
          preferred_destinations: Json | null
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          nationality?: string | null
          passport_country?: string | null
          phone?: string | null
          preferred_destinations?: Json | null
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          nationality?: string | null
          passport_country?: string | null
          phone?: string | null
          preferred_destinations?: Json | null
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_booking: {
        Args: {
          p_amount: number
          p_booking_code: string
          p_destination: string
          p_provider_id: string
          p_session_token: string
          p_travel_date: string
          p_traveler_email: string
          p_traveler_name: string
        }
        Returns: Json
      }
      admin_add_provider: {
        Args: {
          p_commission_rate: number
          p_name: string
          p_service_type: string
          p_session_token: string
        }
        Returns: Json
      }
      admin_batch_score_leads: {
        Args: { p_session_token: string }
        Returns: Json
      }
      admin_get_audit_logs: {
        Args: { p_limit?: number; p_offset?: number; p_session_token: string }
        Returns: Json
      }
      admin_get_commercial_stats: {
        Args: { p_session_token: string }
        Returns: Json
      }
      admin_get_dashboard_data: {
        Args: { p_session_token: string }
        Returns: Json
      }
      admin_get_followup_queue: {
        Args: { p_session_token: string }
        Returns: Json
      }
      admin_get_lead_events: {
        Args: { p_lead_id: string; p_session_token: string }
        Returns: Json
      }
      admin_get_leads: {
        Args: {
          p_destination?: string
          p_limit?: number
          p_offset?: number
          p_session_token: string
          p_source?: string
          p_stage?: string
        }
        Returns: Json
      }
      admin_get_pipeline_stats: {
        Args: { p_session_token: string }
        Returns: Json
      }
      admin_login: {
        Args: { p_password: string; p_username: string }
        Returns: Json
      }
      admin_logout: { Args: { p_session_token: string }; Returns: undefined }
      admin_update_lead: {
        Args: { p_data: Json; p_lead_id: string; p_session_token: string }
        Returns: Json
      }
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
      calculate_lead_score: { Args: { p_lead_id: string }; Returns: number }
      generate_recommendations: {
        Args: { p_user_id?: string }
        Returns: undefined
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

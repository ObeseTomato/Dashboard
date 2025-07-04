import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Updated Database types matching the actual Supabase schema
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: number
          task_name: string
          description: string
          status: string | null
          due_date: string
          priority: string | null
          category: string | null
          created_at: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          task_name: string
          description: string
          status?: string | null
          due_date: string
          priority?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          task_name?: string
          description?: string
          status?: string | null
          due_date?: string
          priority?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string | null
          user_id?: string | null
        }
      }
      competitors: {
        Row: {
          id: number
          name: string
          address: string | null
          latitude: number | null
          longitude: number | null
          distance_km: number | null
          review_count: number | null
          average_rating: number | null
          market_share_estimate: number | null
          specialties: string[] | null
          key_strengths: string[] | null
          website_url: string | null
          last_updated: string
        }
        Insert: {
          id?: number
          name: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          distance_km?: number | null
          review_count?: number | null
          average_rating?: number | null
          market_share_estimate?: number | null
          specialties?: string[] | null
          key_strengths?: string[] | null
          website_url?: string | null
          last_updated?: string
        }
        Update: {
          id?: number
          name?: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          distance_km?: number | null
          review_count?: number | null
          average_rating?: number | null
          market_share_estimate?: number | null
          specialties?: string[] | null
          key_strengths?: string[] | null
          website_url?: string | null
          last_updated?: string
        }
      }
      digital_assets: {
        Row: {
          id: number
          asset_name: string
          asset_type: string
          url: string | null
          status: string | null
          priority: string | null
          last_updated: string | null
          key_metrics_json: Record<string, any> | null
          platform_id_external: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          asset_name: string
          asset_type: string
          url?: string | null
          status?: string | null
          priority?: string | null
          last_updated?: string | null
          key_metrics_json?: Record<string, any> | null
          platform_id_external?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          asset_name?: string
          asset_type?: string
          url?: string | null
          status?: string | null
          priority?: string | null
          last_updated?: string | null
          key_metrics_json?: Record<string, any> | null
          platform_id_external?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: number
          source: string
          review_id_external: string
          author_name: string | null
          rating: number | null
          review_text: string | null
          review_timestamp: string | null
          reply_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          source: string
          review_id_external: string
          author_name?: string | null
          rating?: number | null
          review_text?: string | null
          review_timestamp?: string | null
          reply_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          source?: string
          review_id_external?: string
          author_name?: string | null
          rating?: number | null
          review_text?: string | null
          review_timestamp?: string | null
          reply_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_outputs: {
        Row: {
          id: number
          agent_name: string
          run_timestamp: string
          status: string
          input_prompt: string | null
          output_text: string | null
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: number
          agent_name: string
          run_timestamp?: string
          status: string
          input_prompt?: string | null
          output_text?: string | null
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: number
          agent_name?: string
          run_timestamp?: string
          status?: string
          input_prompt?: string | null
          output_text?: string | null
          metadata?: Record<string, any> | null
        }
      }
      web_pages: {
        Row: {
          id: number
          url: string
          title: string
          page_views: number | null
          seo_score: number | null
          issues_found: number | null
          last_crawled: string | null
          status: string | null
          meta_description: string | null
          keywords: string[] | null
          updated_at: string
        }
        Insert: {
          id?: number
          url: string
          title: string
          page_views?: number | null
          seo_score?: number | null
          issues_found?: number | null
          last_crawled?: string | null
          status?: string | null
          meta_description?: string | null
          keywords?: string[] | null
          updated_at?: string
        }
        Update: {
          id?: number
          url?: string
          title?: string
          page_views?: number | null
          seo_score?: number | null
          issues_found?: number | null
          last_crawled?: string | null
          status?: string | null
          meta_description?: string | null
          keywords?: string[] | null
          updated_at?: string
        }
      }
      kpi_time_series: {
        Row: {
          id: number
          source: string
          metric_name: string
          metric_value: number
          date: string
          dimensions: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: number
          source: string
          metric_name: string
          metric_value: number
          date: string
          dimensions?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: number
          source?: string
          metric_name?: string
          metric_value?: number
          date?: string
          dimensions?: Record<string, any> | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: number
          source_url: string | null
          content: string
          metadata: Record<string, any> | null
          embedding: number[] | null
          created_at: string
        }
        Insert: {
          id?: number
          source_url?: string | null
          content: string
          metadata?: Record<string, any> | null
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: number
          source_url?: string | null
          content?: string
          metadata?: Record<string, any> | null
          embedding?: number[] | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean | null
        }
      }
    }
  }
}
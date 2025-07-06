// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/types/dashboard.ts
export interface DashboardData {
  clinic: ClinicInfo;
  assets: DigitalAsset[];
  tasks: Task[];
  analytics: PerformanceMetrics;
  competitors: Competitor[];
  lastUpdated: string;
  dataQuality: number;
}

export interface ClinicInfo {
  name: string;
  logo: string;
  specialties: string[];
  location: string;
}

// CORRECTED DigitalAsset INTERFACE TO MATCH SUPABASE SCHEMA PRECISELY
export interface DigitalAsset {
  id: number; // Matches Supabase 'id' type (number)
  asset_name: string; // Matches Supabase 'asset_name'
  asset_type: AssetType | null; // Matches Supabase 'asset_type' (could be null if not enforced by DB CHECK, safer to include)
  url: string | null; // Matches Supabase 'url'
  status: AssetStatus | null; // Matches Supabase 'status' (can be null in DB)
  priority: Priority | null; // Matches Supabase 'priority' (can be null in DB)
  last_updated: string | null; // Matches Supabase 'last_updated' (timestamp string or null)
  key_metrics_json: Record<string, any> | null; // Matches Supabase 'key_metrics_json' (jsonb or null)
  platform_id_external: string | null; // Matches Supabase 'platform_id_external' (string or null)
  created_at: string; // Matches Supabase 'created_at' (timestamp string)
  updated_at: string | null; // Matches Supabase 'updated_at' (timestamp string or null)
}

export type AssetType = 
  | 'business_profile' 
  | 'website' 
  | 'social_media' 
  | 'directory' 
  | 'review_platform'
  | 'advertising'
  | 'content_platform' 
  | 'analytics_tool';

export type AssetStatus = 'active' | 'warning' | 'critical' | 'inactive';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  aiGenerated?: boolean;
  ai_insights?: string;
}

export type TaskType = 
  | 'content_creation'
  | 'optimization'
  | 'monitoring'
  | 'engagement'
  | 'analysis';

export interface PerformanceMetrics {
  gmb: {
    views: number[];
    clicks: number[];
    calls: number[];
    dates: string[];
  };
  website: {
    users: number[];
    sessions: number[];
    pageviews: number[];
    dates: string[];
  };
  reviews: {
    total: number;
    average: number;
    recent: Review[];
  };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  platform: string;
  replied?: boolean;
}

export interface Competitor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  distance: string;
  lastPostDate?: string;
}

export interface KPICard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  subMetric?: {
    label: string;
    value: string | number;
    change?: number;
  };
  chartData?: number[];
  ratingVisual?: number;
}
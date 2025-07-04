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

export interface DigitalAsset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  priority: Priority;
  lastUpdated: string;
  metrics?: Record<string, number>;
  url?: string;
}

export type AssetType = 
  | 'gmb' 
  | 'website' 
  | 'social_media' 
  | 'directory' 
  | 'review_platform'
  | 'advertising';

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
}
export type AssetType = 'business_profile' | 'website' | 'social_media' | 'directory' | 'review_platform' | 'advertising';
export type AssetStatus = 'active' | 'warning' | 'critical' | 'inactive';
export type Priority = 'high' | 'medium' | 'low';

export interface DigitalAsset {
  id: number;
  asset_name: string;
  asset_type: AssetType | null;
  url: string | null;
  status: AssetStatus | null;
  priority: Priority | null;
  last_updated: string | null;
  key_metrics_json: Record<string, any> | null;
  platform_id_external: string | null;
  created_at: string;
  updated_at: string | null;
}

// You can add other dashboard-related types here
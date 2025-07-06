// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/AssetLog.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Globe, 
  Star, 
  Users, 
  Megaphone,
  ExternalLink,
  Eye, 
  TrendingUp,
  Calendar,
  Plus,
  Loader2,
  Trash2,
  AlertTriangle, 
  CheckCircle,
  Pencil,
  Phone, 
  MapPin, 
  Clock,
  MessageSquare, 
  FileText 
} from 'lucide-react'; 
import { useDigitalAssets, useCreateDigitalAsset, useUpdateDigitalAsset } from '../hooks/useSupabaseAPI';
import { useToast } from '../hooks/use-toast';
import { DigitalAsset } from '../types/dashboard'; 
import { cn } from '@/lib/utils'; 

interface AssetLogProps {
  data?: any; 
  onAssetClick?: (assetId: string) => void; 
}

interface NewDigitalAsset {
  asset_name: string;
  asset_type: 'business_profile' | 'website' | 'social_media' | 'directory' | 'review_platform' | 'advertising' | 'content_platform' | 'analytics_tool'; 
  status: 'active' | 'warning' | 'critical' | 'inactive';
  priority: 'high' | 'medium' | 'low';
  url: string;
}

export const AssetLog = ({ data, onAssetClick }: AssetLogProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState<NewDigitalAsset>({
    asset_name: '',
    asset_type: 'website',
    status: 'active',
    priority: 'medium',
    url: ''
  });
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null); 
  const { toast } = useToast();

  // Supabase hooks
  const { data: assetsData, isLoading, error } = useDigitalAssets();
  const createAssetMutation = useCreateDigitalAsset();
  const updateAssetMutation = useUpdateDigitalAsset();

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe;
      case 'business_profile': return Star;
      case 'social_media': return Users;
      case 'directory': return Globe;
      case 'advertising': return Megaphone;
      case 'review_platform': return FileText;
      case 'content_platform': return FileText; 
      case 'analytics_tool': return Monitor; 
      default: return Globe;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-white">Active</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-white">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-destructive text-white">Critical</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive'; 
      case 'medium': return 'border-l-warning'; 
      case 'low': return 'border-l-primary'; 
      default: return 'border-l-muted'; 
    }
  };

  const createAsset = async () => {
    try {
      if (!newAsset.asset_name.trim() || !newAsset.asset_type) {
        toast({
          title: "Validation Error",
          description: "Name and type are required.",
          variant: "destructive"
        });
        return;
      }

      await createAssetMutation.mutateAsync(newAsset);

      setNewAsset({
        asset_name: '',
        asset_type: 'website',
        status: 'active',
        priority: 'medium',
        url: ''
      });

      setIsCreateDialogOpen(false);
      
      toast({
        title: "Asset Created",
        description: "New digital asset has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create digital asset.",
        variant: "destructive"
      });
    }
  };

  const updateAssetStatus = async (assetId: number, newStatus: string) => {
    try {
      await updateAssetMutation.mutateAsync({
        id: assetId,
        updates: { status: newStatus }
      });
      
      toast({
        title: "Asset Updated",
        description: "Asset status has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update asset status.",
        variant: "destructive"
      });
    }
  };

  const handleEditAsset = () => {
    if (selectedAsset) {
      toast({
        title: "Edit Asset",
        description: `Edit functionality for "${selectedAsset.asset_name}" is coming soon!`,
        type: "info"
      });
      setSelectedAsset(null); 
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Asset Log</h2>
            <p className="text-muted-foreground">
              Comprehensive view of all digital assets and their current status
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading digital assets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Asset Log</h2>
            <p className="text-muted-foreground">
              Comprehensive view of all digital assets and their current status
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-destructive">Failed to load digital assets. Please try again.</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const assets = assetsData || [];
  const groupedAssets = assets.reduce((groups: any, asset: any) => {
    // Safely access asset_type, default to 'general' if null/undefined
    const category = (asset.asset_type || 'general').replace(/_/g, ' ').toUpperCase(); 
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(asset);
    return groups;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text
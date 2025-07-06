import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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
} from 'lucide-react';
import { useDigitalAssets, useCreateDigitalAsset, useUpdateDigitalAsset } from '../hooks/useSupabaseAPI';
import { useToast } from '../hooks/use-toast';

// Define the core types for your assets
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

interface NewDigitalAsset {
  asset_name: string;
  asset_type: AssetType;
  status: AssetStatus;
  priority: Priority;
  url: string;
}

interface AssetLogProps {
  onAssetClick?: (assetId: string) => void;
}

// Utility functions for safely rendering data
const renderSafeValue = (value: any): string => {
  if (value === null || typeof value === 'undefined') return "N/A";
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const safeGet = (obj: any, path: string, defaultValue: any = null) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
};

const safeArray = (value: any): any[] => {
  return Array.isArray(value) ? value : [];
};


export const AssetLog = ({ onAssetClick }: AssetLogProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null); // State for the selected asset
  const [newAsset, setNewAsset] = useState<NewDigitalAsset>({
    asset_name: '',
    asset_type: 'website',
    status: 'active',
    priority: 'medium',
    url: ''
  });
  const { toast } = useToast();

  const { data: assetsData, isLoading, error } = useDigitalAssets();
  const createAssetMutation = useCreateDigitalAsset();
  const updateAssetMutation = useUpdateDigitalAsset();

  const handleRowClick = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    if (onAssetClick) {
      onAssetClick(asset.id.toString());
    }
  };

  const getAssetIcon = (type: AssetType | null) => {
    switch (type) {
      case 'website': return Globe;
      case 'business_profile': return Star;
      case 'social_media': return Users;
      case 'directory': return Globe;
      case 'advertising': return Megaphone;
      default: return Globe;
    }
  };

  const getStatusBadge = (status: AssetStatus | null) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>;
      case 'warning': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-500 text-white hover:bg-red-600">Critical</Badge>;
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: Priority | null) => {
      switch (priority) {
          case 'high': return <Badge variant="destructive">High</Badge>;
          case 'medium': return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Medium</Badge>;
          case 'low': return <Badge variant="secondary">Low</Badge>;
          default: return <Badge variant="outline">-</Badge>;
      }
  };

  const createAsset = async () => {
    // ... (create asset logic remains the same)
  };

  if (isLoading) return <div><Loader2 className="h-8 w-8 animate-spin" /> Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load digital assets.</div>;

  const assets = assetsData || [];
  type AssetGroups = { [key: string]: DigitalAsset[] };

  const groupedAssets: AssetGroups = assets.reduce((groups: AssetGroups, asset: DigitalAsset) => {
    const assetTypeString = asset.asset_type || 'general';
    const category = assetTypeString.replace(/_/g, ' ').toUpperCase();
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(asset);
    return groups;
  }, {});

  return (
    <>
      <div className="p-6 space-y-6">
        {/* ... (Create Asset Dialog and other UI remains the same) ... */}

        {Object.entries(groupedAssets).map(([category, categoryAssets]: [string, DigitalAsset[]]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Key Metrics</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryAssets.map((asset: DigitalAsset) => {
                    const Icon = getAssetIcon(asset.asset_type);
                    return (
                      <TableRow
                        key={asset.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleRowClick(asset)}
                      >
                        <TableCell><Icon className="h-4 w-4 text-primary" /></TableCell>
                        <TableCell>
                          <p className="font-medium">{asset.asset_name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-64">{asset.url}</p>
                        </TableCell>
                        <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        <TableCell>{getPriorityBadge(asset.priority)}</TableCell>
                        <TableCell>{asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                           {/* ... (Key metrics rendering logic remains the same) ... */}
                        </TableCell>
                        <TableCell>
                           <div className="flex space-x-1">
                             <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRowClick(asset); }}>
                               <Eye className="h-3 w-3" />
                             </Button>
                             {asset.url && (
                               <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.open(asset.url, '_blank'); }}>
                                 <ExternalLink className="h-3 w-3" />
                               </Button>
                             )}
                           </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- DIALOG FOR ASSET DETAILS --- */}
      <Dialog open={!!selectedAsset} onOpenChange={(isOpen) => !isOpen && setSelectedAsset(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.asset_name || 'Asset Details'}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            {selectedAsset && selectedAsset.key_metrics_json ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Business Information */}
                {safeGet(selectedAsset.key_metrics_json, 'businessInformation') && (
                  <Card className="md:col-span-1">
                    <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
                    <CardContent>
                      <p><strong>Name:</strong> {renderSafeValue(safeGet(selectedAsset.key_metrics_json, 'businessInformation.businessName'))}</p>
                      <p><strong>Address:</strong> {renderSafeValue(safeGet(selectedAsset.key_metrics_json, 'businessInformation.address'))}</p>
                      <p><strong>Website:</strong> {renderSafeValue(safeGet(selectedAsset.key_metrics_json, 'businessInformation.websiteUrl'))}</p>
                      <p><strong>Phone:</strong> {renderSafeValue(safeGet(selectedAsset.key_metrics_json, 'businessInformation.phone'))}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Services */}
                {safeGet(selectedAsset.key_metrics_json, 'services') && (
                  <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Services</CardTitle></CardHeader>
                    <CardContent>
                      <ul>
                        {safeArray(safeGet(selectedAsset.key_metrics_json, 'services')).map((service: any, index: number) => (
                          <li key={index}><strong>{renderSafeValue(service.displayName)}</strong>: ${renderSafeValue(service.price)}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {/* Q&A */}
                {safeGet(selectedAsset.key_metrics_json, 'qa') && (
                    <Card className="md:col-span-3">
                        <CardHeader><CardTitle>Questions & Answers</CardTitle></CardHeader>
                        <CardContent>
                            {safeArray(safeGet(selectedAsset.key_metrics_json, 'qa')).map((item: any, index: number) => (
                                <div key={index} className="mb-4">
                                    <p><strong>Q:</strong> {renderSafeValue(item.question)}</p>
                                    <p><strong>A:</strong> {renderSafeValue(item.answer)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

              </div>
            ) : (
              <p>No detailed metrics available for this asset.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
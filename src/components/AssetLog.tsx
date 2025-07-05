// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/AssetLog.tsx
import React, { useState } from 'react'; // ADDED: import React
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
  Trash2,
  AlertTriangle, 
  CheckCircle,
  Pencil 
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
    const category = asset.asset_type.replace('_', ' ').toUpperCase();
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
          <h2 className="text-3xl font-bold text-foreground">Asset Log</h2>
          <p className="text-muted-foreground">
            Comprehensive view of all digital assets and their current status
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={createAssetMutation.isPending}>
                {createAssetMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Digital Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="asset_name">Asset Name *</Label>
                  <Input
                    id="asset_name"
                    value={newAsset.asset_name}
                    onChange={(e) => setNewAsset({...newAsset, asset_name: e.target.value})}
                    placeholder="Enter asset name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="asset_type">Type *</Label>
                  <Select value={newAsset.asset_type} onValueChange={(value: any) => setNewAsset({...newAsset, asset_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business_profile">Business Profile</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="directory">Directory</SelectItem>
                      <SelectItem value="review_platform">Review Platform</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                      <SelectItem value="content_platform">Content Platform</SelectItem> 
                      <SelectItem value="analytics_tool">Analytics Tool</SelectItem> 
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newAsset.status} onValueChange={(value: any) => setNewAsset({...newAsset, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newAsset.priority} onValueChange={(value: any) => setNewAsset({...newAsset, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newAsset.url}
                    onChange={(e) => setNewAsset({...newAsset, url: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createAsset} disabled={createAssetMutation.isPending}>
                    {createAssetMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Asset'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Active ({assets.filter((a: any) => a.status === 'active').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>Warning ({assets.filter((a: any) => a.status === 'warning').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Critical ({assets.filter((a: any) => a.status === 'critical').length})</span>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(groupedAssets).map(([category, categoryAssets]: [string, DigitalAsset[]]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{category}</span>
              <Badge variant="outline">{categoryAssets.length} assets</Badge>
            </CardTitle>
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
                      className={cn(
                        "hover:bg-muted/50 cursor-pointer border-l-4", 
                        getPriorityBorderColor(asset.priority) 
                      )}
                      onClick={() => setSelectedAsset(asset)} 
                    >
                      <TableCell>
                        <Icon className="h-4 w-4 text-primary" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{asset.asset_name}</p>
                          {asset.url && (
                            <p className="text-xs text-muted-foreground truncate max-w-64">
                              {asset.url}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(asset.status)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(asset.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {asset.key_metrics_json && Object.keys(asset.key_metrics_json).length > 0 ? (
                          <div className="space-y-1">
                            {Object.entries(asset.key_metrics_json).slice(0, 2).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex items-center space-x-2 text-xs">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                                <TrendingUp className="h-3 w-3 text-success" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No metrics</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {asset.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                window.open(asset.url, '_blank');
                              }}
                            >
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

      {/* Asset Detail Dialog (Now used by row click) */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-2xl"> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAsset && (
                <>
                  {React.createElement(getAssetIcon(selectedAsset.asset_type), { className: "h-5 w-5" })}
                  {selectedAsset.asset_name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAsset && (
            <div className="space-y-6 py-4"> 
              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(selectedAsset.status)}>
                  {selectedAsset.status}
                </Badge>
                <Badge variant={selectedAsset.priority === 'high' ? 'destructive' : 
                               selectedAsset.priority === 'medium' ? 'default' : 'secondary'}>
                  {selectedAsset.priority} priority
                </Badge>
              </div>

              {/* URL */}
              {selectedAsset.url && (
                <div>
                  <h4 className="font-semibold mb-2">URL</h4>
                  <a href={selectedAsset.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {selectedAsset.url}
                  </a>
                </div>
              )}

              {/* Metrics */}
              {selectedAsset.key_metrics_json && Object.keys(selectedAsset.key_metrics_json).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedAsset.key_metrics_json).map(([key, value]) => (
                      <div key={key} className="bg-muted/50 p-3 rounded-lg">
                        {/* Formatted key for display */}
                        <div className="text-sm text-muted-foreground">{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div> 
                        <div className="text-lg font-semibold">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Info (from DigitalAsset schema) */}
              <div>
                <h4 className="font-semibold mb-2">General Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div><strong>Type:</strong> {selectedAsset.asset_type.replace(/_/g, ' ').toUpperCase()}</div>
                  <div><strong>Platform ID:</strong> {selectedAsset.platform_id_external || 'N/A'}</div>
                  <div><strong>Created:</strong> {new Date(selectedAsset.created_at).toLocaleDateString()}</div>
                  <div><strong>Last Updated:</strong> {new Date(selectedAsset.updated_at || selectedAsset.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6"> 
                <Button 
                    variant="secondary" 
                    onClick={handleEditAsset} 
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Asset
                </Button>
                {selectedAsset.url && (
                  <Button
                    onClick={() => window.open(selectedAsset.url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Asset
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAsset(null); 
                    onAssetClick?.(selectedAsset.id.toString()); 
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" /> 
                  View Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
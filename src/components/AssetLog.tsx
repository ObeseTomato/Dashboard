import { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { useDigitalAssets, useCreateDigitalAsset, useUpdateDigitalAsset } from '../hooks/useSupabaseAPI';
import { useToast } from '../hooks/use-toast';

interface AssetLogProps {
  data?: any; // Keep for compatibility but use Supabase data
  onAssetClick?: (assetId: string) => void;
}

interface NewDigitalAsset {
  asset_name: string;
  asset_type: 'gmb' | 'website' | 'social_media' | 'directory' | 'review_platform' | 'advertising';
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
  const { toast } = useToast();

  // Supabase hooks
  const { data: assetsData, isLoading, error } = useDigitalAssets();
  const createAssetMutation = useCreateDigitalAsset();
  const updateAssetMutation = useUpdateDigitalAsset();

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe;
      case 'gmb': return Star;
      case 'social_media': return Users;
      case 'directory': return Globe;
      case 'advertising': return Megaphone;
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

      // Reset form
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
          <p className="text-destructive">Failed to load digital assets. Please try again.</p>
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
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="gmb">Google My Business</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="directory">Directory</SelectItem>
                      <SelectItem value="review_platform">Review Platform</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
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

      {Object.entries(groupedAssets).map(([category, categoryAssets]: [string, any]) => (
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
                {categoryAssets.map((asset: any) => {
                  const Icon = getAssetIcon(asset.asset_type);
                  
                  return (
                    <TableRow 
                      key={asset.id} 
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => onAssetClick?.(asset.id.toString())}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssetClick?.(asset.id.toString());
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
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
    </div>
  );
};
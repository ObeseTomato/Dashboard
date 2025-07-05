// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/AssetLog.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog'; // ADDED DialogDescription
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
    const category = asset.asset_type ? asset.asset_type.replace('_', ' ').toUpperCase() : 'GENERAL'; 
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
                  <TableHead className="w-[180px]">Asset Name</TableHead> 
                  <TableHead className="w-[80px]">Status</TableHead>    
                  <TableHead className="w-[80px]">Priority</TableHead>   
                  <TableHead className="w-[120px]">Last Updated</TableHead> 
                  <TableHead className="w-[150px]">Key Metrics</TableHead> 
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryAssets.map((asset: DigitalAsset) => {
                  const Icon = getAssetIcon(asset.asset_type || ''); 
                  
                  return (
                    <TableRow 
                      key={asset.id} 
                      className={cn(
                        "hover:bg-muted/50 cursor-pointer border-l-4", 
                        getPriorityBorderColor(asset.priority || 'medium') 
                      )}
                      onClick={() => setSelectedAsset(asset)} 
                    >
                      <TableCell className="align-top"> 
                        <Icon className="h-4 w-4 text-primary" />
                      </TableCell>
                      <TableCell className="align-top"> 
                        <div className="flex flex-col min-w-0"> 
                          <p className="font-medium">{asset.asset_name}</p>
                          {asset.url && (
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]"> 
                              {asset.url}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top"> 
                        {getStatusBadge(asset.status || '')} 
                      </TableCell>
                      <TableCell className="align-top"> 
                        {getPriorityBadge(asset.priority || 'medium')} 
                      </TableCell>
                      <TableCell className="align-top"> 
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top"> 
                        {asset.key_metrics_json && Object.keys(asset.key_metrics_json).length > 0 ? (
                          <div className="space-y-1">
                            {Object.entries(asset.key_metrics_json).slice(0, 2).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex items-center space-x-2 text-xs">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="font-medium">
                                  {typeof value === 'number' ? value.toLocaleString() : 
                                   typeof value === 'object' ? 'Complex Data' : 
                                   String(value)}
                                </span>
                                <TrendingUp className="h-3 w-3 text-success" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No metrics</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top"> 
                        <div className="flex space-x-1">
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                setSelectedAsset(asset); 
                              }}
                            >
                              <Eye className="h-3 w-3" /> View
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

      {/* Asset Detail Dialog (Now with expanded content for Business Profiles and other types) */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]"> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAsset && (
                <>
                  {React.createElement(getAssetIcon(selectedAsset.asset_type || ''), { className: "h-5 w-5" })} 
                  {selectedAsset.asset_name}
                </>
              )}
            </DialogTitle>
             {/* Adding a generic description to satisfy Radix UI warning */}
             <DialogDescription>
                Detailed information for this {selectedAsset?.asset_type ? selectedAsset.asset_type.replace(/_/g, ' ') : 'digital'} asset.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAsset && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"> 
              {/* Column 1: General Info & Common Metrics */}
              <div className="space-y-6">
                {/* Status and Priority */}
                <div className="flex items-center gap-4">
                  <Badge className={getStatusBadge(selectedAsset.status || '')}> 
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

                {/* Performance Metrics (Generic from key_metrics_json) */}
                {selectedAsset.key_metrics_json && Object.keys(selectedAsset.key_metrics_json).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Performance Metrics (Summary)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedAsset.key_metrics_json).map(([key, value]) => (
                        // Display the first few key metrics as a general overview
                        <div key={key} className="bg-muted/50 p-3 rounded-lg">
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
                    <div><strong>Type:</strong> {selectedAsset.asset_type ? selectedAsset.asset_type.replace(/_/g, ' ').toUpperCase() : 'N/A'}</div>
                    <div><strong>Platform ID:</strong> {selectedAsset.platform_id_external || 'N/A'}</div>
                    <div><strong>Created:</strong> {selectedAsset.created_at ? new Date(selectedAsset.created_at).toLocaleDateString() : 'N/A'}</div>
                    <div><strong>Last Updated:</strong> {selectedAsset.updated_at ? new Date(selectedAsset.updated_at).toLocaleDateString() : (selectedAsset.created_at ? new Date(selectedAsset.created_at).toLocaleDateString() : 'N/A')}</div>
                  </div>
                </div>
              </div>

              {/* Column 2: Specific Details based on asset_type */}
              <div className="space-y-6 pt-6 md:pt-0 md:border-l md:pl-6 border-border">
                {/* Business Profile Details */}
                {selectedAsset.asset_type === 'business_profile' && selectedAsset.key_metrics_json && (
                  <>
                    <h3 className="text-xl font-bold">Business Profile Details</h3>

                    {selectedAsset.key_metrics_json.businessInformation && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500"/> Business Information</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {selectedAsset.key_metrics_json.businessInformation.businessName && (
                            <p><strong>Name:</strong> {selectedAsset.key_metrics_json.businessInformation.businessName}</p>
                          )}
                          {selectedAsset.key_metrics_json.businessInformation.primaryCategory && (
                            <p><strong>Primary Category:</strong> {selectedAsset.key_metrics_json.businessInformation.primaryCategory}</p>
                          )}
                          {selectedAsset.key_metrics_json.businessInformation.additionalCategories?.length > 0 && (
                            <p><strong>Additional Categories:</strong> {selectedAsset.key_metrics_json.businessInformation.additionalCategories.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.description && (
                            <p><strong>Description:</strong> {selectedAsset.key_metrics_json.description}</p>
                          )}
                            {selectedAsset.key_metrics_json.businessInformation.openingDate && (
                            <p><strong>Opening Date:</strong> {new Date(selectedAsset.key_metrics_json.businessInformation.openingDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.contactSocials && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Phone className="h-4 w-4 text-blue-500"/> Contact & Socials</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {selectedAsset.key_metrics_json.contactSocials.phoneNumber && (
                            <p><strong>Phone:</strong> {selectedAsset.key_metrics_json.contactSocials.phoneNumber}</p>
                          )}
                          {selectedAsset.key_metrics_json.contactSocials.website && (
                            <p><strong>Website:</strong> <a href={selectedAsset.key_metrics_json.contactSocials.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedAsset.key_metrics_json.contactSocials.website}</a></p>
                          )}
                          {selectedAsset.key_metrics_json.contactSocials.chat && (
                            <p><strong>Chat:</strong> {selectedAsset.key_metrics_json.contactSocials.chat}</p>
                          )}
                          {selectedAsset.key_metrics_json.contactSocials.facebook && (
                            <p><strong>Facebook:</strong> <a href={selectedAsset.key_metrics_json.contactSocials.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedAsset.key_metrics_json.contactSocials.facebook}</a></p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.locationAreas && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500"/> Location and Areas</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {selectedAsset.key_metrics_json.locationAreas.businessLocation && (
                            <p><strong>Location:</strong> {selectedAsset.key_metrics_json.locationAreas.businessLocation}</p>
                          )}
                          {selectedAsset.key_metrics_json.locationAreas.serviceAreas?.length > 0 && (
                            <p><strong>Service Areas:</strong> {selectedAsset.key_metrics_json.locationAreas.serviceAreas.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.businessHours && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-gray-500"/> Business Hours</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {Object.entries(selectedAsset.key_metrics_json.businessHours).map(([day, hours]) => (
                            <p key={day}><strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {hours}</p>
                          ))}
                        </div>
                        {selectedAsset.key_metrics_json.specialHours && (
                           <p className="mt-2"><strong>Special Hours:</strong> {selectedAsset.key_metrics_json.specialHours}</p>
                        )}
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.attributesAccessibility && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-purple-500"/> Attributes & Accessibility</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {selectedAsset.key_metrics_json.attributesAccessibility.fromTheBusiness?.length > 0 && (
                            <p><strong>From the business:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.fromTheBusiness.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.accessibility?.length > 0 && (
                            <p><strong>Accessibility:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.accessibility.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.amenities?.length > 0 && (
                            <p><strong>Amenities:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.amenities.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.crowd?.length > 0 && (
                            <p><strong>Crowd:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.crowd.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.parking?.length > 0 && (
                            <p><strong>Parking:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.parking.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.planning?.length > 0 && (
                            <p><strong>Planning:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.planning.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.serviceOptions?.length > 0 && (
                            <p><strong>Service options:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.serviceOptions.join(', ')}</p>
                          )}
                          {selectedAsset.key_metrics_json.attributesAccessibility.languages?.length > 0 && (
                            <p><strong>Languages:</strong> {selectedAsset.key_metrics_json.attributesAccessibility.languages.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.services && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-orange-500"/> Services</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          {selectedAsset.key_metrics_json.services.primaryCategory && (
                             <div>
                               <p className="font-medium text-foreground">{selectedAsset.key_metrics_json.services.primaryCategory.name}:</p>
                               <ul className="list-disc pl-5">
                                 {selectedAsset.key_metrics_json.services.primaryCategory.items?.map((item: any, idx: number) => (
                                   <li key={idx}><p>{item.name}: {item.description}</p></li>
                                 ))}
                               </ul>
                             </div>
                          )}
                          {selectedAsset.key_metrics_json.services.additionalCategories?.map((cat: any, cIdx: number) => (
                            <div key={cIdx}>
                              <p className="font-medium text-foreground">{cat.name}:</p>
                              <ul className="list-disc pl-5">
                                {cat.items?.map((item: any, idx: number) => (
                                  <li key={idx}><p>{item.name}: {item.description}</p></li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.qa?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-indigo-500"/> Q&A</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          {selectedAsset.key_metrics_json.qa.map((item: any, idx: number) => (
                            <div key={idx}>
                              <p className="font-medium text-foreground">Q: {item.question}</p>
                              <p className="ml-4">A: {item.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAsset.key_metrics_json.posts?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-green-500"/> Posts</h4>
                        <div className="text-sm text-muted-foreground space-y-3">
                          {selectedAsset.key_metrics_json.posts.map((post: any, idx: number) => (
                            <div key={idx} className="border-b border-border pb-2 last:border-b-0">
                              <p className="font-medium text-foreground">Update: {post.date}</p>
                              <p>{post.description}</p>
                              {post.button?.url && (
                                <Button variant="link" size="sm" className="h-6 px-0 mt-1">
                                  <a href={post.button.url} target="_blank" rel="noopener noreferrer">{post.button.text || 'View Post'}</a>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Website Specific Details */}
                {selectedAsset.asset_type === 'website' && selectedAsset.key_metrics_json && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Website Performance Details</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
                      {selectedAsset.key_metrics_json.sessions && <p><strong>Total Sessions:</strong> {selectedAsset.key_metrics_json.sessions.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.users && <p><strong>Total Users:</strong> {selectedAsset.key_metrics_json.users.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.pageviews && <p><strong>Total Pageviews:</strong> {selectedAsset.key_metrics_json.pageviews.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.bounce_rate && <p><strong>Bounce Rate:</strong> {selectedAsset.key_metrics_json.bounce_rate}%</p>}
                      {selectedAsset.key_metrics_json.avg_session_duration_seconds && <p><strong>Avg. Session Duration:</strong> {Math.floor(selectedAsset.key_metrics_json.avg_session_duration_seconds / 60)}m {selectedAsset.key_metrics_json.avg_session_duration_seconds % 60}s</p>}
                      {selectedAsset.key_metrics_json.forms_submitted && <p><strong>Forms Submitted:</strong> {selectedAsset.key_metrics_json.forms_submitted.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.seo_health_score && <p><strong>SEO Health Score:</strong> {selectedAsset.key_metrics_json.seo_health_score}%</p>}
                      {selectedAsset.key_metrics_json.core_web_vitals && (
                        <div>
                          <p className="font-semibold text-foreground mt-2">Core Web Vitals:</p>
                          <ul className="list-disc pl-5">
                            {selectedAsset.key_metrics_json.core_web_vitals.lcp && <li>LCP: {selectedAsset.key_metrics_json.core_web_vitals.lcp}</li>}
                            {selectedAsset.key_metrics_json.core_web_vitals.fid && <li>FID: {selectedAsset.key_metrics_json.core_web_vitals.fid}</li>}
                            {selectedAsset.key_metrics_json.core_web_vitals.cls && <li>CLS: {selectedAsset.key_metrics_json.core_web_vitals.cls}</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Media Specific Details */}
                {selectedAsset.asset_type === 'social_media' && selectedAsset.key_metrics_json && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Social Media Details</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
                      {selectedAsset.key_metrics_json.followers && <p><strong>Followers:</strong> {selectedAsset.key_metrics_json.followers.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.engagement_rate_percent && <p><strong>Engagement Rate:</strong> {selectedAsset.key_metrics_json.engagement_rate_percent}%</p>}
                      {selectedAsset.key_metrics_json.posts_last_30d && <p><strong>Posts (last 30 days):</strong> {selectedAsset.key_metrics_json.posts_last_30d}</p>}
                      {selectedAsset.key_metrics_json.messages_received_last_7d && <p><strong>Messages (last 7 days):</strong> {selectedAsset.key_metrics_json.messages_received_last_7d}</p>}
                      {selectedAsset.key_metrics_json.reach && <p><strong>Reach:</strong> {selectedAsset.key_metrics_json.reach.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.profile_visits && <p><strong>Profile Visits:</strong> {selectedAsset.key_metrics_json.profile_visits.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.page_likes && <p><strong>Page Likes:</strong> {selectedAsset.key_metrics_json.page_likes.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.top_performing_post && (
                        <div>
                          <p className="font-semibold text-foreground mt-2">Top Post:</p>
                          <p className="ml-4">{selectedAsset.key_metrics_json.top_performing_post.title}</p>
                          <p className="ml-4 text-xs text-muted-foreground">Likes: {selectedAsset.key_metrics_json.top_performing_post.likes}, Comments: {selectedAsset.key_metrics_json.top_performing_post.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Advertising Specific Details */}
                {selectedAsset.asset_type === 'advertising' && selectedAsset.key_metrics_json && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Advertising Campaign Details</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
                      {selectedAsset.key_metrics_json.campaign_budget && <p><strong>Budget:</strong> ${selectedAsset.key_metrics_json.campaign_budget.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.spend_current_month && <p><strong>Spend (Current Month):</strong> ${selectedAsset.key_metrics_json.spend_current_month.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.impressions && <p><strong>Impressions:</strong> {selectedAsset.key_metrics_json.impressions.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.clicks && <p><strong>Clicks:</strong> {selectedAsset.key_metrics_json.clicks.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.conversions && <p><strong>Conversions:</strong> {selectedAsset.key_metrics_json.conversions.toLocaleString()}</p>}
                      {selectedAsset.key_metrics_json.ctr_percent && <p><strong>CTR:</strong> {selectedAsset.key_metrics_json.ctr_percent}%</p>}
                      {selectedAsset.key_metrics_json.cpc && <p><strong>CPC:</strong> ${selectedAsset.key_metrics_json.cpc.toFixed(2)}</p>}
                      {selectedAsset.key_metrics_json.conversion_value && <p><strong>Conversion Value:</strong> ${selectedAsset.key_metrics_json.conversion_value.toLocaleString()}</p>}
                    </div>
                  </div>
                )}

                {/* Directory/Review/Content/Analytics Tool - Generic "Additional Details" */}
                {['directory', 'review_platform', 'content_platform', 'analytics_tool'].includes(selectedAsset.asset_type) && selectedAsset.key_metrics_json && Object.keys(selectedAsset.key_metrics_json).length > 0 && (
                   <div className="space-y-6">
                      <h3 className="text-xl font-bold">Additional Details</h3>
                      <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
                          {Object.entries(selectedAsset.key_metrics_json).map(([key, value]) => (
                              <p key={key}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value.toLocaleString()}</p>
                          ))}
                      </div>
                   </div>
                )}
                {/* Fallback if key_metrics_json is empty for these types */}
                {['directory', 'review_platform', 'content_platform', 'analytics_tool'].includes(selectedAsset.asset_type) && (!selectedAsset.key_metrics_json || Object.keys(selectedAsset.key_metrics_json).length === 0) && (
                   <div className="space-y-6">
                      <h3 className="text-xl font-bold">Additional Details</h3>
                      <div className="text-muted-foreground">
                          <p>No specific details beyond basic information available for this asset type yet.</p>
                          <p className="text-sm mt-2">Data integration for these details is planned for future phases.</p>
                      </div>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Dialog Actions */}
          <div className="flex justify-end gap-2 mt-6"> 
            <Button 
                variant="secondary" 
                onClick={handleEditAsset} 
            >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Asset
            </Button>
            {selectedAsset?.url && (
              <Button
                onClick={() => window.open(selectedAsset.url || '', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Asset
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/VisualEcosystem.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { DashboardData } from '../types/dashboard'; 
import { useDigitalAssets } from '../hooks/useSupabaseAPI'; // Import useDigitalAssets
import { 
  Globe, 
  Star, 
  Users, 
  Megaphone,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Monitor, 
  FileText,
  Loader2 // Added Loader2 for loading state
} from 'lucide-react'; 
import { cn } from '@/lib/utils'; // Import cn

interface VisualEcosystemProps {
  data: DashboardData; // Still passed for clinic info (static for now)
  onAssetClick: (assetId: string) => void;
  onNavigate?: (tab: string, itemId?: string) => void;
}

interface EcosystemNode {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  priority: string;
  x: number;
  y: number;
  metrics?: Record<string, any>; 
  url?: string;
  description?: string;
}

export const VisualEcosystem = ({ data, onAssetClick, onNavigate }: VisualEcosystemProps) => {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => new Set()); 

  // NEW: Fetch live digital assets data
  const { data: digitalAssetsData, isLoading, error } = useDigitalAssets();

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe;
      case 'business_profile': return Star; 
      case 'social_media': return Users;
      case 'directory': return Globe; 
      case 'review_platform': return FileText; 
      case 'advertising': return Megaphone;
      case 'content_platform': return FileText; 
      case 'analytics_tool': return Monitor; 
      default: return Globe;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success border-success bg-success/10';
      case 'warning': return 'text-warning border-warning bg-warning/10';
      case 'critical': return 'text-destructive border-destructive bg-destructive/10';
      case 'inactive': return 'text-muted-foreground border-muted bg-muted/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  // NEW: Function to get priority-based styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive'; // Red border for high priority
      case 'medium': return 'border-l-warning'; // Yellow border for medium priority
      case 'low': return 'border-l-primary'; // Green border for low priority
      default: return 'border-l-muted'; // Grey border for unknown/default
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'inactive': return Clock;
      default: return Clock;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prevCollapsed => {
      const newCollapsed = new Set(prevCollapsed);
      if (newCollapsed.has(categoryId)) {
        newCollapsed.delete(categoryId);
      } else {
        newCollapsed.add(categoryId);
      }
      return newCollapsed;
    });
  };

  // Memoize ecosystemNodes creation to prevent unnecessary re-runs
  const ecosystemNodes = useMemo(() => {
    const assetsToRender = digitalAssetsData || []; 
    
    const containerWidth = 1000;
    const containerHeight = 800;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const categoryRadius = 200;
    const assetRadius = 100;
    
    const nodes: EcosystemNode[] = [];
    
    // Central hub
    nodes.push({
      id: 'hub',
      name: data.clinic.name,
      type: 'hub',
      category: 'Central Hub',
      status: 'active',
      priority: 'high',
      x: centerX,
      y: centerY,
      description: 'Primary digital hub for all ecosystem activities'
    });

    const categories = [
      {
        name: 'Business Profiles',
        assets: assetsToRender.filter(a => a.asset_type === 'business_profile'),
        angle: 0,
        color: '#10B981'
      },
      {
        name: 'Website Platforms', 
        assets: assetsToRender.filter(a => a.asset_type === 'website'),
        angle: Math.PI / 3, 
        color: '#3B82F6' 
      },
      {
        name: 'Social Media',
        assets: assetsToRender.filter(a => a.asset_type === 'social_media'),
        angle: 2 * Math.PI / 3, 
        color: '#8B5CF6'
      },
      {
        name: 'Directories & Reviews',
        assets: assetsToRender.filter(a => a.asset_type === 'directory' || a.asset_type === 'review_platform'),
        angle: Math.PI, 
        color: '#F59E0B'
      },
      {
        name: 'Advertising',
        assets: assetsToRender.filter(a => a.asset_type === 'advertising'),
        angle: 4 * Math.PI / 3, 
        color: '#EF4444'
      },
      {
        name: 'Content & Tools', 
        assets: assetsToRender.filter(a => a.asset_type === 'content_platform' || a.asset_type === 'analytics_tool'),
        angle: 5 * Math.PI / 3,
        color: '#6366F1'
      }
    ];

    categories.forEach((category, categoryIndex) => {
      // Only create category node if it has assets, ensuring no empty categories appear
      if (category.assets.length > 0) { 
        const categoryId = `category-${categoryIndex}`;
        const categoryX = centerX + Math.cos(category.angle) * categoryRadius;
        const categoryY = centerY + Math.sin(category.angle) * categoryRadius;
        
        nodes.push({
          id: categoryId,
          name: category.name,
          type: 'category',
          category: category.name,
          status: 'active', 
          priority: 'medium',
          x: categoryX,
          y: categoryY,
          description: `Category containing ${category.assets.length} assets`
        });

        // Assets are only added if the category is NOT collapsed and has assets
        if (!collapsedCategories.has(categoryId) && category.assets.length > 0) {
          const assetsCount = category.assets.length;
          // Spread assets more evenly in a semicircle around the category node
          const angleRange = Math.PI; 
          const angleStep = assetsCount > 1 ? angleRange / (assetsCount - 1) : 0;
          const startAngle = category.angle - angleRange / 2; 
          
          category.assets.forEach((asset, assetIndex) => {
            const assetAngle = startAngle + (assetIndex * angleStep);
            const assetX = categoryX + Math.cos(assetAngle) * assetRadius;
            const assetY = categoryY + Math.sin(assetAngle) * assetRadius;
            
            nodes.push({
              id: asset.id.toString(),
              name: asset.asset_name, 
              type: asset.asset_type, 
              category: category.name,
              status: asset.status,
              priority: asset.priority,
              x: assetX,
              y: assetY,
              metrics: asset.key_metrics_json, 
              description: `${asset.asset_type ? asset.asset_type.replace('_', ' ') : 'Asset'} with ${asset.status} status`
            });
          });
        }
      }
    });
    return nodes;
  }, [digitalAssetsData, collapsedCategories, data.clinic.name]); 

  const hubNode = ecosystemNodes.find(n => n.id === 'hub');

  const handleNodeClick = (node: EcosystemNode) => {
    if (node.type === 'hub') {
      return; 
    }
    
    if (node.type === 'category') {
      toggleCategory(node.id);
      return;
    }
    
    // For asset nodes, set selectedNode to open the modal
    const asset = digitalAssetsData?.find(a => a.id.toString() === node.id); 
    if (asset) {
      // Cast the fetched asset data to EcosystemNode structure for the modal
      setSelectedNode({
        id: asset.id.toString(),
        name: asset.asset_name,
        type: asset.asset_type,
        category: node.category, // Keep the category from the map node
        status: asset.status,
        priority: asset.priority,
        x: node.x, y: node.y, // Keep map coordinates
        metrics: asset.key_metrics_json, // Ensure metrics are passed
        url: asset.url || '',
        description: `${asset.asset_type ? asset.asset_type.replace('_', ' ') : 'Asset'} with ${asset.status} status`
      });
      // Also call the prop function if needed for parent component logic
      onAssetClick(node.id);
    }
  };

  const handleViewDetails = () => {
    if (selectedNode && onNavigate) {
      setSelectedNode(null);
      onNavigate('assets', selectedNode.id);
    }
  };

  // NEW: Loading and Error States for Visual Ecosystem
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Visual Ecosystem</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading digital ecosystem data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Visual Ecosystem</h1>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-destructive">Failed to load digital ecosystem data. Please try again.</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const assetsForOverview = digitalAssetsData || []; // Use live data for overview
  const groupedAssets = assetsForOverview.reduce((groups, asset) => {
    const type = asset.asset_type || 'general'; 
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(asset);
    return groups;
  }, {} as Record<string, typeof digitalAssetsData>);

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Digital Ecosystem Overview</h3>
          <p className="text-muted-foreground">
            Comprehensive view of your digital presence and asset relationships
          </p>
        </div>

        {/* Central Hub */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <div className="text-center text-white">
                <h3 className="font-bold text-lg">{data.clinic.name}</h3>
                <p className="text-xs opacity-90">Digital Hub</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge variant="secondary" className="bg-success text-white">
                {data.dataQuality}% Health
              </Badge>
            </div>
          </div>
        </div>

        {/* Asset Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedAssets).map(([type, assets]) => {
            const Icon = getAssetIcon(type);
            const typeLabel = type ? type.replace('_', ' ').toUpperCase() : 'GENERAL'; 
            
            return (
              <Card key={type} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{typeLabel}</span>
                    <Badge variant="outline">{assets.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assets.map(asset => {
                    const StatusIcon = getStatusIcon(asset.status);
                    
                    return (
                      <div 
                        key={asset.id}
                        // NEW: Make asset card clickable and apply priority color
                        className={cn(
                          "p-3 pr-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:scale-105", // Added border-l-4 for priority color
                          getStatusColor(asset.status), // Status background/text/border
                          getPriorityColor(asset.priority) // Priority left border color
                        )}
                        onClick={() => {
                          // When clicked, set selectedNode to open the modal (similar to map node click)
                          setSelectedNode({
                            id: asset.id.toString(),
                            name: asset.asset_name,
                            type: asset.asset_type,
                            category: typeLabel, // Use the displayed category name
                            status: asset.status,
                            priority: asset.priority,
                            x: 0, y: 0, // Placeholder coords, not relevant for overview modal
                            metrics: asset.key_metrics_json,
                            url: asset.url || '',
                            description: `${asset.asset_type ? asset.asset_type.replace('_', ' ') : 'Asset'} with ${asset.status} status`
                          });
                          onAssetClick(asset.id.toString());
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{asset.asset_name}</h4>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="opacity-75">
                            Updated: {asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A'}
                          </span>
                          <Badge 
                            variant={asset.priority === 'high' ? 'destructive' : 
                                     asset.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {asset.priority}
                          </Badge>
                        </div>
                        
                        {asset.key_metrics_json && Object.keys(asset.key_metrics_json).length > 0 ? (
                          <div className="mt-2 pt-2 border-t border-current/20">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {Object.entries(asset.key_metrics_json).slice(0, 2).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="opacity-75">{key}:</span>
                                  <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No metrics</span>
                        )}
                        
                        {asset.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 h-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when clicking Visit
                              window.open(asset.url, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ecosystem Health Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Ecosystem Health Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {assetsForOverview.filter(a => a.status === 'active').length}
                </div>
                <p className="text-sm text-muted-foreground">Active Assets</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {assetsForOverview.filter(a => a.status === 'warning').length}
                </div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {assetsForOverview.filter(a => a.status === 'critical').length}
                </div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.dataQuality}%
                </div>
                <p className="text-sm text-muted-foreground">Data Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderInteractiveMap = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">Interactive Ecosystem Map</h3>
          <p className="text-muted-foreground">
            Click on category nodes to expand/collapse. Click on assets to view details.
          </p>
        </div>

        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-[800px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
              <svg width="1000" height="800" className="absolute inset-0 mx-auto">
                {/* Connection lines from hub to categories */}
                {hubNode && ecosystemNodes
                  .filter(node => node.type === 'category')
                  .map(categoryNode => (
                    <line
                      key={`hub-line-${categoryNode.id}`}
                      x1={hubNode.x}
                      y1={hubNode.y}
                      x2={categoryNode.x}
                      y2={categoryNode.y}
                      stroke="#94a3b8"
                      strokeWidth="3"
                      opacity="0.8"
                    />
                  ))}

                {/* Connection lines from categories to assets */}
                {ecosystemNodes
                  .filter(node => node.type !== 'hub' && node.type !== 'category')
                  .map(assetNode => {
                    // Find the category this asset belongs to
                    const categoryNode = ecosystemNodes.find(n => 
                      n.type === 'category' && n.name === assetNode.category
                    );
                    
                    if (!categoryNode) return null;
                    
                    return (
                      <line
                        key={`asset-line-${assetNode.id}`}
                        x1={categoryNode.x}
                        y1={categoryNode.y}
                        x2={assetNode.x}
                        y2={assetNode.y}
                        stroke="#e2e8f0"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                    );
                  })}
              </svg>

              {/* Nodes */}
              <div className="absolute inset-0 w-[1000px] h-[800px] mx-auto">
                {ecosystemNodes.map(node => {
                  const Icon = node.type === 'hub' ? Star : 
                             node.type === 'category' ? Globe : 
                             getAssetIcon(node.type);
                  const StatusIcon = getStatusIcon(node.status);
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode?.id === node.id;
                  // isCollapsed depends on collapsedCategories state
                  const isCollapsed = node.type === 'category' && collapsedCategories.has(node.id); 

                  return (
                    <div
                      key={node.id}
                      className={cn(
                        `absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200`,
                        (isHovered || isSelected) ? 'scale-110 z-10' : 'z-5'
                      )}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                      }}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Node circle */}
                      <div
                        className={cn(
                          `relative flex items-center justify-center rounded-full border-2 shadow-lg`,
                          node.type === 'hub' 
                            ? 'w-20 h-20 bg-gradient-to-br from-primary to-primary-glow border-primary text-white' 
                            : node.type === 'category'
                            ? 'w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 border-slate-400 text-slate-700'
                            : `w-12 h-12 ${getStatusColor(node.status)} border-2`
                        )}
                      >
                        <Icon className={cn(
                          node.type === 'hub' ? 'h-8 w-8' : node.type === 'category' ? 'h-6 w-6' : 'h-5 w-5'
                        )} />
                        
                        {/* Collapse/Expand indicator for categories */}
                        {node.type === 'category' && (
                          <div className="absolute -bottom-1 -right-1">
                            {isCollapsed ? (
                              <ChevronRight className="h-3 w-3 bg-white rounded-full p-0.5" />
                            ) : (
                              <ChevronDown className="h-3 w-3 bg-white rounded-full p-0.5" />
                            )}
                          </div>
                        )}
                        
                        {/* Status indicator for assets */}
                        {node.type !== 'hub' && node.type !== 'category' && (
                          <div className="absolute -top-1 -right-1">
                            <StatusIcon className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      {/* Node label */}
                      <div className={cn(
                        `absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                        text-center text-xs font-medium whitespace-nowrap`,
                        node.type === 'hub' ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'
                      )}>
                        {node.name}
                        {node.type !== 'hub' && node.type !== 'category' && (
                          <div className="text-xs text-muted-foreground">
                            {node.priority} priority
                          </div>
                        )}
                        {node.type === 'category' && (
                          <div className="text-xs text-muted-foreground">
                            {isCollapsed ? 'Click to expand' : 'Click to collapse'}
                          </div>
                        )}
                      </div>

                      {/* Hover tooltip - Enhanced */}
                      {isHovered && node.type !== 'hub' && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded-md px-3 py-2 shadow-lg whitespace-nowrap z-20 min-w-[150px]">
                            <h5 className="font-semibold">{node.name}</h5>
                            <p className="text-muted-foreground text-[0.65rem] truncate">{node.url || node.description}</p>
                            <div className="mt-1 flex items-center justify-between text-[0.65rem] border-t border-border pt-1">
                                <span className={cn("capitalize", getStatusColor(node.status))}>{node.status}</span>
                                <span className="capitalize">{node.priority} priority</span>
                            </div>
                            {node.metrics && Object.keys(node.metrics).length > 0 && (
                                <div className="mt-1 border-t border-border pt-1">
                                    {Object.entries(node.metrics).map(([key, value]) => (
                                        <p key={key} className="flex justify-between text-[0.6rem] capitalize">
                                            <span>{key}:</span> <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 text-sm text-muted-foreground bg-muted/20">
              <p>• Click category nodes to expand/collapse their assets</p>
              <p>• Click asset nodes to view detailed information</p>
              <p>• Hover over nodes for additional information</p>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-success"></div>
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-warning"></div>
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-destructive"></div>
                <span className="text-sm">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-muted"></div>
                <span className="text-sm">Inactive</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Visual Ecosystem</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          {renderInteractiveMap()}
        </TabsContent>
      </Tabs>

      {/* Asset Detail Modal */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNode && (
                <>
                  {React.createElement(getAssetIcon(selectedNode.type), { className: "h-5 w-5" })}
                  {selectedNode.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNode && (
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(selectedNode.status)}>
                  {selectedNode.status}
                </Badge>
                <Badge variant={selectedNode.priority === 'high' ? 'destructive' : 
                               selectedNode.priority === 'medium' ? 'default' : 'secondary'}>
                  {selectedNode.priority} priority
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedNode.description}</p>
              </div>

              {/* Metrics */}
              {selectedNode.metrics && Object.keys(selectedNode.metrics).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedNode.metrics).map(([key, value]) => (
                      <div key={key} className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">{key}</div>
                        <div className="text-lg font-semibold">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {selectedNode.url && (
                  <Button
                    onClick={() => window.open(selectedNode.url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Asset
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleViewDetails}
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
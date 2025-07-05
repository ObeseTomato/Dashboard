import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { DashboardData } from '../types/dashboard';
import { 
  Globe, 
  Star, 
  Users, 
  Instagram, 
  Facebook, 
  Megaphone,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Eye,
  MousePointer,
  MapPin,
  Calendar,
  TrendingUp,
  MessageSquare,
  Mail,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface VisualEcosystemProps {
  data: DashboardData;
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
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success border-success bg-success/10';
      case 'warning': return 'text-warning border-warning bg-warning/10';
      case 'critical': return 'text-destructive border-destructive bg-destructive/10';
      case 'inactive': return 'text-muted-foreground border-muted bg-muted/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
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
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId);
    } else {
      newCollapsed.add(categoryId);
    }
    setCollapsedCategories(newCollapsed);
  };

const createEcosystemNodes = (): EcosystemNode[] => {
    // Use container dimensions for proper centering
    const containerWidth = 1000;
    const containerHeight = 800;
    const centerX = containerWidth / 2; // 500
    const centerY = containerHeight / 2; // 400
    const categoryRadius = 200; // Distance from center to categories
    const assetRadius = 100; // Distance from category to assets
    
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

    // Create category groups with better spacing
    const categories = [
      {
        name: 'Foundational Platforms',
        assets: data.assets.filter(a => a.asset_type === 'gmb' || a.asset_type === 'website'),
        angle: 0,
        color: '#10B981'
      },
      {
        name: 'Social Media',
        assets: data.assets.filter(a => a.asset_type === 'social_media'),
        angle: Math.PI / 3,
        color: '#8B5CF6'
      },
      {
        name: 'Directories & Reviews',
        assets: data.assets.filter(a => a.asset_type === 'directory' || a.asset_type === 'review_platform'),
        angle: 2 * Math.PI / 3,
        color: '#F59E0B'
      },
      {
        name: 'Advertising',
        assets: data.assets.filter(a => a.asset_type === 'advertising'),
        angle: Math.PI,
        color: '#EF4444'
      },
      {
        name: 'Content & Engagement',
        assets: [], // We'll add blog and content assets here
        angle: 4 * Math.PI / 3,
        color: '#06B6D4'
      },
      {
        name: 'Analytics & Tools',
        assets: [], // We'll add analytics tools here
        angle: 5 * Math.PI / 3,
        color: '#6366F1'
      }
    ];

    categories.forEach((category, categoryIndex) => {
      const categoryX = centerX + Math.cos(category.angle) * categoryRadius;
      const categoryY = centerY + Math.sin(category.angle) * categoryRadius;
      
      // Add category node
      const categoryId = `category-${categoryIndex}`;
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

      // Only add assets if category is not collapsed
      if (!collapsedCategories.has(categoryId) && category.assets.length > 0) {
        // Calculate positions for assets around the category with better spacing
        const assetsCount = category.assets.length;
        const angleStep = assetsCount > 1 ? (Math.PI / 2) / (assetsCount - 1) : 0; // Spread over 90 degrees
        const startAngle = category.angle - Math.PI / 4; // Start 45 degrees before category angle
        
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
            // FIX: Add a check to ensure asset.asset_type is a string before calling .replace()
            description: `${asset.asset_type ? asset.asset_type.replace('_', ' ') : 'Asset'} with ${asset.status} status`
          });
        });
      }
    });

    return nodes;
  };

  const ecosystemNodes = createEcosystemNodes();
  const hubNode = ecosystemNodes.find(n => n.id === 'hub');

  const handleNodeClick = (node: EcosystemNode) => {
    if (node.type === 'hub') {
      return; // Don't open details for hub
    }
    
    if (node.type === 'category') {
      toggleCategory(node.id);
      return;
    }
    
    // Find the actual asset from data
    const asset = data.assets.find(a => a.id.toString() === node.id);
    if (asset) {
      setSelectedNode(node);
      // Also trigger the parent callback for navigation
      onAssetClick(node.id);
    }
  };

  const handleViewDetails = () => {
    if (selectedNode && onNavigate) {
      // Close the modal first
      setSelectedNode(null);
      // Navigate to the assets tab with the selected asset
      onNavigate('assets', selectedNode.id);
    }
  };

  const renderOverview = () => {
    const groupedAssets = data.assets.reduce((groups, asset) => {
      if (!groups[asset.type]) {
        groups[asset.type] = [];
      }
      groups[asset.type].push(asset);
      return groups;
    }, {} as Record<string, typeof data.assets>);

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
            const typeLabel = type.replace('_', ' ').toUpperCase();
            
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
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${getStatusColor(asset.status)}`}
                        onClick={() => onAssetClick(asset.id.toString())}
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
                        
                        {asset.key_metrics_json && (
                          <div className="mt-2 pt-2 border-t border-current/20">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {Object.entries(asset.key_metrics_json).slice(0, 2).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="opacity-75">{key}:</span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {asset.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 h-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssetClick?.(asset.id.toString());
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
                  {data.assets.filter(a => a.status === 'active').length}
                </div>
                <p className="text-sm text-muted-foreground">Active Assets</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {data.assets.filter(a => a.status === 'warning').length}
                </div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {data.assets.filter(a => a.status === 'critical').length}
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
                  const isCollapsed = node.type === 'category' && collapsedCategories.has(node.id);

                  return (
                    <div
                      key={node.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                        isHovered || isSelected ? 'scale-110 z-10' : 'z-5'
                      }`}
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
                        className={`
                          relative flex items-center justify-center rounded-full border-2 shadow-lg
                          ${node.type === 'hub' 
                            ? 'w-20 h-20 bg-gradient-to-br from-primary to-primary-glow border-primary text-white' 
                            : node.type === 'category'
                            ? 'w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 border-slate-400 text-slate-700'
                            : `w-12 h-12 ${getStatusColor(node.status)} border-2`
                          }
                          ${isHovered ? 'shadow-xl' : ''}
                        `}
                      >
                        <Icon className={`${node.type === 'hub' ? 'h-8 w-8' : node.type === 'category' ? 'h-6 w-6' : 'h-5 w-5'}`} />
                        
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
                      <div className={`
                        absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                        text-center text-xs font-medium whitespace-nowrap
                        ${node.type === 'hub' ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'}
                      `}>
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

                      {/* Hover tooltip */}
                      {isHovered && node.type !== 'hub' && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                          {node.description}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
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
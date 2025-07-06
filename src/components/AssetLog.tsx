import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, ExternalLink, Globe, Star, Users, Megaphone, TrendingUp, Calendar } from 'lucide-react';
import { DigitalAsset, AssetType, AssetStatus, Priority } from '../types/dashboard';

interface AssetLogProps {
  assets: DigitalAsset[];
  onAssetClick: (asset: DigitalAsset) => void;
}

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

export const AssetLog = ({ assets, onAssetClick }: AssetLogProps) => {

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
    <div className="space-y-6">
      {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
        <Card key={category}>
          <CardHeader><CardTitle>{category}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryAssets.map((asset) => {
                  const Icon = getAssetIcon(asset.asset_type);
                  return (
                    <TableRow
                      key={asset.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => onAssetClick(asset)}
                    >
                      <TableCell><Icon className="h-4 w-4 text-primary" /></TableCell>
                      <TableCell>
                        <p className="font-medium">{asset.asset_name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-64">{asset.url}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{getPriorityBadge(asset.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onAssetClick(asset); }}>
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
  );
};
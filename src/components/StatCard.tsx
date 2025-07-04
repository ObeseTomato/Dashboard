import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Minus, Eye, Monitor, Star, CheckCircle } from 'lucide-react';
import { KPICard } from '../types/dashboard';

interface StatCardProps {
  data: KPICard;
}

export const StatCard = ({ data }: StatCardProps) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getKPIIcon = (iconType: string) => {
    switch (iconType) {
      case 'eye':
        return <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <Eye className="h-4 w-4 text-green-600" />
        </div>;
      case 'monitor':
        return <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Monitor className="h-4 w-4 text-blue-600" />
        </div>;
      case 'star':
        return <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
          <Star className="h-4 w-4 text-yellow-600" />
        </div>;
      case 'check':
        return <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </div>;
      default:
        return <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Monitor className="h-4 w-4 text-gray-600" />
        </div>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-muted-foreground">
            {data.title}
          </div>
          {getKPIIcon(data.icon)}
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            {data.value}
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon()}
            <span className={getTrendColor()}>
              {data.change > 0 ? '+' : ''}{data.change}% from last month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
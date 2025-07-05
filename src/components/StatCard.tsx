// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/StatCard.tsx
import { Card, CardContent } from './ui/card'; // CardHeader and CardTitle removed as they were not used
import { TrendingUp, TrendingDown, Minus, Eye, Monitor, Star, CheckCircle } from 'lucide-react';
import { KPICard } from '../types/dashboard'; // Import KPICard interface
import { cn } from '@/lib/utils'; // Import cn for conditional class styling

interface StatCardProps {
  data: KPICard;
  clickable?: boolean; // New prop: indicates if the card is clickable
  onClick?: () => void; // New prop: click handler for the card
}

export const StatCard = ({ data, clickable = false, onClick }: StatCardProps) => {
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
    <Card 
      className={cn(
        "hover:shadow-lg transition-all duration-300 border-0 shadow-sm",
        clickable && "cursor-pointer hover:border-primary/50" // Add cursor and border hover for clickable cards
      )}
      onClick={clickable ? onClick : undefined} // Only assign onClick if clickable
    >
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

          {/* New: Display Sub-Metric if available */}
          {data.subMetric && (
            <div className="text-xs text-muted-foreground pt-1 border-t border-border mt-2">
              {data.subMetric.label}: <span className="font-semibold">{data.subMetric.value}</span>
              {data.subMetric.change !== undefined && ( // Optional change for sub-metric
                <span className={cn("ml-1", data.subMetric.change >=0 ? "text-success" : "text-destructive")}>
                  {data.subMetric.change > 0 ? "+" : ""}{data.subMetric.change}%
                </span>
              )}
            </div>
          )}

          {/* Future: Placeholder for Sparkline Chart */}
          {data.chartData && (
            <div className="mt-2 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
              {/* Sparkline chart goes here */}
              (Chart Placeholder)
            </div>
          )}

          {/* Future: Placeholder for Star Rating Visual */}
          {data.ratingVisual !== undefined && (
            <div className="mt-2 text-yellow-500">
              {/* Render star icons based on data.ratingVisual */}
              {/* Example: FaStar filled stars based on value */}
              (Stars Placeholder)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
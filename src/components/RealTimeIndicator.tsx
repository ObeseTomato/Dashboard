
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

export const RealTimeIndicator = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  useRealTimeUpdates({
    onAssetUpdate: () => {
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
    },
    onTaskUpdate: () => {
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
    },
    onMetricUpdate: () => {
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
    }
  });

  // Simulate connection status (in real app, this would be actual WebSocket status)
  useEffect(() => {
    const interval = setInterval(() => {
      // Occasionally simulate connection issues
      setIsConnected(Math.random() > 0.05); // 95% uptime
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'No updates yet';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={isConnected ? "default" : "destructive"} 
          className="gap-1 cursor-pointer"
        >
          {isConnected ? (
            <Activity className="h-3 w-3 animate-pulse" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span className="hidden sm:inline">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <p><strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
          <p><strong>Updates:</strong> {updateCount}</p>
          <p><strong>Last Update:</strong> {formatLastUpdate(lastUpdate)}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

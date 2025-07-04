
import { useEffect, useCallback } from 'react';
import { realTimeService, RealTimeUpdate } from '../services/realTimeService';
import { useNotifications } from '../contexts/NotificationContext';

interface UseRealTimeUpdatesProps {
  onAssetUpdate?: (data: any) => void;
  onTaskUpdate?: (data: any) => void;
  onMetricUpdate?: (data: any) => void;
}

export const useRealTimeUpdates = ({
  onAssetUpdate,
  onTaskUpdate,
  onMetricUpdate
}: UseRealTimeUpdatesProps = {}) => {
  const { addNotification } = useNotifications();

  const handleUpdate = useCallback((update: RealTimeUpdate) => {
    console.log('Real-time update received:', update);

    // Show notification for important updates
    if (update.type === 'asset' && update.data.status === 'warning') {
      addNotification({
        title: 'Asset Alert',
        message: `Asset status changed to warning`,
        type: 'warning'
      });
    }

    if (update.type === 'task' && update.data.completed) {
      addNotification({
        title: 'Task Completed',
        message: `A task has been marked as completed`,
        type: 'success'
      });
    }

    // Call specific handlers
    switch (update.type) {
      case 'asset':
        onAssetUpdate?.(update.data);
        break;
      case 'task':
        onTaskUpdate?.(update.data);
        break;
      case 'metric':
        onMetricUpdate?.(update.data);
        break;
    }
  }, [addNotification, onAssetUpdate, onTaskUpdate, onMetricUpdate]);

  useEffect(() => {
    const unsubscribe = realTimeService.subscribe(handleUpdate);
    return unsubscribe;
  }, [handleUpdate]);

  return {
    triggerManualUpdate: realTimeService.triggerUpdate.bind(realTimeService)
  };
};

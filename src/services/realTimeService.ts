
export interface RealTimeUpdate {
  type: 'asset' | 'task' | 'metric';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
}

export type RealTimeCallback = (update: RealTimeUpdate) => void;

class RealTimeService {
  private callbacks: Set<RealTimeCallback> = new Set();
  private intervalId: NodeJS.Timeout | null = null;

  subscribe(callback: RealTimeCallback) {
    this.callbacks.add(callback);
    
    // Start simulation if this is the first subscriber
    if (this.callbacks.size === 1 && !this.intervalId) {
      this.startSimulation();
    }
    
    return () => {
      this.callbacks.delete(callback);
      // Stop simulation if no more subscribers
      if (this.callbacks.size === 0 && this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    };
  }

  private startSimulation() {
    // Simulate real-time updates every 30 seconds
    this.intervalId = setInterval(() => {
      this.simulateUpdate();
    }, 30000);
  }

  private simulateUpdate() {
    const updateTypes = ['asset', 'task', 'metric'] as const;
    const actions = ['update'] as const; // Focus on updates for simulation
    
    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    let simulatedData;
    
    switch (randomType) {
      case 'asset':
        simulatedData = {
          id: Math.random().toString(36).substr(2, 9),
          status: Math.random() > 0.7 ? 'warning' : 'active',
          lastUpdated: new Date().toISOString()
        };
        break;
      case 'task':
        simulatedData = {
          id: Math.random().toString(36).substr(2, 9),
          completed: Math.random() > 0.8,
          priority: Math.random() > 0.5 ? 'high' : 'medium'
        };
        break;
      case 'metric':
        simulatedData = {
          type: 'data_quality',
          value: Math.floor(Math.random() * 20) + 80 // 80-100%
        };
        break;
    }

    const update: RealTimeUpdate = {
      type: randomType,
      action: randomAction,
      data: simulatedData,
      timestamp: new Date()
    };

    this.callbacks.forEach(callback => callback(update));
  }

  // Method to manually trigger updates (for demo purposes)
  triggerUpdate(update: RealTimeUpdate) {
    this.callbacks.forEach(callback => callback(update));
  }
}

export const realTimeService = new RealTimeService();

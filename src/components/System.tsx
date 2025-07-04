
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Shield, Database, Wifi, Server, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface SystemProps {
  data: DashboardData;
}

export const System = ({ data }: SystemProps) => {
  const systemStatus = [
    {
      component: 'Database',
      status: 'operational',
      uptime: '99.9%',
      lastCheck: '2 minutes ago',
      icon: Database
    },
    {
      component: 'API Services',
      status: 'operational',
      uptime: '99.7%',
      lastCheck: '1 minute ago',
      icon: Server
    },
    {
      component: 'Network',
      status: 'degraded',
      uptime: '98.2%',
      lastCheck: '5 minutes ago',
      icon: Wifi
    },
    {
      component: 'Security Systems',
      status: 'operational',
      uptime: '100%',
      lastCheck: '30 seconds ago',
      icon: Shield
    }
  ];

  const dataIntegrity = [
    { metric: 'Data Accuracy', value: 99.2, status: 'excellent' },
    { metric: 'Backup Completion', value: 100, status: 'excellent' },
    { metric: 'Sync Status', value: 97.8, status: 'good' },
    { metric: 'Validation Checks', value: 94.5, status: 'good' }
  ];

  const recentEvents = [
    {
      type: 'info',
      message: 'Scheduled backup completed successfully',
      timestamp: '10 minutes ago',
      severity: 'low'
    },
    {
      type: 'warning',
      message: 'Network latency detected on secondary connection',
      timestamp: '45 minutes ago',
      severity: 'medium'
    },
    {
      type: 'success',
      message: 'Security scan completed - no issues found',
      timestamp: '2 hours ago',
      severity: 'low'
    },
    {
      type: 'info',
      message: 'System maintenance window scheduled for this weekend',
      timestamp: '4 hours ago',
      severity: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'default';
      case 'degraded': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Clock;
      default: return Clock;
    }
  };

  const getIntegrityColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">System & Integrity</h1>
        </div>
        <Button variant="outline">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Run Diagnostics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStatus.map((system) => {
          const IconComponent = system.icon;
          return (
            <Card key={system.component}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <Badge variant={getStatusColor(system.status)} className="capitalize">
                    {system.status}
                  </Badge>
                </div>
                <h3 className="font-semibold">{system.component}</h3>
                <p className="text-sm text-muted-foreground">Uptime: {system.uptime}</p>
                <p className="text-xs text-muted-foreground">Last check: {system.lastCheck}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Integrity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataIntegrity.map((metric) => (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{metric.metric}</span>
                    <span className={`font-semibold ${getIntegrityColor(metric.status)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent System Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.map((event, index) => {
                const IconComponent = getStatusIcon(event.type);
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <IconComponent className={`h-4 w-4 mt-0.5 ${
                      event.type === 'success' ? 'text-green-600' : 
                      event.type === 'warning' ? 'text-amber-600' : 
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{event.message}</p>
                      <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        event.severity === 'medium' ? 'border-amber-200 text-amber-700' : 
                        'border-gray-200'
                      }`}
                    >
                      {event.severity}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98.7%</div>
              <p className="text-muted-foreground">Overall System Health</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-muted-foreground">Monitoring Active</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <p className="text-muted-foreground">Critical Issues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

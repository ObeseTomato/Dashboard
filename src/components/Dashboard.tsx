// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/Dashboard.tsx
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExportMenu } from './ExportMenu';
import { DashboardData, KPICard, Task } from '../types/dashboard'; 
import { AlertTriangle, CheckCircle, Clock, Zap, Brain, FileText, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { useLatestKPIs, useTasks, useReviews, useDigitalAssets, useUpdateTask } from '../hooks/useSupabaseAPI'; 
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'; 
import { Label } from './ui/label'; 
import { useToast } from '../hooks/use-toast';
import { cn } from '@/lib/utils'; 

interface DashboardProps {
  data: DashboardData;
  onNavigate: (tab: string, itemId?: string) => void;
  isConnected: boolean; 
}

export const Dashboard = ({ data, onNavigate, isConnected }: DashboardProps) => {
  // State for popups
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); 
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedDataGap, setSelectedDataGap] = useState<string | null>(null);

  const { toast } = useToast(); 

  // Fetch live data from Supabase
  const { data: latestKPIs, isLoading: kpisLoading, error: kpisError } = useLatestKPIs();
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useReviews();
  const { data: digitalAssetsData, isLoading: digitalAssetsLoading, error: digitalAssetsError } = useDigitalAssets();

  const updateTaskMutation = useUpdateTask(); 

  // Helper function to calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100);
  };

  // Handler to mark a task as complete
  const handleMarkTaskComplete = async () => {
    if (!selectedTask) return;

    try {
      await updateTaskMutation.mutateAsync({
        id: parseInt(selectedTask.id), 
        updates: { status: 'completed' }
      });
      setSelectedTask(null); 
      toast({
        title: "Task Completed",
        description: `"${selectedTask.title}" has been marked as complete.`,
        type: "success"
      });
    } catch (error) {
      console.error("Failed to mark task complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark task complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate KPI data from live Supabase data
  const kpiData: KPICard[] = useMemo(() => {
    if (kpisLoading || tasksLoading || reviewsLoading) {
      return [
        { title: 'Business Profile Views', value: '...', change: 0, trend: 'stable', icon: 'eye' },
        { title: 'Website Sessions', value: '...', change: 0, trend: 'stable', icon: 'monitor' },
        { title: 'Review Rating', value: '...', change: 0, trend: 'stable', icon: 'star' },
        { title: 'Task Completion', value: '...', change: 0, trend: 'stable', icon: 'check' }
      ];
    }

    const businessProfileViews = latestKPIs?.['Business Profile Views'] || latestKPIs?.['GMB Views'] || latestKPIs?.['GMB Profile Views'] || null;
    const bpViewsValue = businessProfileViews ? businessProfileViews.metric_value.toLocaleString() : 'N/A';
    const bpViewsChange = calculateChange(businessProfileViews?.metric_value || 0, 2500);
    
    const businessProfileActions = latestKPIs?.['Business Profile Actions'] || null;
    const bpActionsValue = businessProfileActions ? bpActionsValue.metric_value.toLocaleString() : 'N/A'; 
    const bpActionsChange = calculateChange(businessProfileActions?.metric_value || 0, 300);

    const websiteSessions = latestKPIs?.['Website Sessions'] || latestKPIs?.['Website Traffic'] || null;
    const websiteValue = websiteSessions ? websiteSessions.metric_value.toLocaleString() : 'N/A';
    const websiteChange = calculateChange(websiteSessions?.metric_value || 0, 1100);

    const websiteConversionRate = latestKPIs?.['Website Conversion Rate'] || null;
    const conversionRateValue = websiteConversionRate ? `${websiteConversionRate.metric_value}%` : 'N/A';
    const conversionRateChange = calculateChange(websiteConversionRate?.metric_value || 0, 2.5);

    let reviewRating = 'N/A';
    let reviewChange = 0;
    let newReviewsCount = 0;
    if (reviewsData && reviewsData.length > 0) {
      const validRatings = reviewsData.filter(r => r.rating !== null && r.rating !== undefined);
      if (validRatings.length > 0) {
        const avgRating = validRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / validRatings.length;
        reviewRating = avgRating.toFixed(1);
        reviewChange = calculateChange(avgRating, 4.6);
      }
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      newReviewsCount = reviewsData.filter(r => new Date(r.created_at || r.review_timestamp) >= oneMonthAgo).length;
    }
    
    let taskCompletion = 'N/A';
    let taskChange = 0;
    let overdueTasksCount = 0;
    if (tasksData && tasksData.length > 0) {
      const completedTasks = tasksData.filter(t => t.status === 'completed').length;
      const totalTasks = tasksData.length;
      if (totalTasks > 0) {
        const completionRate = Math.round((completedTasks / totalTasks) * 100);
        taskCompletion = `${completionRate}%`;
        taskChange = calculateChange(completionRate, 90);
      }
      overdueTasksCount = tasksData.filter(t => t.status !== 'completed' && new Date(t.due_date) < new Date()).length;
    }

    return [
      {
        title: 'Business Profile Views',
        value: bpViewsValue,
        change: parseFloat(bpViewsChange.toFixed(1)),
        trend: bpViewsChange >= 0 ? 'up' : 'down',
        icon: 'eye',
        subMetric: { label: 'Actions', value: bpActionsValue, change: parseFloat(bpActionsChange.toFixed(1)) }
      },
      {
        title: 'Website Sessions',
        value: websiteValue,
        change: parseFloat(websiteChange.toFixed(1)),
        trend: websiteChange >= 0 ? 'up' : 'down',
        icon: 'monitor',
        subMetric: { label: 'Conversion Rate', value: conversionRateValue, change: parseFloat(conversionRateChange.toFixed(1)) }
      },
      {
        title: 'Review Rating',
        value: reviewRating,
        change: parseFloat(reviewChange.toFixed(1)),
        trend: reviewChange >= 0 ? 'up' : 'down',
        icon: 'star',
        subMetric: { label: 'New Reviews (30D)', value: newReviewsCount.toString(), change: 0 }
      },
      {
        title: 'Task Completion',
        value: taskCompletion,
        change: parseFloat(taskChange.toFixed(1)),
        trend: taskChange >= 0 ? 'up' : 'down',
        icon: 'check',
        subMetric: { label: 'Overdue Tasks', value: overdueTasksCount.toString(), change: 0 }
      }
    ];
  }, [latestKPIs, tasksData, reviewsData, kpisLoading, tasksLoading, reviewsLoading]);

  // Use live tasks data for priority tasks section
  const highPriorityTasks = useMemo(() => {
    if (!tasksData) return [];
    
    return tasksData
      .filter(task => task.status !== 'completed' && task.priority === 'high')
      .slice(0, 3)
      .map(task => ({
        id: task.id.toString(),
        title: task.task_name || 'Untitled Task',
        description: task.description || 'No description',
        type: task.category || 'general',
        priority: task.priority || 'medium',
        dueDate: task.due_date || new Date().toISOString().split('T')[0],
        completed: task.status === 'completed',
        aiGenerated: false,
        ai_insights: task.aiGenerated ? "AI suggests this task is critical for reaching Q4 goals. Focus on optimizing keywords related to local mental health services." : undefined 
      }));
  }, [tasksData]);

  // Use live digitalAssetsData for critical assets section
  const criticalAssets = useMemo(() => {
    if (digitalAssetsLoading || !digitalAssetsData) return [];
    
    return digitalAssetsData
      .filter(asset => asset.status === 'critical')
      .slice(0, 3)
      .map(asset => ({
        id: asset.id.toString(),
        name: asset.asset_name,
        type: asset.asset_type,
        status: asset.status,
        lastUpdated: asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A',
        priority: asset.priority
      }));
  }, [digitalAssetsData, digitalAssetsLoading]);

  // Data Gaps: Placeholder for dynamic data
  const dataGaps = useMemo(() => {
    return [
      'Google Business Profile insights last updated 3 days ago (Simulated)',
      'Facebook page analytics missing (Simulated)',
      'Competitor analysis needs refresh (Simulated)'
    ];
  }, []);

  const quickActions = [
    {
      title: 'AI Assistant',
      description: 'Generate content & insights',
      icon: Brain,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      onClick: () => onNavigate('ai-suite')
    },
    {
      title: 'Generate Report',
      description: 'Create performance analysis',
      icon: FileText,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClick: () => onNavigate('reports')
    },
    {
      title: 'View Ecosystem',
      description: 'Interactive asset mapping',
      icon: AlertTriangle,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClick: () => onNavigate('ecosystem')
    },
    {
      title: 'Analytics',
      description: 'Performance insights',
      icon: BarChart3,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      onClick: () => onNavigate('performance')
    }
  ];

  if (kpisLoading || tasksLoading || reviewsLoading || digitalAssetsLoading || updateTaskMutation.isPending) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Get insights into your digital ecosystem</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (kpisError || tasksError || reviewsError || digitalAssetsError) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Get insights into your digital ecosystem</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-destructive">Failed to load dashboard data. Please try again.</p>
          <p className="text-sm text-muted-foreground mt-2">
            {kpisError?.message || tasksError?.message || reviewsError?.message || digitalAssetsError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Get insights into your digital ecosystem</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-custom"></div> 
            <span className={cn(
              "text-sm text-muted-foreground",
              !isConnected && "text-destructive" 
            )}>
              {isConnected ? 'Live data from Supabase' : 'Offline Data'} 
            </span>
          </div>
        </div>
        <ExportMenu 
          data={{ dashboard: data }} 
          type="dashboard" 
          variant="default"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <StatCard 
            key={index} 
            data={kpi} 
            onClick={() => {
                if (kpi.title === 'Business Profile Views') {
                    onNavigate('performance', 'Business Profiles'); 
                } else if (kpi.title === 'Website Sessions') {
                    onNavigate('performance', 'Website Analytics'); 
                } else if (kpi.title === 'Review Rating') {
                    onNavigate('assets', 'review_platform'); 
                } else if (kpi.title === 'Task Completion') {
                    onNavigate('tasks', 'overdue_tasks'); 
                } else {
                    onNavigate('performance', kpi.title);
                }
            }}
            clickable={true} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Priority Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning mr-2" />
              Priority Tasks
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('tasks', 'priority:high')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedTask(task)}
                >
                  <Clock className="h-4 w-4 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="destructive" className="text-xs">
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All priority tasks completed!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Critical Issues
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('assets', 'status:critical')}
            >
              View Assets
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAssets.length > 0 ? (
              criticalAssets.map(asset => (
                <div 
                  key={asset.id} 
                  className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg cursor-pointer hover:bg-destructive/20 transition-colors"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{asset.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {asset.type.replace('_', ' ').toUpperCase()} • Last updated: {asset.lastUpdated}
                    </p>
                    <Badge variant="destructive" className="text-xs mt-2">
                      {asset.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No critical issues detected!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Gaps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning mr-2" />
              Data Gaps
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('system', 'data-gaps')}
            >
              System Check
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {dataGaps.map((gap, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg cursor-pointer hover:bg-warning/20 transition-colors"
                onClick={() => setSelectedDataGap(gap)}
              >
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <p className="text-sm text-foreground">{gap}</p>
              </div>
            ))}
            {dataGaps.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No data gaps reported!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="h-5 w-5 text-primary mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 cursor-pointer group"
                  onClick={action.onClick}
                >
                  <div className={`w-16 h-16 rounded-full ${action.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                    <IconComponent className={`h-8 w-8 ${action.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>Details for this priority task.</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <div className="col-span-3 text-muted-foreground">{selectedTask.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3"><Badge>{selectedTask.type.replace('_', ' ')}</Badge></div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Priority</Label>
                <div className="col-span-3"><Badge variant={selectedTask.priority === 'high' ? 'destructive' : 'default'}>{selectedTask.priority}</Badge></div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Due Date</Label>
                <div className="col-span-3 text-muted-foreground">{new Date(selectedTask.dueDate).toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3 text-muted-foreground">{selectedTask.completed ? 'Completed' : 'Pending'}</div>
              </div>
              {/* NEW: AI Insights section */}
              {selectedTask.ai_insights && (
                <div className="grid grid-cols-4 items-start gap-4 pt-4 border-t border-border">
                  <Label className="text-right">AI Insights</Label>
                  <div className="col-span-3 text-sm text-muted-foreground bg-accent/20 p-2 rounded-md">
                    {selectedTask.ai_insights}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            {selectedTask && !selectedTask.completed && (
              <Button onClick={handleMarkTaskComplete} disabled={updateTaskMutation.isPending}>
                {updateTaskMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Mark Complete
              </Button>
            )}
            <Button onClick={() => onNavigate('tasks', selectedTask?.id)}>View in Task Management</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Detail Dialog (Now used by row click and explicit View button) */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-2xl"> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAsset && (
                <>
                  {React.createElement(getAssetIcon(selectedAsset.asset_type), { className: "h-5 w-5" })}
                  {selectedAsset.asset_name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAsset && (
            <div className="space-y-6 py-4"> 
              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <Badge className={getStatusBadge(selectedAsset.status)}>
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

              {/* Metrics */}
              {selectedAsset.key_metrics_json && Object.keys(selectedAsset.key_metrics_json).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedAsset.key_metrics_json).map(([key, value]) => (
                      <div key={key} className="bg-muted/50 p-3 rounded-lg">
                        {/* Formatted key for display */}
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
                  <div><strong>Type:</strong> {selectedAsset.asset_type.replace(/_/g, ' ').toUpperCase()}</div>
                  <div><strong>Platform ID:</strong> {selectedAsset.platform_id_external || 'N/A'}</div>
                  <div><strong>Created:</strong> {selectedAsset.created_at ? new Date(selectedAsset.created_at).toLocaleDateString() : 'N/A'}</div>
                  <div><strong>Last Updated:</strong> {selectedAsset.updated_at ? new Date(selectedAsset.updated_at).toLocaleDateString() : (selectedAsset.created_at ? new Date(selectedAsset.created_at).toLocaleDateString() : 'N/A')}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6"> 
                <Button 
                    variant="secondary" 
                    onClick={handleEditAsset} 
                >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Asset
                </Button>
                {selectedAsset.url && (
                  <Button
                    onClick={() => window.open(selectedAsset.url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Asset
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/components/Dashboard.tsx
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExportMenu } from './ExportMenu';
import { DashboardData, KPICard } from '../types/dashboard';
import { AlertTriangle, CheckCircle, Clock, Zap, Brain, FileText, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { useLatestKPIs, useTasks, useReviews, useDigitalAssets } from '../hooks/useSupabaseAPI'; // Added useDigitalAssets
import { useMemo } from 'react';

interface DashboardProps {
  data: DashboardData; // This prop still provides mock data for static sections if needed.
  onNavigate: (tab: string, itemId?: string) => void; // Added itemId to onNavigate
}

export const Dashboard = ({ data, onNavigate }: DashboardProps) => {
  // Fetch live data from Supabase
  const { data: latestKPIs, isLoading: kpisLoading, error: kpisError } = useLatestKPIs();
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useReviews();
  const { data: digitalAssetsData, isLoading: digitalAssetsLoading, error: digitalAssetsError } = useDigitalAssets(); // Fetch live digital assets

  // Helper function to calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0; // Avoid division by zero
    return (((current - previous) / previous) * 100);
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

    // Dynamic KPI Calculations
    // Note: To get accurate "change" data, your kpi_time_series table needs historical data points for comparison periods.
    // For now, these are simplified or use mock comparison.

    // Business Profile Views (renamed from GMB Profile Views)
    const businessProfileViews = latestKPIs?.['Business Profile Views'] || latestKPIs?.['GMB Views'] || latestKPIs?.['GMB Profile Views'] || null;
    const bpViewsValue = businessProfileViews ? businessProfileViews.metric_value.toLocaleString() : 'N/A';
    const bpViewsChange = calculateChange(businessProfileViews?.metric_value || 0, 2500); // Placeholder 'previous' value for demo
    
    // Business Profile Actions (New KPI) - Placeholder, needs actual metric in DB
    const businessProfileActions = latestKPIs?.['Business Profile Actions'] || null;
    const bpActionsValue = businessProfileActions ? businessProfileActions.metric_value.toLocaleString() : 'N/A';
    const bpActionsChange = calculateChange(businessProfileActions?.metric_value || 0, 300); // Placeholder 'previous' value

    // Website Sessions
    const websiteSessions = latestKPIs?.['Website Sessions'] || latestKPIs?.['Website Traffic'] || null;
    const websiteValue = websiteSessions ? websiteSessions.metric_value.toLocaleString() : 'N/A';
    const websiteChange = calculateChange(websiteSessions?.metric_value || 0, 1100); // Placeholder 'previous' value

    // Website Conversion Rate (New KPI) - Placeholder, needs actual metric in DB
    const websiteConversionRate = latestKPIs?.['Website Conversion Rate'] || null;
    const conversionRateValue = websiteConversionRate ? `${websiteConversionRate.metric_value}%` : 'N/A';
    const conversionRateChange = calculateChange(websiteConversionRate?.metric_value || 0, 2.5); // Placeholder 'previous' value

    // Review Rating
    let reviewRating = 'N/A';
    let reviewChange = 0;
    let newReviewsCount = 0; // New stat
    if (reviewsData && reviewsData.length > 0) {
      const validRatings = reviewsData.filter(r => r.rating !== null && r.rating !== undefined);
      if (validRatings.length > 0) {
        const avgRating = validRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / validRatings.length;
        reviewRating = avgRating.toFixed(1);
        reviewChange = calculateChange(avgRating, 4.6); // Compare to baseline for demo
      }
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      newReviewsCount = reviewsData.filter(r => new Date(r.created_at || r.review_timestamp) >= oneMonthAgo).length;
    }
    
    // Task Completion
    let taskCompletion = 'N/A';
    let taskChange = 0;
    let overdueTasksCount = 0; // New stat
    if (tasksData && tasksData.length > 0) {
      const completedTasks = tasksData.filter(t => t.status === 'completed').length;
      const totalTasks = tasksData.length;
      if (totalTasks > 0) {
        const completionRate = Math.round((completedTasks / totalTasks) * 100);
        taskCompletion = `${completionRate}%`;
        taskChange = calculateChange(completionRate, 90); // Compare to baseline for demo
      }
      overdueTasksCount = tasksData.filter(t => t.status !== 'completed' && new Date(t.due_date) < new Date()).length;
    }

    return [
      {
        title: 'Business Profile Views', // Updated title
        value: bpViewsValue,
        change: parseFloat(bpViewsChange.toFixed(1)),
        trend: bpViewsChange >= 0 ? 'up' : 'down',
        icon: 'eye',
        subMetric: { label: 'Actions', value: bpActionsValue, change: parseFloat(bpActionsChange.toFixed(1)) } // Adding sub-metric for display in StatCard
      },
      {
        title: 'Website Sessions',
        value: websiteValue,
        change: parseFloat(websiteChange.toFixed(1)),
        trend: websiteChange >= 0 ? 'up' : 'down',
        icon: 'monitor',
        subMetric: { label: 'Conversion Rate', value: conversionRateValue, change: parseFloat(conversionRateChange.toFixed(1)) } // Adding sub-metric
      },
      {
        title: 'Review Rating',
        value: reviewRating,
        change: parseFloat(reviewChange.toFixed(1)),
        trend: reviewChange >= 0 ? 'up' : 'down',
        icon: 'star',
        subMetric: { label: 'New Reviews (30D)', value: newReviewsCount.toString(), change: 0 } // Adding sub-metric
      },
      {
        title: 'Task Completion',
        value: taskCompletion,
        change: parseFloat(taskChange.toFixed(1)),
        trend: taskChange >= 0 ? 'up' : 'down',
        icon: 'check',
        subMetric: { label: 'Overdue Tasks', value: overdueTasksCount.toString(), change: 0 } // Adding sub-metric
      }
    ];
  }, [latestKPIs, tasksData, reviewsData, kpisLoading, tasksLoading, reviewsLoading]);

  // Use live digitalAssetsData for critical assets section
  const criticalAssets = useMemo(() => {
    if (digitalAssetsLoading || !digitalAssetsData) return []; // Show empty or loading if data not ready
    
    return digitalAssetsData
      .filter(asset => asset.status === 'critical')
      .slice(0, 3) // Limit to top 3 critical assets
      .map(asset => ({
        id: asset.id.toString(),
        name: asset.asset_name,
        type: asset.asset_type,
        status: asset.status,
        lastUpdated: asset.last_updated ? new Date(asset.last_updated).toLocaleDateString() : 'N/A',
        priority: asset.priority // Added priority for consistency
      }));
  }, [digitalAssetsData, digitalAssetsLoading]);

  // Data Gaps: Placeholder for dynamic data
  const dataGaps = useMemo(() => {
    // In a real scenario, this would query a 'system_alerts' or 'data_integrity_logs' table
    // For now, returning a static list or dynamically deriving it from system checks
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
      icon: AlertTriangle, // Keep AlertTriangle for ecosystem for now, could be Globe
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

  // Show loading state if any critical data is loading
  if (kpisLoading || tasksLoading || reviewsLoading || digitalAssetsLoading) {
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

  // Show error state if there are critical errors
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
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Live data from Supabase</span>
          </div>
        </div>
        <ExportMenu 
          data={{ dashboard: data }} // Data prop for ExportMenu might still include mock data for non-dynamic sections
          type="dashboard" 
          variant="default"
        />
      </div>

      {/* KPI Cards - Now with live data and enhanced functionality */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <StatCard 
            key={index} 
            data={kpi} 
            onClick={() => onNavigate('performance', kpi.title)} // Make card clickable, navigate to performance with KPI title
            clickable={true} // Add clickable prop if StatCard supports it
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Priority Tasks - Now with live data */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning mr-2" />
              Priority Tasks
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('tasks', 'priority:high')} // Navigate to tasks, filter by high priority
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map(task => (
                <div key={task.id} className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg">
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

        {/* Critical Issues - Now dynamic from Supabase assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Critical Issues
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('assets', 'status:critical')} // Navigate to assets, filter by critical status
            >
              View Assets
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAssets.length > 0 ? (
              criticalAssets.map(asset => (
                <div key={asset.id} className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg">
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

        {/* Data Gaps - Placeholder for dynamic data */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning mr-2" />
              Data Gaps
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('system', 'data-gaps')} // Navigate to system, section on data gaps
            >
              System Check
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {dataGaps.map((gap, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
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
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, BarChart3, Activity, Loader2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { useKpiTimeSeries } from '../hooks/useSupabaseAPI';
import { KPICard } from '../types/dashboard';

interface PerformanceProps {
  data?: any; // Keep for compatibility but use Supabase data
}

export const Performance = ({ data }: PerformanceProps) => {
  const { data: kpiData, isLoading, error } = useKpiTimeSeries();

  // Transform Supabase data to KPI cards format
  const getPerformanceKPIs = (): KPICard[] => {
    if (!kpiData) return [];

    const latestKPIs = kpiData.reduce((acc: any, kpi: any) => {
      if (!acc[kpi.metric_name] || new Date(kpi.date) > new Date(acc[kpi.metric_name].date)) {
        acc[kpi.metric_name] = kpi;
      }
      return acc;
    }, {});

    const previousKPIs = kpiData.reduce((acc: any, kpi: any) => {
      const currentDate = new Date(kpi.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      if (currentDate <= oneMonthAgo) {
        if (!acc[kpi.metric_name] || new Date(kpi.date) > new Date(acc[kpi.metric_name].date)) {
          acc[kpi.metric_name] = kpi;
        }
      }
      return acc;
    }, {});

    const calculateChange = (current: number, previous: number) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };

    return [
      {
        title: 'Website Conversion Rate',
        value: `${latestKPIs['Website Conversion Rate']?.metric_value || 0}%`,
        change: calculateChange(
          latestKPIs['Website Conversion Rate']?.metric_value || 0,
          previousKPIs['Website Conversion Rate']?.metric_value || 0
        ),
        trend: latestKPIs['Website Conversion Rate']?.metric_value > (previousKPIs['Website Conversion Rate']?.metric_value || 0) ? 'up' : 'down',
        icon: 'monitor'
      },
      {
        title: 'GMB Call Clicks',
        value: `${latestKPIs['GMB Call Clicks']?.metric_value || 0}`,
        change: calculateChange(
          latestKPIs['GMB Call Clicks']?.metric_value || 0,
          previousKPIs['GMB Call Clicks']?.metric_value || 0
        ),
        trend: latestKPIs['GMB Call Clicks']?.metric_value > (previousKPIs['GMB Call Clicks']?.metric_value || 0) ? 'up' : 'down',
        icon: 'star'
      },
      {
        title: 'Domain Authority',
        value: `${latestKPIs['Domain Authority']?.metric_value || 0}`,
        change: calculateChange(
          latestKPIs['Domain Authority']?.metric_value || 0,
          previousKPIs['Domain Authority']?.metric_value || 0
        ),
        trend: latestKPIs['Domain Authority']?.metric_value > (previousKPIs['Domain Authority']?.metric_value || 0) ? 'up' : 'down',
        icon: 'check'
      },
      {
        title: 'Organic Website Sessions',
        value: `${latestKPIs['Organic Website Sessions']?.metric_value?.toLocaleString() || 0}`,
        change: calculateChange(
          latestKPIs['Organic Website Sessions']?.metric_value || 0,
          previousKPIs['Organic Website Sessions']?.metric_value || 0
        ),
        trend: latestKPIs['Organic Website Sessions']?.metric_value > (previousKPIs['Organic Website Sessions']?.metric_value || 0) ? 'up' : 'down',
        icon: 'eye'
      }
    ];
  };

  const performanceKPIs = getPerformanceKPIs();

  // Get conversion rate trend data from Supabase
  const getConversionRateData = () => {
    if (!kpiData) return [];
    
    return kpiData
      .filter((kpi: any) => kpi.metric_name === 'Website Conversion Rate')
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-5)
      .map((kpi: any) => ({
        month: new Date(kpi.date).toLocaleDateString('en-US', { month: 'long' }),
        rate: kpi.metric_value
      }));
  };

  const conversionRateData = getConversionRateData();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading performance data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
        </div>
        
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load performance data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
      </div>

      {/* Live KPI Cards from Supabase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceKPIs.map((kpi, index) => (
          <StatCard key={index} data={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Website Conversion Rate Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Website Conversion Rate Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionRateData.length > 0 ? (
                conversionRateData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={data.rate * 20} className="w-24" />
                      <span className="text-sm font-medium">{data.rate}%</span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No trend data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  Strong Digital Performance
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Website conversion rate has improved, indicating better user engagement and content optimization.
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 font-medium">
                  <Activity className="h-4 w-4" />
                  SEO Success
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Domain Authority shows improvement, demonstrating enhanced search engine credibility and backlink profile.
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 text-purple-800 font-medium">
                  <BarChart3 className="h-4 w-4" />
                  Local Engagement
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  GMB call clicks show strong local search presence and patient interest in your services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Organic Sessions</span>
                <span className="font-semibold">
                  {kpiData?.find((kpi: any) => kpi.metric_name === 'Organic Website Sessions')?.metric_value?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold">
                  {kpiData?.find((kpi: any) => kpi.metric_name === 'Website Conversion Rate')?.metric_value || 'N/A'}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Session Duration</span>
                <span className="font-semibold">2:34</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="font-semibold">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Profile Views</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Call Clicks</span>
                <span className="font-semibold">
                  {kpiData?.find((kpi: any) => kpi.metric_name === 'GMB Call Clicks')?.metric_value || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Direction Requests</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Website Clicks</span>
                <span className="font-semibold">342</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEMrush Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Domain Authority</span>
                <span className="font-semibold">
                  {kpiData?.find((kpi: any) => kpi.metric_name === 'Domain Authority')?.metric_value || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Organic Keywords</span>
                <span className="font-semibold">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Backlinks</span>
                <span className="font-semibold">1,567</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Referring Domains</span>
                <span className="font-semibold">89</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
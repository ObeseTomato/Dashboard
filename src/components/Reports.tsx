
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Download, Calendar, Clock, TrendingUp } from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface ReportsProps {
  data: DashboardData;
}

export const Reports = ({ data }: ReportsProps) => {
  const reports = [
    {
      id: 1,
      title: 'Monthly Performance Summary',
      type: 'Performance',
      generatedDate: '2024-07-01',
      status: 'ready',
      insights: 'Patient satisfaction up 5%, asset utilization steady'
    },
    {
      id: 2,
      title: 'Asset Utilization Analysis',
      type: 'Assets',
      generatedDate: '2024-06-28',
      status: 'ready',
      insights: 'MRI scanner showing high demand, consider scheduling optimization'
    },
    {
      id: 3,
      title: 'Task Completion Report',
      type: 'Operations',
      generatedDate: '2024-06-25',
      status: 'ready',
      insights: 'Maintenance tasks completed 94% on time this month'
    },
    {
      id: 4,
      title: 'Quarterly Trend Analysis',
      type: 'Analytics',
      generatedDate: '2024-06-30',
      status: 'generating',
      insights: 'Comprehensive quarterly performance trends and projections'
    }
  ];

  const upcomingReports = [
    { name: 'Weekly Operations Report', dueDate: '2024-07-08', frequency: 'Weekly' },
    { name: 'Patient Feedback Summary', dueDate: '2024-07-10', frequency: 'Bi-weekly' },
    { name: 'Financial Performance Report', dueDate: '2024-07-15', frequency: 'Monthly' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Reports</h1>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{report.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline">{report.type}</Badge>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.generatedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={report.status === 'ready' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {report.status === 'generating' && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {report.status}
                        </Badge>
                        {report.status === 'ready' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.insights}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReports.map((report, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">{report.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(report.dueDate).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {report.frequency}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Performance', 'Assets', 'Operations', 'Analytics', 'Financial'].map((category) => (
                  <Button key={category} variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

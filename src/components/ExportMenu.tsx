
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { exportService } from '../services/exportService';
import { useNotifications } from '../contexts/NotificationContext';
import { DigitalAsset, Task, DashboardData } from '../types/dashboard';

interface ExportMenuProps {
  data?: {
    assets?: DigitalAsset[];
    tasks?: Task[];
    dashboard?: DashboardData;
  };
  type: 'assets' | 'tasks' | 'dashboard';
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export const ExportMenu = ({ data, type, variant = 'outline', size = 'sm' }: ExportMenuProps) => {
  const { addNotification } = useNotifications();

  const handleExport = (format: 'csv' | 'pdf') => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (type) {
        case 'assets':
          if (data?.assets) {
            if (format === 'csv') {
              exportService.exportAssetsToCSV(data.assets, { 
                filename: `assets-${timestamp}` 
              });
            } else {
              exportService.exportAssetsToPDF(data.assets, { 
                filename: `assets-report-${timestamp}` 
              });
            }
          }
          break;
          
        case 'tasks':
          if (data?.tasks) {
            if (format === 'csv') {
              exportService.exportTasksToCSV(data.tasks, { 
                filename: `tasks-${timestamp}` 
              });
            } else {
              exportService.exportTasksToPDF(data.tasks, { 
                filename: `tasks-report-${timestamp}` 
              });
            }
          }
          break;
          
        case 'dashboard':
          if (data?.dashboard) {
            if (format === 'pdf') {
              exportService.exportDashboardToPDF(data.dashboard, { 
                filename: `dashboard-report-${timestamp}` 
              });
            }
          }
          break;
      }

      addNotification({
        title: 'Export Successful',
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} exported as ${format.toUpperCase()}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        title: 'Export Failed',
        message: 'There was an error exporting the data. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(type === 'assets' || type === 'tasks') && (
          <>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

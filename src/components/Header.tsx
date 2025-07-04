
import { Moon, Sun, Search, Keyboard, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { NotificationCenter } from './NotificationCenter';
import { MobileNavigation } from './MobileNavigation';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { RealTimeIndicator } from './RealTimeIndicator';
import { ExportMenu } from './ExportMenu';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useMobileLayout } from '../hooks/useMobileLayout';
import { ClinicInfo, DashboardData } from '../types/dashboard';
import { TabType } from './Tabs';

interface HeaderProps {
  clinic: ClinicInfo;
  lastUpdated: string;
  dataQuality: number;
  onSearchClick: () => void;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  dashboardData?: DashboardData;
}

export const Header = ({ 
  clinic, 
  lastUpdated, 
  dataQuality, 
  onSearchClick,
  activeTab,
  onTabChange,
  dashboardData
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const { isMobile, isTablet } = useMobileLayout();

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getQualityBg = (score: number) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  // Generate breadcrumb items based on active tab
  const getBreadcrumbItems = () => {
    const items = [
      { 
        label: 'Dashboard', 
        onClick: () => onTabChange?.('dashboard')
      }
    ];

    if (activeTab && activeTab !== 'dashboard') {
      const tabLabels: Record<TabType, string> = {
        dashboard: 'Dashboard',
        ecosystem: 'Visual Ecosystem',
        assets: 'Asset Log',
        tasks: 'Tasks',
        performance: 'Performance',
        competitors: 'Competitors',
        reports: 'Reports',
        'ai-suite': 'AI Suite',
        system: 'System & Integrity',
      };

      items.push({
        label: tabLabels[activeTab],
        onClick: () => onTabChange?.(activeTab)
      });
    }

    return items;
  };

  // Determine export data based on active tab
  const getExportData = () => {
    if (!dashboardData) return null;

    switch (activeTab) {
      case 'assets':
        return { data: { assets: dashboardData.assets }, type: 'assets' as const };
      case 'tasks':
        return { data: { tasks: dashboardData.tasks }, type: 'tasks' as const };
      case 'dashboard':
      default:
        return { data: { dashboard: dashboardData }, type: 'dashboard' as const };
    }
  };

  const exportProps = getExportData();

  return (
    <header className="bg-card border-b border-border">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            {/* Mobile Navigation */}
            {isMobile && activeTab && onTabChange && (
              <MobileNavigation 
                activeTab={activeTab} 
                onTabChange={onTabChange} 
              />
            )}
            
            <div className={`w-8 h-8 md:w-12 md:h-12 bg-primary rounded-lg flex items-center justify-center ${isMobile ? 'flex-shrink-0' : ''}`}>
              <span className="text-primary-foreground font-bold text-sm md:text-lg">DS</span>
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className={`font-bold text-foreground truncate ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                {isMobile ? 'Dashboard' : clinic.name}
              </h1>
              {!isMobile && (
                <p className="text-muted-foreground text-sm md:text-base">
                  Digital Ecosystem Dashboard
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-4 flex-shrink-0">
            {/* Real-time indicator */}
            <RealTimeIndicator />

            {/* Export functionality - Hidden on mobile to save space */}
            {!isMobile && exportProps && (
              <ExportMenu 
                data={exportProps.data} 
                type={exportProps.type}
                variant="ghost"
              />
            )}

            {/* Keyboard shortcuts info - Hidden on mobile */}
            {!isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p><kbd>⌘K</kbd> Search</p>
                    <p><kbd>Alt+1-9</kbd> Switch tabs</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Search button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onSearchClick}>
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Search {!isMobile && '(⌘K)'}
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDismiss={dismissNotification}
            />

            {/* Theme toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </TooltipContent>
            </Tooltip>

            {/* Data quality and last updated - Compact on mobile */}
            {!isMobile && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-foreground">{lastUpdated}</p>
                </div>
                
                <div className={`px-3 py-2 rounded-lg ${getQualityBg(dataQuality)}`}>
                  <p className="text-xs text-muted-foreground">Data Quality</p>
                  <p className={`font-bold ${getQualityColor(dataQuality)}`}>
                    {dataQuality}%
                  </p>
                </div>
              </div>
            )}
            
            {/* Mobile compact data quality */}
            {isMobile && (
              <div className={`px-2 py-1 rounded ${getQualityBg(dataQuality)}`}>
                <p className={`text-xs font-bold ${getQualityColor(dataQuality)}`}>
                  {dataQuality}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Breadcrumb navigation - Hidden on mobile to save space */}
      {!isMobile && activeTab && onTabChange && (
        <div className="px-4 md:px-6 pb-2">
          <BreadcrumbNavigation items={getBreadcrumbItems()} />
        </div>
      )}
    </header>
  );
};

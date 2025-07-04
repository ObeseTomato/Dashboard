import { useState } from 'react';
import { Header } from '../components/Header';
import { Tabs, TabType } from '../components/Tabs';
import { Dashboard } from '../components/Dashboard';
import { VisualEcosystem } from '../components/VisualEcosystem';
import { AssetLog } from '../components/AssetLog';
import { Tasks } from '../components/Tasks';
import { TaskManagement } from '../components/TaskManagement';
import { WebPages } from '../components/WebPages';
import { Performance } from '../components/Performance';
import { Competitors } from '../components/Competitors';
import { Reports } from '../components/Reports';
import { AISuite } from '../components/AISuite';
import { System } from '../components/System';
import { GlobalSearch } from '../components/GlobalSearch';
import { QuickActions } from '../components/QuickActions';
import { mockDashboardData } from '../data/mockData';
import { DashboardData, Task } from '../types/dashboard';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useNotifications } from '../contexts/NotificationContext';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import { produce } from 'immer';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { addNotification } = useNotifications();

  // Real-time updates
  useRealTimeUpdates({
    onAssetUpdate: (data) => {
      console.log('Asset update received:', data);
      setDashboardData(produce(dashboardData, draft => {
        draft.lastUpdated = new Date().toLocaleString();
        if (data.type === 'data_quality') {
          draft.dataQuality = data.value;
        }
      }));
    },
    onTaskUpdate: (data) => {
      console.log('Task update received:', data);
    },
    onMetricUpdate: (data) => {
      console.log('Metric update received:', data);
      if (data.type === 'data_quality') {
        setDashboardData(produce(dashboardData, draft => {
          draft.dataQuality = data.value;
          draft.lastUpdated = new Date().toLocaleString();
        }));
      }
    }
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedAssetId(null);
  };

  const handleNavigate = (tab: string, itemId?: string) => {
    setActiveTab(tab as TabType);
    if (itemId) {
      setSelectedAssetId(itemId);
    }
  };

  const handleAssetClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    console.log('Asset clicked:', assetId);
  };

  const handleTaskUpdate = (tasks: Task[]) => {
    setDashboardData(produce(dashboardData, draft => {
      draft.tasks = tasks;
    }));
    
    addNotification({
      title: 'Tasks Updated',
      message: 'Task list has been successfully updated',
      type: 'success'
    });
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleNewItem = () => {
    addNotification({
      title: 'New Item',
      message: 'This feature will be implemented soon',
      type: 'info'
    });
  };

  const handleSettings = () => {
    addNotification({
      title: 'Settings',
      message: 'Settings panel will be available soon',
      type: 'info'
    });
  };

  const handleHelp = () => {
    addNotification({
      title: 'Help',
      message: 'Help documentation is coming soon',
      type: 'info'
    });
  };

  useKeyboardShortcuts({
    onTabChange: handleTabChange,
    onSearch: handleSearchOpen
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={dashboardData} onNavigate={handleNavigate} />;
      case 'ecosystem':
        return (
          <VisualEcosystem 
            data={dashboardData} 
            onAssetClick={handleAssetClick}
            onNavigate={handleNavigate}
          />
        );
      case 'assets':
        return (
          <AssetLog 
            data={dashboardData} 
            onAssetClick={handleAssetClick} 
          />
        );
      case 'tasks':
        return (
          <TaskManagement 
            data={dashboardData} 
            onTaskUpdate={handleTaskUpdate}
          />
        );
      case 'web-pages':
        return <WebPages data={dashboardData} />;
      case 'performance':
        return <Performance data={dashboardData} />;
      case 'competitors':
        return <Competitors data={dashboardData} />;
      case 'reports':
        return <Reports data={dashboardData} />;
      case 'ai-suite':
        return <AISuite data={dashboardData} />;
      case 'system':
        return <System data={dashboardData} />;
      default:
        return <Dashboard data={dashboardData} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header 
        clinic={dashboardData.clinic}
        lastUpdated={dashboardData.lastUpdated}
        dataQuality={dashboardData.dataQuality}
        onSearchClick={handleSearchOpen}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        dashboardData={dashboardData}
      />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="transition-all duration-300 px-2 md:px-0">
        {renderTabContent()}
      </main>
      
      <GlobalSearch
        data={dashboardData}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <QuickActions
        onSearch={handleSearchOpen}
        onNewItem={handleNewItem}
        onSettings={handleSettings}
        onHelp={handleHelp}
      />
    </div>
  );
};

export default Index;
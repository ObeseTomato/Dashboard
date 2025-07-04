export type TabType = 
  | 'dashboard'
  | 'ecosystem'
  | 'assets'
  | 'tasks'
  | 'web-pages'
  | 'performance'
  | 'competitors'
  | 'reports'
  | 'ai-suite'
  | 'system';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const mainTabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard' },
    { id: 'ecosystem' as TabType, label: 'Visual Ecosystem' },
    { id: 'assets' as TabType, label: 'Asset Log' },
    { id: 'tasks' as TabType, label: 'Task Management' },
    { id: 'web-pages' as TabType, label: 'Web Pages' },
    { id: 'performance' as TabType, label: 'Performance' },
    { id: 'competitors' as TabType, label: 'Competitors' },
    { id: 'reports' as TabType, label: 'Reports' },
    { id: 'ai-suite' as TabType, label: 'AI Suite' },
  ];

  const systemTabs = [
    { id: 'system' as TabType, label: 'System & Integrity' },
  ];

  return (
    <nav className="bg-card border-b border-border px-6">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
        
        <div className="relative">
          <button
            onClick={() => onTabChange('system')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'system'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            System
          </button>
        </div>
      </div>
    </nav>
  );
};
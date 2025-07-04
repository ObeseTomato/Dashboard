
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { TabType } from './Tabs';

interface MobileNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', shortcut: '1' },
  { id: 'ecosystem', label: 'Ecosystem', shortcut: '2' },
  { id: 'assets', label: 'Assets', shortcut: '3' },
  { id: 'tasks', label: 'Tasks', shortcut: '4' },
  { id: 'performance', label: 'Performance', shortcut: '5' },
  { id: 'competitors', label: 'Competitors', shortcut: '6' },
  { id: 'reports', label: 'Reports', shortcut: '7' },
  { id: 'ai-suite', label: 'AI Suite', shortcut: '8' },
  { id: 'system', label: 'System', shortcut: '9' }
] as const;

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tabId: TabType) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => handleTabClick(tab.id as TabType)}
            >
              <span className="flex-1">{tab.label}</span>
              <span className="text-xs text-muted-foreground">Alt+{tab.shortcut}</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

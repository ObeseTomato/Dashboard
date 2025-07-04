
import React, { useState } from 'react';
import { Plus, Search, Settings, HelpCircle, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useMobileLayout } from '../hooks/useMobileLayout';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}

interface QuickActionsProps {
  onSearch: () => void;
  onNewItem?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  customActions?: QuickAction[];
}

export const QuickActions = ({
  onSearch,
  onNewItem,
  onSettings,
  onHelp,
  customActions = [],
}: QuickActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile } = useMobileLayout();

  const defaultActions: QuickAction[] = [
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="h-4 w-4" />,
      onClick: onSearch,
      shortcut: '⌘K',
    },
    ...(onNewItem ? [{
      id: 'new',
      label: 'New Item',
      icon: <Plus className="h-4 w-4" />,
      onClick: onNewItem,
    }] : []),
    ...(onSettings ? [{
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: onSettings,
    }] : []),
    ...(onHelp ? [{
      id: 'help',
      label: 'Help',
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: onHelp,
    }] : []),
    ...customActions,
  ];

  const handleMainButtonClick = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    } else {
      onSearch();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col-reverse items-end space-y-reverse space-y-2">
        {/* Action buttons */}
        {(isExpanded || !isMobile) && (
          <div className="flex flex-col space-y-2 mb-2">
            {defaultActions.slice(isMobile ? 0 : 1).map((action) => (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => {
                      action.onClick();
                      if (isMobile) setIsExpanded(false);
                    }}
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div className="flex items-center space-x-2">
                    <span>{action.label}</span>
                    {action.shortcut && !isMobile && (
                      <span className="text-xs text-muted-foreground">
                        {action.shortcut}
                      </span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {/* Main button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={isMobile ? "default" : "sm"}
              className={`rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                isMobile ? 'h-14 w-14' : 'h-12 w-12'
              }`}
              onClick={handleMainButtonClick}
            >
              {isMobile ? (
                isExpanded ? <Plus className="h-6 w-6 rotate-45" /> : <Zap className="h-6 w-6" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isMobile ? 'Quick Actions' : 'Search (⌘K)'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

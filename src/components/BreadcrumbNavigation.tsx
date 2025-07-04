
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useMobileLayout } from '../hooks/useMobileLayout';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  maxItems?: number;
}

export const BreadcrumbNavigation = ({ items, maxItems = 3 }: BreadcrumbNavigationProps) => {
  const { isMobile } = useMobileLayout();

  const displayItems = isMobile && items.length > maxItems 
    ? [items[0], { label: '...', path: undefined }, ...items.slice(-1)]
    : items;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 hover:text-foreground"
        onClick={() => items[0]?.onClick?.()}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {displayItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
          {item.path !== undefined ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 hover:text-foreground font-normal"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          ) : (
            <span className={index === displayItems.length - 1 ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

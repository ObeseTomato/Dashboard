import { useEffect } from 'react';
import { TabType } from '../components/Tabs';

interface KeyboardShortcutsProps {
  onTabChange: (tab: TabType) => void;
  onSearch: () => void;
}

export const useKeyboardShortcuts = ({ onTabChange, onSearch }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onSearch();
        return;
      }

      if (event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
        const tabMap: { [key: string]: TabType } = {
          '1': 'dashboard',
          '2': 'ecosystem',
          '3': 'assets',
          '4': 'tasks',
          '5': 'web-pages',
          '6': 'performance',
          '7': 'competitors',
          '8': 'reports',
          '9': 'ai-suite'
        };

        if (tabMap[event.key]) {
          event.preventDefault();
          onTabChange(tabMap[event.key]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange, onSearch]);
};
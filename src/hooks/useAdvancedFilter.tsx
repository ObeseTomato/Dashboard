
import { useState, useMemo } from 'react';
import { FilterCriteria } from '../components/AdvancedFilter';
import { DigitalAsset, Task } from '../types/dashboard';

export const useAdvancedFilter = <T extends DigitalAsset | Task>(items: T[]) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          'name' in item ? item.name : '',
          'title' in item ? item.title : '',
          'description' in item ? item.description : '',
          'type' in item ? item.type : ''
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Asset-specific filters
      if ('type' in item) {
        const asset = item as DigitalAsset;
        
        if (filters.assetType && asset.type !== filters.assetType) {
          return false;
        }
        
        if (filters.assetStatus && asset.status !== filters.assetStatus) {
          return false;
        }
      }

      // Task-specific filters
      if ('title' in item) {
        const task = item as Task;
        
        if (filters.taskType && task.type !== filters.taskType) {
          return false;
        }
        
        if (filters.completed !== undefined && task.completed !== filters.completed) {
          return false;
        }
      }

      // Priority filter (both assets and tasks have priority)
      if (filters.priority && item.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [items, filters]);

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterCriteria];
    return value !== undefined && value !== '';
  });

  return {
    filters,
    setFilters,
    filteredItems,
    clearFilters,
    hasActiveFilters
  };
};

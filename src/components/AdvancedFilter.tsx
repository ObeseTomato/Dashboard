
import { useState } from 'react';
import { Filter, X, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AssetStatus, AssetType, Priority, TaskType } from '../types/dashboard';

export interface FilterCriteria {
  search?: string;
  assetType?: AssetType;
  assetStatus?: AssetStatus;
  taskType?: TaskType;
  priority?: Priority;
  dateRange?: {
    from: string;
    to: string;
  };
  completed?: boolean;
}

interface AdvancedFilterProps {
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
  onClear: () => void;
  type: 'assets' | 'tasks' | 'all';
}

export const AdvancedFilter = ({ filters, onFiltersChange, onClear, type }: AdvancedFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const removeFilter = (key: keyof FilterCriteria) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof FilterCriteria];
      return value !== undefined && value !== '';
    }).length;
  };

  const getFilterBadges = () => {
    const badges = [];
    
    if (filters.search) {
      badges.push({ key: 'search', label: `Search: ${filters.search}`, value: filters.search });
    }
    if (filters.assetType) {
      badges.push({ key: 'assetType', label: `Type: ${filters.assetType.replace('_', ' ')}`, value: filters.assetType });
    }
    if (filters.assetStatus) {
      badges.push({ key: 'assetStatus', label: `Status: ${filters.assetStatus}`, value: filters.assetStatus });
    }
    if (filters.taskType) {
      badges.push({ key: 'taskType', label: `Task: ${filters.taskType.replace('_', ' ')}`, value: filters.taskType });
    }
    if (filters.priority) {
      badges.push({ key: 'priority', label: `Priority: ${filters.priority}`, value: filters.priority });
    }
    if (filters.completed !== undefined) {
      badges.push({ key: 'completed', label: `Completed: ${filters.completed ? 'Yes' : 'No'}`, value: filters.completed });
    }
    
    return badges;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Advanced Filters</h4>
                <Button variant="ghost" size="sm" onClick={onClear}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-3">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or description..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Asset-specific filters */}
                {(type === 'assets' || type === 'all') && (
                  <>
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select
                        value={filters.assetType || ''}
                        onValueChange={(value) => handleFilterChange('assetType', value || undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="gmb">Google My Business</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="social_media">Social Media</SelectItem>
                          <SelectItem value="directory">Directory</SelectItem>
                          <SelectItem value="review_platform">Review Platform</SelectItem>
                          <SelectItem value="advertising">Advertising</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Asset Status</Label>
                      <Select
                        value={filters.assetStatus || ''}
                        onValueChange={(value) => handleFilterChange('assetStatus', value || undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Task-specific filters */}
                {(type === 'tasks' || type === 'all') && (
                  <>
                    <div className="space-y-2">
                      <Label>Task Type</Label>
                      <Select
                        value={filters.taskType || ''}
                        onValueChange={(value) => handleFilterChange('taskType', value || undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="content_creation">Content Creation</SelectItem>
                          <SelectItem value="optimization">Optimization</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Completion Status</Label>
                      <Select
                        value={filters.completed === undefined ? '' : filters.completed.toString()}
                        onValueChange={(value) => handleFilterChange('completed', value === '' ? undefined : value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Tasks</SelectItem>
                          <SelectItem value="true">Completed</SelectItem>
                          <SelectItem value="false">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Priority filter */}
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={filters.priority || ''}
                    onValueChange={(value) => handleFilterChange('priority', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {getFilterBadges().length > 0 && (
        <div className="flex flex-wrap gap-1">
          {getFilterBadges().map((badge) => (
            <Badge key={badge.key} variant="secondary" className="gap-1">
              {badge.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter(badge.key as keyof FilterCriteria)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { DashboardData } from '../types/dashboard';

interface GlobalSearchProps {
  data: DashboardData;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, itemId?: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'asset' | 'task' | 'competitor';
  category: string;
}

export const GlobalSearch = ({ data, isOpen, onClose, onNavigate }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];

    // Search assets
    data.assets
      .filter(asset => 
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.type.toLowerCase().includes(query.toLowerCase())
      )
      .forEach(asset => {
        searchResults.push({
          id: asset.id,
          title: asset.name,
          description: `${asset.type.replace('_', ' ')} • ${asset.status}`,
          type: 'asset',
          category: 'Assets'
        });
      });

    // Search tasks
    data.tasks
      .filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
      )
      .forEach(task => {
        searchResults.push({
          id: task.id,
          title: task.title,
          description: task.description,
          type: 'task',
          category: 'Tasks'
        });
      });

    // Search competitors
    data.competitors
      .filter(competitor => 
        competitor.name.toLowerCase().includes(query.toLowerCase()) ||
        competitor.category.toLowerCase().includes(query.toLowerCase())
      )
      .forEach(competitor => {
        searchResults.push({
          id: competitor.id,
          title: competitor.name,
          description: `${competitor.category} • ${competitor.rating}★`,
          type: 'competitor',
          category: 'Competitors'
        });
      });

    setResults(searchResults.slice(0, 10));
  }, [query, data]);

  const handleResultClick = (result: SearchResult) => {
    const tabMap = {
      asset: 'assets',
      task: 'tasks',
      competitor: 'competitors'
    };
    onNavigate(tabMap[result.type], result.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden mx-4 md:mx-auto">
        <DialogHeader>
          <DialogTitle>Search Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets, tasks, competitors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 text-base md:text-sm"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="max-h-80 md:max-h-96 overflow-y-auto space-y-2">
            {results.length > 0 ? (
              results.map((result) => (
                <div
                  key={result.id}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors active:bg-accent/80"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{result.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2 text-xs flex-shrink-0">
                      {result.category}
                    </Badge>
                  </div>
                </div>
              ))
            ) : query ? (
              <div className="text-center py-8 text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Start typing to search...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

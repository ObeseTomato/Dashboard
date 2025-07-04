import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { 
  Globe, 
  FileText, 
  Search, 
  Clock, 
  Users, 
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Target,
  Zap,
  Plus,
  Loader2
} from 'lucide-react';
import { useWebPages, useCreateWebPage, useUpdateWebPage } from '../hooks/useSupabaseAPI';
import { useToast } from '../hooks/use-toast';

interface WebPagesProps {
  data?: any; // Keep for compatibility but use Supabase data
}

interface NewWebPage {
  url: string;
  title: string;
  status: 'live' | 'draft' | 'error';
  meta_description: string;
  keywords: string[]; // Array to match schema
}

export const WebPages = ({ data }: WebPagesProps) => {
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState<NewWebPage>({
    url: '',
    title: '',
    status: 'draft',
    meta_description: '',
    keywords: ''
  });
  const { toast } = useToast();

  // Supabase hooks
  const { data: webPagesData, isLoading, error } = useWebPages();
  const createPageMutation = useCreateWebPage();
  const updatePageMutation = useUpdateWebPage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const createWebPage = async () => {
    try {
      if (!newPage.url.trim() || !newPage.title.trim()) {
        toast({
          title: "Validation Error",
          description: "URL and title are required.",
          variant: "destructive"
        });
        return;
      }

      // Convert keywords string to array for database
      const pageData = {
        ...newPage,
        keywords: typeof newPage.keywords === 'string' 
          ? newPage.keywords.split(',').map(k => k.trim()) 
          : newPage.keywords
      };

      await createPageMutation.mutateAsync(pageData);

      // Reset form
      setNewPage({
        url: '',
        title: '',
        status: 'draft',
        meta_description: '',
        keywords: ''
      });

      setIsCreateDialogOpen(false);
      
      toast({
        title: "Page Created",
        description: "New web page has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create web page.",
        variant: "destructive"
      });
    }
  };

  const updatePageStatus = async (pageId: number, newStatus: string) => {
    try {
      await updatePageMutation.mutateAsync({
        id: pageId,
        updates: { status: newStatus }
      });
      
      toast({
        title: "Page Updated",
        description: "Page status has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page status.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Web Pages</h2>
            <p className="text-muted-foreground">
              Manage your website content, structure, and performance
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading web pages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Web Pages</h2>
            <p className="text-muted-foreground">
              Manage your website content, structure, and performance
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load web pages. Please try again.</p>
        </div>
      </div>
    );
  }

  const sitePages = webPagesData || [];
  const totalPageViews = sitePages.reduce((sum: number, page: any) => sum + (page.page_views || 0), 0);
  const avgSEOScore = sitePages.length > 0 ? Math.round(sitePages.reduce((sum: number, page: any) => sum + (page.seo_score || 0), 0) / sitePages.length) : 0;
  const totalIssues = sitePages.reduce((sum: number, page: any) => sum + (page.issues_found || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Web Pages</h2>
          <p className="text-muted-foreground">
            Manage your website content, structure, and performance
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={createPageMutation.isPending}>
                {createPageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Web Page</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    value={newPage.url}
                    onChange={(e) => setNewPage({...newPage, url: e.target.value})}
                    placeholder="/new-page"
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newPage.title}
                    onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                    placeholder="Page Title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={newPage.meta_description}
                    onChange={(e) => setNewPage({...newPage, meta_description: e.target.value})}
                    placeholder="Brief description for search engines"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={Array.isArray(newPage.keywords) ? newPage.keywords.join(', ') : newPage.keywords}
                    onChange={(e) => setNewPage({...newPage, keywords: e.target.value.split(',').map(k => k.trim())})}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createWebPage} disabled={createPageMutation.isPending}>
                    {createPageMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Page'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Optimize Pages
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{sitePages.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
                <p className="text-2xl font-bold">{totalPageViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg SEO Score</p>
                <p className={`text-2xl font-bold ${getSEOScoreColor(avgSEOScore)}`}>{avgSEOScore}%</p>
              </div>
              <Search className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues Found</p>
                <p className="text-2xl font-bold text-red-600">{totalIssues}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">Page Analysis</TabsTrigger>
          <TabsTrigger value="seo">SEO Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pages List */}
            <Card>
              <CardHeader>
                <CardTitle>All Pages ({sitePages.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sitePages.map((page: any) => (
                  <div 
                    key={page.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${
                      selectedPage?.id === page.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{page.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(page.status)}>
                          {page.status}
                        </Badge>
                        {page.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePageStatus(page.id, 'live');
                            }}
                            disabled={updatePageMutation.isPending}
                          >
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{page.url}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {(page.page_views || 0).toLocaleString()}
                        </span>
                        <span className={`font-medium ${getSEOScoreColor(page.seo_score || 0)}`}>
                          SEO: {page.seo_score || 0}%
                        </span>
                      </div>
                    </div>
                    
                    {page.issues_found && page.issues_found > 0 && (
                      <div className="mt-2 flex items-center text-xs text-red-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {page.issues_found} issue{page.issues_found > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Page Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedPage ? 'Page Details' : 'Select a Page'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPage ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{selectedPage.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{selectedPage.url}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Page Views</p>
                          <p className="font-semibold">{(selectedPage.page_views || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">SEO Score</p>
                          <p className={`font-semibold ${getSEOScoreColor(selectedPage.seo_score || 0)}`}>
                            {selectedPage.seo_score || 0}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">SEO Analysis</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>SEO Score</span>
                            <span className={getSEOScoreColor(selectedPage.seo_score || 0)}>
                              {selectedPage.seo_score || 0}%
                            </span>
                          </div>
                          <Progress value={selectedPage.seo_score || 0} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {selectedPage.meta_description && (
                      <div>
                        <h4 className="font-medium mb-2">Meta Description</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {selectedPage.meta_description}
                        </p>
                      </div>
                    )}

                    {selectedPage.keywords && selectedPage.keywords.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPage.keywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPage.issues_found && selectedPage.issues_found > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-red-600">Issues</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-red-600">
                            <AlertTriangle className="h-3 w-3 mr-2" />
                            {selectedPage.issues_found} issue{selectedPage.issues_found > 1 ? 's' : ''} found
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a page from the list to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sitePages.map((page: any) => (
                  <div key={page.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{page.title}</p>
                      <p className="text-xs text-muted-foreground">{page.url}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getSEOScoreColor(page.seo_score || 0)}`}>
                        {page.seo_score || 0}%
                      </p>
                      {page.issues_found && page.issues_found > 0 && (
                        <p className="text-xs text-red-600">
                          {page.issues_found} issue{page.issues_found > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center text-blue-800 font-medium mb-1">
                    <Target className="h-4 w-4 mr-2" />
                    High Priority
                  </div>
                  <p className="text-sm text-blue-700">
                    Add meta descriptions to pages missing them
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center text-yellow-800 font-medium mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Medium Priority
                  </div>
                  <p className="text-sm text-yellow-700">
                    Optimize page load times for better user experience
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center text-green-800 font-medium mb-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Good Performance
                  </div>
                  <p className="text-sm text-green-700">
                    Most pages have good SEO scores and engagement
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sitePages
                  .filter((p: any) => p.status === 'live')
                  .sort((a: any, b: any) => (b.page_views || 0) - (a.page_views || 0))
                  .slice(0, 5)
                  .map((page: any, index: number) => (
                    <div key={page.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{page.title}</p>
                          <p className="text-xs text-muted-foreground">{page.url}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{(page.page_views || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center text-green-800 font-medium mb-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Strong Performance
                  </div>
                  <p className="text-sm text-green-700">
                    Your homepage is performing well with high engagement
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center text-blue-800 font-medium mb-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Optimization Opportunity
                  </div>
                  <p className="text-sm text-blue-700">
                    Consider adding more content to pages with low engagement
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
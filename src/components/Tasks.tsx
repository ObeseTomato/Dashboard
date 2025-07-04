import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { DashboardData, Task } from '../types/dashboard';
import { 
  CheckCircle, 
  Clock, 
  Plus, 
  Target, 
  Sparkles, 
  Calendar,
  AlertTriangle,
  Users,
  PenTool,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useToast } from '../hooks/use-toast';

interface TasksProps {
  data: DashboardData;
  onTaskUpdate: (tasks: Task[]) => void;
}

export const Tasks = ({ data, onTaskUpdate }: TasksProps) => {
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const [campaignGoal, setCampaignGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'content_creation': return PenTool;
      case 'optimization': return BarChart3;
      case 'monitoring': return Clock;
      case 'engagement': return MessageSquare;
      case 'analysis': return BarChart3;
      default: return Target;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'content_creation': return 'bg-blue-100 text-blue-800';
      case 'optimization': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'engagement': return 'bg-purple-100 text-purple-800';
      case 'analysis': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingTasks = data.tasks.filter(task => !task.completed);
  const completedTasks = data.tasks.filter(task => task.completed);

  const toggleTaskComplete = (taskId: string) => {
    const updatedTasks = data.tasks.map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    );
    onTaskUpdate(updatedTasks);
    
    toast({
      title: "Task Updated",
      description: "Task status has been updated successfully."
    });
  };

  const generateAiCampaign = async () => {
    if (!campaignGoal.trim()) {
      toast({
        title: "Goal Required",
        description: "Please enter a campaign goal to generate tasks.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI task generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTasks: Task[] = [
        {
          id: `ai-task-${Date.now()}-1`,
          title: `Create content strategy for: ${campaignGoal}`,
          description: 'Develop comprehensive content calendar and messaging framework',
          type: 'content_creation',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false,
          aiGenerated: true
        },
        {
          id: `ai-task-${Date.now()}-2`,
          title: 'Design social media posts',
          description: 'Create engaging visuals and copy for Instagram and Facebook',
          type: 'content_creation',
          priority: 'medium',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false,
          aiGenerated: true
        },
        {
          id: `ai-task-${Date.now()}-3`,
          title: 'Monitor campaign performance',
          description: 'Track engagement metrics and adjust strategy as needed',
          type: 'monitoring',
          priority: 'medium',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false,
          aiGenerated: true
        }
      ];

      onTaskUpdate([...data.tasks, ...newTasks]);
      
      toast({
        title: "AI Campaign Generated",
        description: `Created ${newTasks.length} strategic tasks for your campaign.`
      });
      
      setCampaignGoal('');
      setShowAiPlanner(false);
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate campaign tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">
            Organize and track your digital marketing activities
          </p>
        </div>
        <Button 
          onClick={() => setShowAiPlanner(!showAiPlanner)}
          className="bg-primary hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Campaign Planner
        </Button>
      </div>

      {/* AI Campaign Planner */}
      {showAiPlanner && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI Campaign Planner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Campaign Goal</label>
              <Input
                placeholder="e.g., Increase therapy session bookings by 20% during holiday season"
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={generateAiCampaign}
                disabled={isGenerating}
                className="bg-primary hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generate Strategic Tasks
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAiPlanner(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <span>Upcoming Tasks</span>
              <Badge variant="outline">{upcomingTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => {
                const Icon = getTaskIcon(task.type);
                const isOverdue = new Date(task.dueDate) < new Date();
                
                return (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                        {task.aiGenerated && (
                          <Sparkles className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={getTaskTypeColor(task.type)}
                        >
                          {task.type.replace('_', ' ')}
                        </Badge>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : 
                                 task.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <div className={`flex items-center space-x-1 text-xs ${
                        isOverdue ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {isOverdue && <AlertTriangle className="h-3 w-3" />}
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="text-muted-foreground">All tasks completed!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Completed Tasks</span>
              <Badge variant="outline">{completedTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.slice(0, 5).map(task => {
                const Icon = getTaskIcon(task.type);
                
                return (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-lg bg-muted/30 opacity-75"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-foreground line-through">
                          {task.title}
                        </h4>
                        {task.aiGenerated && (
                          <Sparkles className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        <CheckCircle className="h-4 w-4 text-success" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-through">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                        className="opacity-75"
                      >
                        {task.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No completed tasks yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
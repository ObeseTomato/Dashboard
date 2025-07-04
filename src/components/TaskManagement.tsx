import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { 
  CheckCircle, 
  Clock, 
  Plus, 
  Target, 
  Calendar,
  AlertTriangle,
  PenTool,
  BarChart3,
  MessageSquare,
  Filter,
  Loader2,
  Trash2
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useSupabaseAPI';

interface TaskManagementProps {
  data?: any; // Keep for compatibility but use Supabase data
  onTaskUpdate?: (tasks: any[]) => void; // Keep for compatibility
}

interface NewTask {
  task_name: string;
  description: string;
  status: 'upcoming' | 'completed';
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content_creation' | 'optimization' | 'monitoring' | 'engagement' | 'analysis';
}

export const TaskManagement = ({ data, onTaskUpdate }: TaskManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [newTask, setNewTask] = useState<NewTask>({
    task_name: '',
    description: '',
    status: 'upcoming',
    due_date: '',
    priority: 'medium',
    category: 'content_creation'
  });
  const { toast } = useToast();

  // Supabase hooks
  const { data: tasksData, isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

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

  // Transform Supabase data to match frontend format
  const transformedTasks = tasksData?.map((task: any) => ({
    id: task.id.toString(),
    title: task.task_name,
    description: task.description,
    type: task.category,
    priority: task.priority,
    dueDate: task.due_date,
    completed: task.status === 'completed',
    aiGenerated: false
  })) || [];

  // Filter tasks based on current filters
  const filteredTasks = transformedTasks.filter((task: any) => {
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'upcoming' && !task.completed) ||
      (filterStatus === 'completed' && task.completed);
    
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    
    return statusMatch && priorityMatch;
  });

  const upcomingTasks = filteredTasks.filter((task: any) => !task.completed);
  const completedTasks = filteredTasks.filter((task: any) => task.completed);

  const toggleTaskComplete = async (taskId: number) => {
    try {
      const task = tasksData?.find((t: any) => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'upcoming' : 'completed';
      
      await updateTaskMutation.mutateAsync({
        id: taskId,
        updates: { status: newStatus }
      });
      
      toast({
        title: "Task Updated",
        description: "Task status has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive"
      });
    }
  };

  const createTask = async () => {
    try {
      if (!newTask.task_name.trim() || !newTask.description.trim() || !newTask.due_date) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      await createTaskMutation.mutateAsync(newTask);

      // Reset form
      setNewTask({
        task_name: '',
        description: '',
        status: 'upcoming',
        due_date: '',
        priority: 'medium',
        category: 'content_creation'
      });

      setIsCreateDialogOpen(false);
      
      toast({
        title: "Task Created",
        description: "New task has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
            <p className="text-muted-foreground">
              Organize and track your digital marketing activities
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
            <p className="text-muted-foreground">
              Organize and track your digital marketing activities
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load tasks. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">
            Organize and track your digital marketing activities
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task_name">Task Name *</Label>
                <Input
                  id="task_name"
                  value={newTask.task_name}
                  onChange={(e) => setNewTask({...newTask, task_name: e.target.value})}
                  placeholder="Enter task name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newTask.status} onValueChange={(value: 'upcoming' | 'completed') => setNewTask({...newTask, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newTask.category} onValueChange={(value: any) => setNewTask({...newTask, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_creation">Content Creation</SelectItem>
                    <SelectItem value="optimization">Optimization</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="due_date">Due Date *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTask} disabled={createTaskMutation.isPending}>
                  {createTaskMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Priority</Label>
              <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
              upcomingTasks.map((task: any) => {
                const Icon = getTaskIcon(task.type);
                const isOverdue = new Date(task.dueDate) < new Date();
                const taskId = parseInt(task.id);
                
                return (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskComplete(taskId)}
                          disabled={updateTaskMutation.isPending}
                        >
                          {updateTaskMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(taskId)}
                          disabled={deleteTaskMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          {deleteTaskMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                <p className="text-muted-foreground">No upcoming tasks!</p>
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
              completedTasks.slice(0, 5).map((task: any) => {
                const Icon = getTaskIcon(task.type);
                const taskId = parseInt(task.id);
                
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
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskComplete(taskId)}
                          disabled={updateTaskMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 text-success" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(taskId)}
                          disabled={deleteTaskMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{transformedTasks.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{upcomingTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {transformedTasks.length > 0 ? Math.round((completedTasks.length / transformedTasks.length) * 100) : 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
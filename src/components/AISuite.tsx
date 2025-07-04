import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Brain, MessageSquare, FileText, BarChart3, Zap, Sparkles, Send, Loader2 } from 'lucide-react';
import { DashboardData } from '../types/dashboard';
import { useAIChat } from '../hooks/useSupabaseAPI';
import { useToast } from '../hooks/use-toast';

interface AISuiteProps {
  data: DashboardData;
}

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export const AISuite = ({ data }: AISuiteProps) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const aiChatMutation = useAIChat();
  const { toast } = useToast();

  const aiTools = [
    {
      name: 'Content Generator',
      description: 'Generate patient communications, reports, and documentation',
      icon: FileText,
      status: 'active',
      usage: '24 generations this month'
    },
    {
      name: 'Smart Analytics',
      description: 'AI-powered insights and predictive analytics for clinic operations',
      icon: BarChart3,
      status: 'active',
      usage: '12 analyses completed'
    },
    {
      name: 'Virtual Assistant',
      description: 'Intelligent chatbot for patient inquiries and staff support',
      icon: MessageSquare,
      status: 'beta',
      usage: '156 conversations handled'
    },
    {
      name: 'Predictive Maintenance',
      description: 'AI-driven equipment maintenance scheduling and alerts',
      icon: Zap,
      status: 'coming-soon',
      usage: 'Available Q4 2024'
    }
  ];

  const recentGenerations = [
    {
      type: 'Patient Newsletter',
      content: 'Monthly health tips and clinic updates',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'Equipment Report',
      content: 'Automated maintenance summary for Q2',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      type: 'Patient Survey',
      content: 'Satisfaction survey with personalized questions',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ];

  const aiInsights = [
    {
      title: 'Optimal Scheduling',
      insight: 'AI suggests moving cardiology appointments to Tuesday mornings for 15% efficiency gain',
      confidence: 92
    },
    {
      title: 'Patient Flow',
      insight: 'Predict 20% increase in patient volume next month based on historical trends',
      confidence: 87
    },
    {
      title: 'Resource Allocation',
      insight: 'Room 3 underutilized - recommend converting to consultation space',
      confidence: 78
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'beta': return 'secondary';
      case 'coming-soon': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      default: return status;
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const messageToSend = chatMessage;
    setChatMessage('');

    try {
      const response = await aiChatMutation.mutateAsync({
        message: messageToSend,
        context: {
          clinicName: data.clinic.name,
          assets: data.assets,
          tasks: data.tasks,
          analytics: data.analytics,
          competitors: data.competitors
        }
      });

      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        message: messageToSend,
        response: response.response,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, newChatMessage]);

      toast({
        title: "AI Response",
        description: "AI has provided a response to your query."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      setChatMessage(messageToSend); // Restore message on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Suite</h1>
        </div>
        <Button>
          <Sparkles className="h-4 w-4 mr-2" />
          Explore AI Tools
        </Button>
      </div>

      {/* AI Chat Interface */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            AI Assistant Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat History */}
          <div className="max-h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-muted/20">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Start a conversation with the AI assistant</p>
                <p className="text-sm">Ask about your digital ecosystem, performance metrics, or get recommendations</p>
              </div>
            ) : (
              chatHistory.map((chat) => (
                <div key={chat.id} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                      <p className="text-sm">{chat.response}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask the AI about your digital ecosystem, performance, or get recommendations..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={aiChatMutation.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || aiChatMutation.isPending}
            >
              {aiChatMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card key={tool.name} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <Badge variant={getStatusColor(tool.status)}>
                    {getStatusText(tool.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{tool.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{tool.usage}</span>
                  <Button 
                    size="sm" 
                    variant={tool.status === 'active' ? 'default' : 'outline'}
                    disabled={tool.status === 'coming-soon'}
                  >
                    {tool.status === 'active' ? 'Launch' : tool.status === 'beta' ? 'Try Beta' : 'Coming Soon'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGenerations.map((generation, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{generation.type}</p>
                    <p className="text-xs text-muted-foreground">{generation.content}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs mb-1">
                      {generation.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{generation.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
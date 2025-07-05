import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// A helper function to get the auth token
const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('User is not authenticated.');
    }
    return session.access_token;
};


// --- Refactored Read Hooks ---
export const useKpiTimeSeries = () => {
    return useQuery({
        queryKey: ['kpi-time-series'],
        queryFn: async () => {
            const response = await fetch('/api/kpis');
            if (!response.ok) {
                throw new Error('Failed to fetch KPI time series');
            }
            const result = await response.json();
            return result.data; // Ensure we return the data property
        },
        staleTime: 5 * 60 * 1000,
        refetchInterval: 30 * 1000,
    });
};

export const useLatestKPIs = () => {
    return useQuery({
        queryKey: ['latest-kpis'],
        queryFn: async () => {
            const response = await fetch('/api/kpis');
            if (!response.ok) {
                throw new Error('Failed to fetch latest KPIs');
            }
            const result = await response.json();
            const data = result.data || [];
            
            // Group by metric_name and get the latest value for each
            const latestKPIs = data.reduce((acc: any, kpi: any) => {
                if (!acc[kpi.metric_name] || new Date(kpi.date) > new Date(acc[kpi.metric_name].date)) {
                    acc[kpi.metric_name] = kpi;
                }
                return acc;
            }, {});
            
            return latestKPIs;
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 30 * 1000,
    });
};


export const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        },
        staleTime: 2 * 60 * 1000,
    });
};

export const useReviews = () => {
    return useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            const response = await fetch('/api/reviews');
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useCompetitors = () => {
    return useQuery({
        queryKey: ['competitors'],
        queryFn: async () => {
            const response = await fetch('/api/competitors');
            if (!response.ok) {
                throw new Error('Failed to fetch competitors');
            }
            return response.json();
        },
        staleTime: 10 * 60 * 1000,
    });
};

export const useWebPages = () => {
    return useQuery({
        queryKey: ['web-pages'],
        queryFn: async () => {
            const response = await fetch('/api/web_pages');
            if (!response.ok) {
                throw new Error('Failed to fetch web pages');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useDigitalAssets = () => {
    return useQuery({
        queryKey: ['digital-assets'],
        queryFn: async () => {
            const response = await fetch('/api/digital_assets');
            if (!response.ok) {
                throw new Error('Failed to fetch digital assets');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useDocuments = () => {
    return useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            const response = await fetch('/api/documents');
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useAgentOutputs = () => {
    return useQuery({
        queryKey: ['agent-outputs'],
        queryFn: async () => {
            const response = await fetch('/api/agent_outputs');
            if (!response.ok) {
                throw new Error('Failed to fetch agent outputs');
            }
            return response.json();
        },
        staleTime: 2 * 60 * 1000,
    });
};


// --- Refactored Mutation Hooks (with authentication) ---

const createApiMutation = <T extends { id: number }>(
    entity: string,
    queryKey: string[]
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newItem: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/${entity}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newItem),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create ${entity}`);
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

const updateApiMutation = <T extends { id: number }>(
    entity: string,
    queryKey: string[]
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Partial<T> }) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/${entity}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                throw new Error(`Failed to update ${entity}`);
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

const deleteApiMutation = (entity: string, queryKey: string[]) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const token = await getAuthToken();
            const response = await fetch(`/api/${entity}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to delete ${entity}`);
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};

// Hook Definitions
export const useCreateTask = () => createApiMutation<Tables['tasks']['Row']>('tasks', ['tasks']);
export const useUpdateTask = () => updateApiMutation<Tables['tasks']['Row']>('tasks', ['tasks']);
export const useDeleteTask = () => deleteApiMutation('tasks', ['tasks']);

export const useCreateReview = () => createApiMutation<Tables['reviews']['Row']>('reviews', ['reviews']);
export const useUpdateReview = () => updateApiMutation<Tables['reviews']['Row']>('reviews', ['reviews']);
export const useDeleteReview = () => deleteApiMutation('reviews', ['reviews']);

export const useCreateCompetitor = () => createApiMutation<Tables['competitors']['Row']>('competitors', ['competitors']);
export const useUpdateCompetitor = () => updateApiMutation<Tables['competitors']['Row']>('competitors', ['competitors']);
export const useDeleteCompetitor = () => deleteApiMutation('competitors', ['competitors']);

export const useCreateWebPage = () => createApiMutation<Tables['web_pages']['Row']>('web_pages', ['web-pages']);
export const useUpdateWebPage = () => updateApiMutation<Tables['web_pages']['Row']>('web_pages', ['web-pages']);

export const useCreateDigitalAsset = () => createApiMutation<Tables['digital_assets']['Row']>('digital_assets', ['digital-assets']);
export const useUpdateDigitalAsset = () => updateApiMutation<Tables['digital_assets']['Row']>('digital_assets', ['digital-assets']);

export const useCreateDocument = () => createApiMutation<Tables['documents']['Row']>('documents', ['documents']);
export const useUpdateDocument = () => updateApiMutation<Tables['documents']['Row']>('documents', ['documents']);
export const useDeleteDocument = () => deleteApiMutation('documents', ['documents']);

export const useCreateAgentOutput = () => createApiMutation<Tables['agent_outputs']['Row']>('agent_outputs', ['agent-outputs']);
export const useUpdateAgentOutput = () => updateApiMutation<Tables['agent_outputs']['Row']>('agent_outputs', ['agent-outputs']);
export const useDeleteAgentOutput = () => deleteApiMutation('agent_outputs', ['agent-outputs']);


// AI Chat API hook (keeping the existing mock implementation for now)
export const useAIChat = () => {
  return useMutation({
    mutationFn: async ({ message, context }: { message: string; context?: any }) => {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let response = "This is a mocked AI response. The real Gemini API will be connected later.";
      
      if (message.toLowerCase().includes('competitor')) {
        response = "Based on your local market analysis, you're competing well with a 4.8-star rating above the average. Your comprehensive digital presence gives you a competitive advantage.";
      } else if (message.toLowerCase().includes('seo')) {
        response = "Your SEO performance shows strong potential. Domain Authority of 42 is good, and organic sessions are growing. Focus on content optimization and page speed improvements.";
      } else if (message.toLowerCase().includes('social')) {
        response = "Your social media presence needs attention. Instagram engagement is low compared to your other platforms. Consider increasing posting frequency and using more engaging content formats.";
      }
      
      return {
        response: response,
        timestamp: new Date().toISOString(),
        model: "mock-ai-v1"
      };
    },
  });
};
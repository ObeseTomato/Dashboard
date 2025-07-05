import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// A helper function to get the user's auth token for secure requests
const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('User is not authenticated.');
    }
    return session.access_token;
};

// A helper function to standardize fetching from your local API
const fetchFromApi = async (endpoint: string) => {
    const response = await fetch(endpoint);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch data from ${endpoint}`);
    }
    const result = await response.json();
    // This handles cases where your API returns { data: [...] } or just [...]
    return result.data || result;
};


// --- HOOKS FOR READING DATA ---

export const useKpiTimeSeries = () => {
    return useQuery({
        queryKey: ['kpi-time-series'],
        queryFn: () => fetchFromApi('/api/kpis'),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 30 * 1000,
    });
};

export const useLatestKPIs = () => {
    // This hook now uses the same data as useKpiTimeSeries
    // but processes it on the client-side to find the latest values.
    const { data, ...rest } = useKpiTimeSeries();
  
    const latestKPIs = data ? data.reduce((acc: any, kpi: any) => {
        if (!acc[kpi.metric_name] || new Date(kpi.date) > new Date(acc[kpi.metric_name].date)) {
            acc[kpi.metric_name] = kpi;
        }
        return acc;
    }, {}) : {};

    return { data: latestKPIs, ...rest };
};

export const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: () => fetchFromApi('/api/tasks'),
        staleTime: 2 * 60 * 1000,
    });
};

export const useReviews = () => {
    return useQuery({
        queryKey: ['reviews'],
        queryFn: () => fetchFromApi('/api/reviews'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCompetitors = () => {
    return useQuery({
        queryKey: ['competitors'],
        queryFn: () => fetchFromApi('/api/competitors'),
        staleTime: 10 * 60 * 1000,
    });
};

export const useWebPages = () => {
    return useQuery({
        queryKey: ['web-pages'],
        queryFn: () => fetchFromApi('/api/web_pages'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useDigitalAssets = () => {
    return useQuery({
        queryKey: ['digital-assets'],
        queryFn: () => fetchFromApi('/api/digital_assets'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useDocuments = () => {
    return useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            // Assuming you will create an /api/documents.js endpoint
            const response = await fetch('/api/documents');
            if (!response.ok) throw new Error('Failed to fetch documents');
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useAgentOutputs = () => {
    return useQuery({
        queryKey: ['agent-outputs'],
        queryFn: async () => {
             // Assuming you will create an /api/agent_outputs.js endpoint
            const response = await fetch('/api/agent_outputs');
            if (!response.ok) throw new Error('Failed to fetch agent outputs');
            return response.json();
        },
        staleTime: 2 * 60 * 1000,
    });
};


// --- HOOKS FOR WRITING DATA (Mutations) ---

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTask: Tables['tasks']['Insert']) => {
            const token = await getAuthToken();
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create task');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Tables['tasks']['Update'] }) => {
            const token = await getAuthToken();
            // Note: This assumes your api/tasks.js can handle PUT requests.
            const response = await fetch(`/api/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id, ...updates }),
            });
            if (!response.ok) throw new Error('Failed to update task');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const token = await getAuthToken();
            // Note: This assumes your api/tasks.js can handle DELETE requests.
            const response = await fetch(`/api/tasks`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete task');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

// Placeholder mutations for other entities
// You can expand these following the useCreateTask pattern

export const useCreateWebPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newPage: Tables['web_pages']['Insert']) => {
            // TODO: Implement API call to POST /api/web_pages
            console.log("Creating web page:", newPage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['web-pages'] });
        },
    });
};

export const useUpdateWebPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Tables['web_pages']['Update'] }) => {
            // TODO: Implement API call to PUT /api/web_pages
            console.log("Updating web page:", id, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['web-pages'] });
        },
    });
};

export const useCreateDigitalAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newAsset: Tables['digital_assets']['Insert']) => {
            // TODO: Implement API call to POST /api/digital_assets
            console.log("Creating asset:", newAsset);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
        },
    });
};

export const useUpdateDigitalAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Tables['digital_assets']['Update'] }) => {
            // TODO: Implement API call to PUT /api/digital_assets
            console.log("Updating asset:", id, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
        },
    });
};

// --- AI HOOK ---
export const useAIChat = () => {
    return useMutation({
      mutationFn: async ({ message, context }: { message: string; context?: any }) => {
        // This will eventually call /api/ai/chat
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let response = "This is a mocked AI response. The real Gemini API will be connected later.";
        if (message.toLowerCase().includes('competitor')) {
          response = "Based on your local market analysis, you're competing well with a 4.8-star rating above the average. Your comprehensive digital presence gives you a competitive advantage.";
        }
        
        return {
          response: response,
          timestamp: new Date().toISOString(),
          model: "mock-ai-v1"
        };
      },
    });
  };

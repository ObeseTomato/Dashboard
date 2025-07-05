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
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch data from ${endpoint}`);
        }
        const result = await response.json();
        // This handles cases where your API returns { data: [...] } or just [...]
        return result.data || result;
    } catch (error) {
        console.error(`API fetch error from ${endpoint}:`, error);
        throw error;
    }
};


// --- HOOKS FOR READING DATA ---

export const useKpiTimeSeries = () => {
    return useQuery<Tables['kpi_time_series']['Row'][], Error>({
        queryKey: ['kpi-time-series'],
        queryFn: () => fetchFromApi('/api/kpis'),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 30 * 1000,
    });
};

export const useLatestKPIs = () => {
    // This hook derives its data from the main time-series query
    const { data, ...rest } = useKpiTimeSeries();
  
    const latestKPIs = data ? data.reduce((acc: Record<string, Tables['kpi_time_series']['Row']>, kpi) => {
        if (!acc[kpi.metric_name] || new Date(kpi.date) > new Date(acc[kpi.metric_name].date)) {
            acc[kpi.metric_name] = kpi;
        }
        return acc;
    }, {}) : {};

    return { data: latestKPIs, ...rest };
};

export const useTasks = () => {
    return useQuery<Tables['tasks']['Row'][], Error>({
        queryKey: ['tasks'],
        queryFn: () => fetchFromApi('/api/tasks'),
        staleTime: 2 * 60 * 1000,
    });
};

export const useReviews = () => {
    return useQuery<Tables['reviews']['Row'][], Error>({
        queryKey: ['reviews'],
        queryFn: () => fetchFromApi('/api/reviews'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCompetitors = () => {
    return useQuery<Tables['competitors']['Row'][], Error>({
        queryKey: ['competitors'],
        queryFn: () => fetchFromApi('/api/competitors'),
        staleTime: 10 * 60 * 1000,
    });
};

export const useWebPages = () => {
    return useQuery<Tables['web_pages']['Row'][], Error>({
        queryKey: ['web-pages'],
        queryFn: () => fetchFromApi('/api/web_pages'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useDigitalAssets = () => {
    return useQuery<Tables['digital_assets']['Row'][], Error>({
        queryKey: ['digital-assets'],
        queryFn: () => fetchFromApi('/api/digital_assets'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useDocuments = () => {
    return useQuery<Tables['documents']['Row'][], Error>({
        queryKey: ['documents'],
        queryFn: () => fetchFromApi('/api/documents'),
        staleTime: 5 * 60 * 1000,
    });
};

export const useAgentOutputs = () => {
    return useQuery<Tables['agent_outputs']['Row'][], Error>({
        queryKey: ['agent-outputs'],
        queryFn: () => fetchFromApi('/api/agent_outputs'),
        staleTime: 2 * 60 * 1000,
    });
};


// --- HOOKS FOR WRITING DATA (Mutations) ---

// Generic mutation function factory
const createApiMutation = <TVariables, TData>(
    entity: string,
    method: 'POST' | 'PUT' | 'DELETE',
    queryKeyToInvalidate: string[]
) => {
    const queryClient = useQueryClient();
    return useMutation<TData, Error, TVariables>({
        mutationFn: async (variables) => {
            const token = await getAuthToken();
            // Handle ID for PUT/DELETE in URL
            const endpoint = (method === 'PUT' || method === 'DELETE') && variables && 'id' in variables
                ? `/api/${entity}/${(variables as any).id}`
                : `/api/${entity}`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: method !== 'GET' ? JSON.stringify(variables) : undefined,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${method.toLowerCase()} ${entity}`);
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
        },
    });
};

// Task Mutations
export const useCreateTask = () => createApiMutation<Tables['tasks']['Insert'], Tables['tasks']['Row']>('tasks', 'POST', ['tasks']);
export const useUpdateTask = () => createApiMutation<{ id: number; updates: Tables['tasks']['Update'] }, Tables['tasks']['Row']>('tasks', 'PUT', ['tasks']);
export const useDeleteTask = () => createApiMutation<{ id: number }, { id: number }>('tasks', 'DELETE', ['tasks']);

// Web Page Mutations
export const useCreateWebPage = () => createApiMutation<Tables['web_pages']['Insert'], Tables['web_pages']['Row']>('web_pages', 'POST', ['web-pages']);
export const useUpdateWebPage = () => createApiMutation<{ id: number; updates: Tables['web_pages']['Update'] }, Tables['web_pages']['Row']>('web_pages', 'PUT', ['web-pages']);

// Digital Asset Mutations
export const useCreateDigitalAsset = () => createApiMutation<Tables['digital_assets']['Insert'], Tables['digital_assets']['Row']>('digital_assets', 'POST', ['digital-assets']);
export const useUpdateDigitalAsset = () => createApiMutation<{ id: number; updates: Tables['digital_assets']['Update'] }, Tables['digital_assets']['Row']>('digital_assets', 'PUT', ['digital-assets']);

// Review Mutations
export const useCreateReview = () => createApiMutation<Tables['reviews']['Insert'], Tables['reviews']['Row']>('reviews', 'POST', ['reviews']);
export const useUpdateReview = () => createApiMutation<{ id: number; updates: Tables['reviews']['Update'] }, Tables['reviews']['Row']>('reviews', 'PUT', ['reviews']);
export const useDeleteReview = () => createApiMutation<{id: number}, {id: number}>('reviews', 'DELETE', ['reviews']);

// Competitor Mutations
export const useCreateCompetitor = () => createApiMutation<Tables['competitors']['Insert'], Tables['competitors']['Row']>('competitors', 'POST', ['competitors']);
export const useUpdateCompetitor = () => createApiMutation<{ id: number; updates: Tables['competitors']['Update'] }, Tables['competitors']['Row']>('competitors', 'PUT', ['competitors']);
export const useDeleteCompetitor = () => createApiMutation<{id: number}, {id: number}>('competitors', 'DELETE', ['competitors']);

// Document Mutations
export const useCreateDocument = () => createApiMutation<Tables['documents']['Insert'], Tables['documents']['Row']>('documents', 'POST', ['documents']);
export const useUpdateDocument = () => createApiMutation<{ id: number; updates: Tables['documents']['Update'] }, Tables['documents']['Row']>('documents', 'PUT', ['documents']);
export const useDeleteDocument = () => createApiMutation<{id: number}, {id: number}>('documents', 'DELETE', ['documents']);

// Agent Output Mutations
export const useCreateAgentOutput = () => createApiMutation<Tables['agent_outputs']['Insert'], Tables['agent_outputs']['Row']>('agent_outputs', 'POST', ['agent-outputs']);
export const useUpdateAgentOutput = () => createApiMutation<{ id: number; updates: Tables['agent_outputs']['Update'] }, Tables['agent_outputs']['Row']>('agent_outputs', 'PUT', ['agent-outputs']);
export const useDeleteAgentOutput = () => createApiMutation<{id: number}, {id: number}>('agent_outputs', 'DELETE', ['agent-outputs']);


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

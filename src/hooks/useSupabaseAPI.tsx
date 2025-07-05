import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// KPI Time Series API hooks (renamed from useKPIs)
export const useKpiTimeSeries = () => {
  return useQuery({
    queryKey: ['kpi-time-series'],
    queryFn: async () => {
      const { data, error } = await supabase // Direct call to Supabase
        .from('kpi-time-series')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
};

// Get latest KPI values for dashboard
export const useLatestKPIs = () => {
  return useQuery({
    queryKey: ['latest-kpis'],
    queryFn: async () => {
      // Get the most recent KPI values for each metric
      const { data, error } = await supabase
        .from('kpi_time_series')
        .select('metric_name, metric_value, date, source')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Group by metric_name and get the latest value for each
      const latestKPIs = data.reduce((acc: any, kpi: any) => {
        if (!acc[kpi.metric_name] || new Date(kpi.date) > new Date(acc[kpi.metric_name].date)) {
          acc[kpi.metric_name] = kpi;
        }
        return acc;
      }, {});
      
      return latestKPIs;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Tasks API hooks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTask: Tables['tasks']['Insert']) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Web Pages API hooks
export const useWebPages = () => {
  return useQuery({
    queryKey: ['web-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('web_pages')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWebPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPage: Tables['web_pages']['Insert']) => {
      const { data, error } = await supabase
        .from('web_pages')
        .insert(newPage)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('web_pages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-pages'] });
    },
  });
};

// Digital Assets API hooks
export const useDigitalAssets = () => {
  return useQuery({
    queryKey: ['digital-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateDigitalAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newAsset: Tables['digital_assets']['Insert']) => {
      const { data, error } = await supabase
        .from('digital_assets')
        .insert(newAsset)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('digital_assets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
    },
  });
};

// In src/hooks/useSupabaseAPI.tsx
export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase // Direct call to Supabase
        .from('reviews')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newReview: Tables['reviews']['Insert']) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(newReview)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Tables['reviews']['Update'] }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// Competitors API hooks
export const useCompetitors = () => {
  return useQuery({
    queryKey: ['competitors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCompetitor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newCompetitor: Tables['competitors']['Insert']) => {
      const { data, error } = await supabase
        .from('competitors')
        .insert(newCompetitor)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
  });
};

export const useUpdateCompetitor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Tables['competitors']['Update'] }) => {
      const { data, error } = await supabase
        .from('competitors')
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
  });
};

export const useDeleteCompetitor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
    },
  });
};

// Documents API hooks
export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newDocument: Tables['documents']['Insert']) => {
      const { data, error } = await supabase
        .from('documents')
        .insert(newDocument)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Tables['documents']['Update'] }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

// Agent Outputs API hooks
export const useAgentOutputs = () => {
  return useQuery({
    queryKey: ['agent-outputs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_outputs')
        .select('*')
        .order('run_timestamp', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateAgentOutput = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newOutput: Tables['agent_outputs']['Insert']) => {
      const { data, error } = await supabase
        .from('agent_outputs')
        .insert(newOutput)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-outputs'] });
    },
  });
};

export const useUpdateAgentOutput = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Tables['agent_outputs']['Update'] }) => {
      const { data, error } = await supabase
        .from('agent_outputs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-outputs'] });
    },
  });
};

export const useDeleteAgentOutput = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('agent_outputs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-outputs'] });
    },
  });
};

// AI Chat API hook (keeping the existing mock implementation)
export const useAIChat = () => {
  return useMutation({
    mutationFn: async ({ message, context }: { message: string; context?: any }) => {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI responses based on message content
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
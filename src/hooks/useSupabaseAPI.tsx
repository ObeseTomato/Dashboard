import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// --- READ HOOKS (Direct to Supabase) ---

export const useKpiTimeSeries = () => {
  return useQuery({
    queryKey: ['kpi-time-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_time_series')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useLatestKPIs = () => {
  const { data: kpiData, ...rest } = useKpiTimeSeries();
  
  const latestKPIs = kpiData ? kpiData.reduce((acc: any, kpi: any) => {
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
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      return data;
    },
  });
};

export const useReviews = () => {
    return useQuery({
      queryKey: ['reviews'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      },
    });
  };
  
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
    });
  };
  
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
    });
  };
  
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
    });
  };

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
    });
  };
  
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
    });
  };

// --- WRITE HOOKS (Mutations) ---

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTask: Omit<Tables['tasks']['Insert'], 'user_id'>) => {
      // **THE FIX FOR THE RLS ERROR**
      // 1. Get the current authenticated user.
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated to create a task.");
      }

      // 2. Add the user's ID to the new task object.
      const taskWithUser = {
        ...newTask,
        user_id: user.id
      };
      
      // 3. Insert the complete object.
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskWithUser)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase request failed", {
            message: error.message,
            details: error.details,
            code: error.code
        });
        throw error;
      }
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

export const useCreateWebPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newPage: Tables['web_pages']['Insert']) => {
        const { data, error } = await supabase.from('web_pages').insert(newPage).select().single();
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
        const { data, error } = await supabase.from('web_pages').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
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
        const { data, error } = await supabase.from('digital_assets').insert(newAsset).select().single();
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
        const { data, error } = await supabase.from('digital_assets').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
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
        // This is a mock implementation.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let response = "This is a mocked AI response. The real Gemini API will be connected later.";
        if (message.toLowerCase().includes('competitor')) {
          response = "Based on your local market analysis, you're competing well with a 4.8-star rating above the average.";
        }
        
        return {
          response: response,
          timestamp: new Date().toISOString(),
          model: "mock-ai-v1"
        };
      },
    });
  };

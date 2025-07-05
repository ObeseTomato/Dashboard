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
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
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
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useWebPages = () => {
    return useQuery({
        queryKey: ['web-pages'],
        queryFn: async () => {
            const response = await fetch('/api/web-pages');
            if (!response.ok) {
                throw new Error('Failed to fetch web pages');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useDigitalAssets = () => {
    return useQuery({
        queryKey: ['digital-assets'],
        queryFn: async () => {
            const response = await fetch('/api/digital-assets');
            if (!response.ok) {
                throw new Error('Failed to fetch digital assets');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};


// --- Refactored Mutation Hooks (with authentication) ---

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
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
       if (!response.ok) {
        throw new Error('Failed to update task');
      }
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
       const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
       if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
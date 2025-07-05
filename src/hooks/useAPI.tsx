import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API base configuration
const API_BASE = '/api';

// KPI API hooks
export const useKPIs = () => {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/kpis`);
      if (!response.ok) {
        throw new Error('Failed to fetch KPIs');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Tasks API hooks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: any) => {
      // --- START OF FIX ---
      // Get the current session which contains the access token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User is not authenticated.');
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the user's token in the Authorization header
          'Authorization': `Bearer ${session.access_token}`,
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
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const data = await response.json();
      return data.data;
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
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      const data = await response.json();
      return data.data;
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
      const response = await fetch(`${API_BASE}/web-pages`);
      if (!response.ok) {
        throw new Error('Failed to fetch web pages');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWebPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPage: any) => {
      const response = await fetch(`${API_BASE}/web-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPage),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create web page');
      }
      
      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-pages'] });
    },
  });
};

export const useUpdateWebPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`${API_BASE}/web-pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update web page');
      }
      
      const data = await response.json();
      return data.data;
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
      const response = await fetch(`${API_BASE}/digital-assets`);
      if (!response.ok) {
        throw new Error('Failed to fetch digital assets');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateDigitalAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newAsset: any) => {
      const response = await fetch(`${API_BASE}/digital-assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsset),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create digital asset');
      }
      
      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
    },
  });
};

export const useUpdateDigitalAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`${API_BASE}/digital-assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update digital asset');
      }
      
      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-assets'] });
    },
  });
};

// Blog Posts API hooks
export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/blog-posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: any) => {
      const response = await fetch(`${API_BASE}/blog-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
      
      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

// Social Media Posts API hooks
export const useSocialMediaPosts = (platform?: string, status?: string) => {
  return useQuery({
    queryKey: ['social-media-posts', platform, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (platform) params.append('platform', platform);
      if (status) params.append('status', status);
      
      const response = await fetch(`${API_BASE}/social-media-posts?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch social media posts');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateSocialMediaPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: any) => {
      const response = await fetch(`${API_BASE}/social-media-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create social media post');
      }
      
      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media-posts'] });
    },
  });
};

// AI Chat API hook
export const useAIChat = () => {
  return useMutation({
    mutationFn: async ({ message, context }: { message: string; context?: any }) => {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message to AI');
      }
      
      const data = await response.json();
      return data.data;
    },
  });
};
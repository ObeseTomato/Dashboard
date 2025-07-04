import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase admin client using server-side environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  // Handle creating a new task
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const newTaskData = {
        ...req.body,
        user_id: user.id // This satisfies the RLS policy
      };

      const { data, error } = await supabase.from('tasks').insert(newTaskData).select().single();

      if (error) throw error;
      return res.status(201).json({ data });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle fetching all tasks
  if (req.method === 'GET') {
    try {
        const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
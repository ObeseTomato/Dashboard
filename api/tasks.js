import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase admin client using server-side environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // 1. Get the Authorization header from the incoming request
      const token = req.headers.authorization?.split(' ')[1];

      // 2. Use the token to get the user's identity from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      // 3. If no user is found, return an unauthorized error.
      if (userError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
      }

      // 4. Create the new task object, merging the user's ID
      const newTaskData = {
        ...req.body, // The data sent from the frontend
        user_id: user.id // This is the crucial line that satisfies the RLS policy
      };

      // 5. Insert the new object into the database
      const { data: createdTask, error: insertError } = await supabase
        .from('tasks')
        .insert(newTaskData)
        .select()
        .single();

      if (insertError) throw insertError;
      return res.status(201).json(createdTask);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle GET requests or other methods
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
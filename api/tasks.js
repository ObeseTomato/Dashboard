import { createClient } from '@supabase/supabase-js';

// Initialize the server-side Supabase client with the service_role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  // --- Handle Fetching All Tasks (for the main view) ---
  if (req.method === 'GET') {
    try {
        // RLS policies will automatically filter this for the authenticated user
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  }

  // --- Handle Creating a New Task (The part that needs fixing) ---
  if (req.method === 'POST') {
    try {
      // 1. Get the user's authentication token from the request header.
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Authentication token not provided.' });
      }

      // 2. Use the token to get the user's identity securely from Supabase.
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
      }

      // 3. Create the new task object, adding the verified user's ID.
      const newTaskData = {
        ...req.body,
        user_id: user.id  // This satisfies your RLS policy.
      };

      // 4. Insert the complete task object into the database.
      const { data: createdTask, error: insertError } = await supabase
        .from('tasks')
        .insert(newTaskData)
        .select()
        .single();

      if (insertError) {
        // Provide a more specific error message if it's an RLS violation.
        if (insertError.code === '42501') {
             return res.status(403).json({ error: 'Forbidden: You do not have permission to create this task.' });
        }
        throw insertError;
      }

      // 5. Return the newly created task to the frontend.
      return res.status(201).json(createdTask);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle any other HTTP methods.
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
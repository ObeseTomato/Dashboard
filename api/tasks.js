import { createClient } from '@supabase/supabase-js';

// This initializes the Supabase client on the server using secure, private environment variables.
// It's different from the client you use on the frontend.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  // --- Handle Creating a New Task ---
  if (req.method === 'POST') {
    try {
      // 1. Get the user's authentication token from the request header.
      const token = req.headers.authorization?.split(' ')[1];

      // 2. Use the token to get the user's identity securely from Supabase.
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      // 3. If no user is found or the token is invalid, block the request.
      if (userError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
      }

      // 4. Create the new task object, adding the user's ID to the data from the frontend.
      const newTaskData = {
        ...req.body,      // Data from the request (e.g., task_name, description)
        user_id: user.id  // This is the crucial line that satisfies your RLS policy.
      };

      // 5. Insert the complete task object into the database.
      const { data: createdTask, error: insertError } = await supabase
        .from('tasks')
        .insert(newTaskData)
        .select()
        .single();

      if (insertError) {
        // Provide a specific error message if it's an RLS violation.
        if (insertError.code === '42501') {
             return res.status(403).json({ error: 'Forbidden: You do not have permission to create this task.' });
        }
        throw insertError;
      }

      // 6. Return the newly created task to the frontend.
      return res.status(201).json(createdTask);

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- Handle Fetching All Tasks (for the main view) ---
  if (req.method === 'GET') {
    try {
        // Note: RLS policies will automatically filter this to only show tasks
        // for the currently authenticated user if you call this from the frontend.
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

  // Handle any other HTTP methods.
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
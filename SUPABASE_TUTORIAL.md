# How to Connect a React App to Supabase

This guide explains how to integrate Supabase into a React application for data persistence, replacing local storage or other backends.

## Prerequisites

1.  **Supabase Account**: Sign up at [supabase.com](https://supabase.com).
2.  **React App**: An existing React application (created with Vite, CRA, etc.).

## Step 1: Create a Supabase Project

1.  Log in to your Supabase dashboard.
2.  Click **"New Project"**.
3.  Choose your organization, enter a name (e.g., `todo-app`), and set a strong database password.
4.  Select a region close to your users.
5.  Click **"Create new project"**.

## Step 2: Set up the Database

1.  Once the project is created, go to the **Table Editor** (icon on the left).
2.  Click **"New Table"**.
3.  Name the table `todos`.
4.  Enable **Row Level Security (RLS)** (recommended).
5.  Add columns:
    *   `id`: int8, Primary Key (default)
    *   `created_at`: timestamptz, default `now()` (default)
    *   `text`: text
    *   `completed`: boolean, default `false`
    *   `due_date`: timestamptz (optional, for due dates)
    *   `user_id`: text (changed from uuid to support Auth0 IDs)
6.  Click **"Save"**.

## Step 3: Install Supabase Client

In your React project directory, run:

```bash
npm install @supabase/supabase-js
```

## Step 4: Configure Environment Variables

### Local Development
Create a `.env` file in your project root (or `.env.local` for Next.js/Vite):

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

*   **URL**: Found in Settings > API > Project URL.
*   **Anon Key**: Found in Settings > API > Project API keys.

### GitHub Pages Deployment (GitHub Secrets)
To secure your credentials during deployment, use GitHub Secrets instead of committing the `.env` file.

1.  Go to your GitHub repository.
2.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Add the following secrets:
    *   Name: `VITE_SUPABASE_URL`, Value: Your Supabase Project URL
    *   Name: `VITE_SUPABASE_ANON_KEY`, Value: Your Supabase Anon Key
5.  The `deploy.yml` workflow is already configured to use these secrets during the build process.

## Step 5: Initialize Supabase Client

Create a file `src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Step 6: Create a Service Layer (Optional but Recommended)

Create `src/service/TodoService.js` to handle API calls:

```javascript
import { supabase } from '../supabaseClient';

export const TodoService = {
  async getTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addTodo(text, userId) {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text, completed: false, user_id: userId }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateTodo(id, updates) {
    const { error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
```

## Step 7: Integrate in Components/ViewModel

Replace your local storage logic with calls to `TodoService`.

**Example (using useEffect):**

```javascript
useEffect(() => {
  const fetchTodos = async () => {
    try {
      const todos = await TodoService.getTodos();
      setTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  fetchTodos();
}, []);
```

## Step 8: Row Level Security (RLS) Policies

The easiest way to set up RLS is to run the standard SQL commands in the **SQL Editor**.

1.  Go to the **SQL Editor** (icon on the left sidebar).
2.  Click **"New query"**.
3.  Paste and run the following SQL commands one by one (or all together):

### Using Supabase Auth (Recommended)

Since we are using **Supabase Auth** directly, we can leverage the built-in `auth.uid()` function to secure our data. This ensures that a user can **only** see and modify their own rows.

> [!IMPORTANT]
> **Type Casting**: In this project, we defined `user_id` as `TEXT` to support potential legacy data or external providers. Therefore, we cast `auth.uid()` (which is a UUID) to `text` in our policies.

```sql
-- 1. Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 2. Policy for SELECT (Read)
-- "Users can only see their own todos"
CREATE POLICY "Users can view their own todos"
ON todos FOR SELECT
USING (auth.uid()::text = user_id);

-- 3. Policy for INSERT (Create)
-- "Users can only create todos for themselves"
CREATE POLICY "Users can create their own todos"
ON todos FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- 4. Policy for UPDATE (Edit)
-- "Users can update their own todos, but cannot transfer them to others"
CREATE POLICY "Users can update their own todos"
ON todos FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- 5. Policy for DELETE (Remove)
-- "Users can delete their own todos"
CREATE POLICY "Users can delete their own todos"
ON todos FOR DELETE
USING (auth.uid()::text = user_id);
```

### Why not Auth0?

While Auth0 is powerful, using it with Supabase RLS requires setting up custom JWT processing or using "permissive" policies that rely on the client to send the right ID (insecure). By using **Supabase Auth**, we get:
1.  **Automatic Security**: RLS works out of the box with `auth.uid()`.
2.  **No Type Mismatches**: User IDs are natively understood by the database.
3.  **Simplicity**: One SDK for both database and authentication.

Now, your app is connected to a scalable, real-time database with secure data access!

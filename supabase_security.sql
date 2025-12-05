-- Enable Row Level Security (RLS) on the todos table
alter table todos enable row level security;

-- 1. Allow users to VIEW their own todos
create policy "Users can view their own todos"
on todos for select
using ( auth.uid()::text = user_id );

-- 2. Allow users to CREATE their own todos
-- This ensures that the user_id in the new record matches the authenticated user's ID
create policy "Users can create their own todos"
on todos for insert
with check ( auth.uid()::text = user_id );

-- 3. Allow users to UPDATE their own todos
create policy "Users can update their own todos"
on todos for update
using ( auth.uid()::text = user_id )
with check ( auth.uid()::text = user_id );

-- 4. Allow users to DELETE their own todos
create policy "Users can delete their own todos"
on todos for delete
using ( auth.uid()::text = user_id );

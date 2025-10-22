-- Add INSERT policy for user_roles so users can set their role during signup
create policy "Users can insert their own role during signup"
  on public.user_roles for insert
  with check (auth.uid() = user_id);
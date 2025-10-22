-- Create enum for user roles
create type public.app_role as enum ('faculty', 'student');

-- Create enum for departments
create type public.department_type as enum ('CSE', 'IT', 'ECE', 'MECH', 'CIVIL');

-- Create enum for year
create type public.year_type as enum ('1st', '2nd', '3rd', '4th');

-- Create profiles table for user information
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create function to check user role
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create notices table
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  department department_type not null,
  year year_type not null,
  expiry_date date not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on notices
alter table public.notices enable row level security;

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- Create trigger for profiles updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

-- Create trigger for notices updated_at
create trigger update_notices_updated_at
  before update on public.notices
  for each row
  execute function public.update_updated_at_column();

-- Profiles RLS Policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User roles RLS Policies
create policy "Users can view all roles"
  on public.user_roles for select
  using (true);

-- Notices RLS Policies
create policy "Anyone can view active notices"
  on public.notices for select
  using (true);

create policy "Faculty can insert notices"
  on public.notices for insert
  with check (public.has_role(auth.uid(), 'faculty'));

create policy "Faculty can update their own notices"
  on public.notices for update
  using (
    public.has_role(auth.uid(), 'faculty') 
    and created_by = auth.uid()
  );

create policy "Faculty can delete their own notices"
  on public.notices for delete
  using (
    public.has_role(auth.uid(), 'faculty') 
    and created_by = auth.uid()
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.email
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
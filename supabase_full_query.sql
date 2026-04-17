-- ==========================================
-- PHASE 1: PROFILES & AUTHENTICATION
-- ==========================================

-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  github_url text,
  bio text,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- PHASE 2: LOGS, SKILLS & CALENDAR
-- ==========================================

-- Create logs table
CREATE TABLE if not exists logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  hours numeric DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  log_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create skills table
CREATE TABLE if not exists skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  color text,
  target_hours numeric DEFAULT 0,
  started_at date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create log_skills junction table
CREATE TABLE if not exists log_skills (
  log_id uuid REFERENCES public.logs(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  hours_spent numeric DEFAULT 0,
  PRIMARY KEY (log_id, skill_id)
);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_skills ENABLE ROW LEVEL SECURITY;

-- Policies for logs
drop policy if exists "Users can manage their own logs." on logs;
CREATE POLICY "Users can manage their own logs." ON logs
  FOR ALL USING (auth.uid() = user_id);

drop policy if exists "Public logs are viewable by everyone." on logs;
CREATE POLICY "Public logs are viewable by everyone." ON logs
  FOR SELECT USING (is_public = true);

-- Policies for skills
drop policy if exists "Users can manage their own skills." on skills;
CREATE POLICY "Users can manage their own skills." ON skills
  FOR ALL USING (auth.uid() = user_id);

-- Policies for log_skills
drop policy if exists "Users can manage log_skills if they own the log" on log_skills;
CREATE POLICY "Users can manage log_skills if they own the log" ON log_skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM logs WHERE logs.id = log_skills.log_id AND logs.user_id = auth.uid()
    )
  );
